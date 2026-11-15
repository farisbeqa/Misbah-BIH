// Translates the website's interface texts from Bosnian into the other languages:
//   npm run i18n:translate                 – new and changed texts, all languages
//   npm run i18n:translate -- --locale de  – one language
//   npm run i18n:translate -- --ns home    – one namespace
//   npm run i18n:translate -- --force      – everything again (overwrites hand edits)
//
// Source: messages/bs/<namespace>.json. Output: messages/<locale>/<namespace>.json.
// messages/.translation-lock.json remembers which Bosnian text each translation
// was made from, so a text is only re-translated when its Bosnian source changes
// and hand edits of translations survive.
//
// Needs AWS credentials with access to Claude on Amazon Bedrock, e.g.
//   AWS_PROFILE=AdministratorAccess-770324276704 npm run i18n:translate
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { parse, TYPE, type MessageFormatElement } from '@formatjs/icu-messageformat-parser'
import { TARGET_LOCALES, mapLimit, translateSegments, usageReport, type TargetLocale } from '../../lambda/translator/claude'
import { NAMESPACES } from '../../src/i18n/namespaces'

type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

const LOCK_FILE = 'messages/.translation-lock.json'

const args = process.argv.slice(2)
const flag = (name: string) => {
  const i = args.indexOf(name)
  return i === -1 ? undefined : args[i + 1]
}
const onlyLocale = flag('--locale') as TargetLocale | undefined
const onlyNs = flag('--ns')
const force = args.includes('--force')

const hash = (s: string) => createHash('sha1').update(s).digest('hex').slice(0, 16)
const readJson = (file: string): Json => (existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {})

/** All string leaves with their path */
function leaves(value: Json, path: string[] = [], out: { path: string[]; text: string }[] = []) {
  if (typeof value === 'string') out.push({ path, text: value })
  else if (Array.isArray(value)) value.forEach((v, i) => leaves(v, [...path, String(i)], out))
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) leaves(v, [...path, k], out)
  return out
}

function getAt(value: Json, path: string[]): Json | undefined {
  let cur: Json | undefined = value
  for (const key of path) {
    if (cur === null || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, Json>)[key]
  }
  return cur
}

/** Copy of `source` with string leaves replaced through `fn` */
function mapStrings(source: Json, fn: (path: string[], text: string) => string, path: string[] = []): Json {
  if (typeof source === 'string') return fn(path, source)
  if (Array.isArray(source)) return source.map((v, i) => mapStrings(v, fn, [...path, String(i)]))
  if (source && typeof source === 'object') {
    return Object.fromEntries(Object.entries(source).map(([k, v]) => [k, mapStrings(v, fn, [...path, k])]))
  }
  return source
}

/** Names of the ICU arguments ({count}, {name}, <b>) used in a message, or null if it is not valid ICU */
function icuArguments(message: string): string[] | null {
  try {
    const names = new Set<string>()
    const walk = (els: MessageFormatElement[]) => {
      for (const el of els) {
        if (el.type === TYPE.argument || el.type === TYPE.number || el.type === TYPE.date || el.type === TYPE.time) names.add(el.value)
        if (el.type === TYPE.plural || el.type === TYPE.select) {
          names.add(el.value)
          for (const opt of Object.values(el.options)) walk(opt.value)
        }
        if (el.type === TYPE.tag) {
          names.add(`<${el.value}>`)
          walk(el.children)
        }
      }
    }
    walk(parse(message))
    return Array.from(names).sort()
  } catch {
    return null
  }
}

function validTranslation(source: string, translated: string): boolean {
  const want = icuArguments(source)
  if (want === null) return true // raw text read with t.raw(), not parsed as ICU
  const got = icuArguments(translated)
  return got !== null && got.join('|') === want.join('|')
}

async function translateNamespace(locale: TargetLocale, ns: string, lock: Record<string, Record<string, string>>) {
  const sourceFile = `messages/bs/${ns}.json`
  if (!existsSync(sourceFile)) return { ns, locale, translated: 0, kept: 0, failed: 0 }
  const source = readJson(sourceFile)
  const targetFile = `messages/${locale}/${ns}.json`
  const target = readJson(targetFile)
  const lockKey = `${locale}/${ns}`
  const oldLock = lock[lockKey] ?? {}
  const newLock: Record<string, string> = {}

  const todo: { key: string; text: string }[] = []
  for (const { path, text } of leaves(source)) {
    const key = path.join('.')
    const existing = getAt(target, path)
    if (!force && typeof existing === 'string' && oldLock[key] === hash(text)) continue
    todo.push({ key, text })
  }

  const results = new Map<string, string>()
  let failed = 0
  if (todo.length) {
    const out = await translateSegments(todo.map(t => t.text), locale, {
      kind: 'ui',
      notes: `Interface texts of the "${ns}" part of the website.`,
    })
    for (let i = 0; i < todo.length; i++) {
      let value = out[i]
      if (!validTranslation(todo[i].text, value)) {
        // One more try on its own before giving up
        const [retry] = await translateSegments([todo[i].text], locale, { kind: 'ui', notes: 'Keep every {placeholder} and ICU plural/select structure exactly.' })
        value = retry
      }
      if (validTranslation(todo[i].text, value)) {
        results.set(todo[i].key, value)
      } else {
        failed++
        console.warn(`  ! ${locale}/${ns} ${todo[i].key}: invalid ICU in translation, keeping Bosnian`)
      }
    }
  }

  const output = mapStrings(source, (path, text) => {
    const key = path.join('.')
    const fresh = results.get(key)
    if (fresh !== undefined) {
      newLock[key] = hash(text)
      return fresh
    }
    const existing = getAt(target, path)
    if (typeof existing === 'string' && oldLock[key] === hash(text) && !force) {
      newLock[key] = oldLock[key]
      return existing
    }
    return text // failed: Bosnian until the next run
  })

  mkdirSync(`messages/${locale}`, { recursive: true })
  writeFileSync(targetFile, JSON.stringify(output, null, 2) + '\n')
  lock[lockKey] = newLock
  return { ns, locale, translated: results.size, kept: leaves(source).length - todo.length, failed }
}

async function main() {
  const lock = readJson(LOCK_FILE) as Record<string, Record<string, string>>
  const locales = onlyLocale ? [onlyLocale] : [...TARGET_LOCALES]
  const namespaces = onlyNs ? [onlyNs] : [...NAMESPACES]
  const jobs = locales.flatMap(locale => namespaces.map(ns => ({ locale, ns })))

  const t0 = Date.now()
  const results = await mapLimit(jobs, 4, async ({ locale, ns }) => {
    const r = await translateNamespace(locale, ns, lock)
    if (r.translated || r.failed) console.log(`${locale}/${ns}: ${r.translated} translated, ${r.kept} unchanged${r.failed ? `, ${r.failed} failed` : ''}`)
    // Save progress after every namespace
    writeFileSync(LOCK_FILE, JSON.stringify(lock, null, 2) + '\n')
    return r
  })
  const total = results.reduce((n, r) => n + r.translated, 0)
  const failed = results.reduce((n, r) => n + r.failed, 0)
  console.log(`Done in ${Math.round((Date.now() - t0) / 1000)} s: ${total} texts translated${failed ? `, ${failed} kept in Bosnian (see warnings)` : ''}.`)
  const u = usageReport()
  if (u.requests) {
    const cost = u.estimatedUsd === null ? '' : ` ≈ $${u.estimatedUsd.toFixed(4)}`
    console.log(`Claude (${u.model}): ${u.requests} requests, ${u.inputTokens} input + ${u.outputTokens} output tokens${cost}`)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
