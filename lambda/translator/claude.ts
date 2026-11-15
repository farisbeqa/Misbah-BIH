import { AnthropicBedrock } from '@anthropic-ai/bedrock-sdk'

// Bosnian → English / Arabic / German / Turkish with Claude on Amazon Bedrock
// in the AWS account that hosts the site. Requests go to the bedrock-runtime
// endpoint (InvokeModel) through the global inference profile, which has no
// regional price premium; the bedrock-mantle endpoint is not open to this
// account. Used by the translator worker (database content) and by
// scripts/i18n/translate-messages.ts (interface texts).

export const TARGET_LOCALES = ['en', 'ar', 'de', 'tr'] as const
export type TargetLocale = (typeof TARGET_LOCALES)[number]

export const MODEL = process.env.TRANSLATOR_MODEL || 'global.anthropic.claude-haiku-5-5'
const REGION = process.env.BEDROCK_REGION || 'eu-central-1'

let client: AnthropicBedrock | null = null
function getClient(): AnthropicBedrock {
  client ??= new AnthropicBedrock({ awsRegion: REGION, maxRetries: 4 })
  return client
}

/** Tokens used by this process, for the cost line in the logs */
export const usage = { requests: 0, inputTokens: 0, outputTokens: 0 }

// USD per million tokens on Amazon Bedrock (global endpoint), only for that cost line
const PRICES: { match: string; input: number; output: number }[] = [
  { match: 'haiku-5-5', input: 0.1, output: 0.5 },
  { match: 'haiku-4-5', input: 1, output: 5 },
]

/** Tokens and estimated cost since `since` (a copy of `usage` taken earlier), or since the start */
export function usageReport(since: typeof usage = { requests: 0, inputTokens: 0, outputTokens: 0 }) {
  const requests = usage.requests - since.requests
  const inputTokens = usage.inputTokens - since.inputTokens
  const outputTokens = usage.outputTokens - since.outputTokens
  const price = PRICES.find(p => MODEL.includes(p.match))
  const usd = price ? (inputTokens * price.input + outputTokens * price.output) / 1e6 : null
  return { model: MODEL, requests, inputTokens, outputTokens, estimatedUsd: usd === null ? null : Math.round(usd * 10_000) / 10_000 }
}

const LANGUAGE: Record<TargetLocale, string> = {
  en: 'English',
  ar: 'Arabic (Modern Standard Arabic)',
  de: 'German',
  tr: 'Turkish',
}

// How the site's Islamic vocabulary is rendered in each language
const GLOSSARY: Record<TargetLocale, string> = {
  en: `Allah → Allah; Uzvišeni Allah → Allah the Exalted; Kur'an → Qur'an; ajet → verse (ayah); sura → surah; hadis → hadith; Poslanik / Allahov Poslanik → the Prophet / the Messenger of Allah; Muhammed → Muhammad; a.s. / s.a.v.s. / alejhisselam after the Prophet's name → ﷺ; a.s. after other prophets → (peace be upon him); r.a. / radijallahu anhu → (may Allah be pleased with him); hutba → khutbah (Friday sermon); ilahija → ilahi (Islamic hymn); zikr → dhikr; dova → dua; mekteb → mekteb (Islamic school for children); džemat → jamaat (mosque community); džamija → mosque; namaz → prayer (salah); abdest → wudu; ramazan → Ramadan; bajram → Eid; kurban → qurban; hadž → Hajj; umra → Umrah; dženet → Paradise (Jannah); džehennem → Hellfire; dunjaluk → this world (dunya); ahiret → the Hereafter; sedžda → sujud; tefsir → tafsir; sira → seerah; fikh → fiqh; akaid → aqidah; ummet → ummah; sunnet → Sunnah; imam → imam; hafiz → hafiz; efendija → efendi; vaz → sermon; mevlud → mawlid; halka → study circle (halaqa); Bošnjaci → Bosniaks; Bosna i Hercegovina → Bosnia and Herzegovina.`,
  de: `Allah → Allah; Uzvišeni Allah → der Erhabene Allah; Kur'an → Koran; ajet → Vers (Aya); sura → Sure; hadis → Hadith; Poslanik / Allahov Poslanik → der Prophet / der Gesandte Allahs; Muhammed → Muhammad; a.s. / s.a.v.s. / alejhisselam nach dem Namen des Propheten → ﷺ; a.s. nach anderen Propheten → (Friede sei mit ihm); r.a. → (möge Allah mit ihm zufrieden sein); hutba → Chutba (Freitagspredigt); ilahija → Ilahi (islamisches Lied); zikr → Dhikr; dova → Bittgebet (Dua); mekteb → Mekteb (Koranschule für Kinder); džemat → Gemeinde (Dschemat); džamija → Moschee; namaz → Gebet; abdest → rituelle Waschung (Wudu); ramazan → Ramadan; bajram → Bayram (Fest); kurban → Opfertier (Kurban); hadž → Hadsch; umra → Umra; dženet → Paradies; džehennem → Hölle; dunjaluk → Diesseits; ahiret → Jenseits; tefsir → Tafsir (Koranexegese); sira → Sira (Prophetenbiografie); fikh → Fiqh; akaid → Glaubenslehre (Aqida); ummet → Umma; sunnet → Sunna; hafiz → Hafiz; Bošnjaci → Bosniaken; Bosna i Hercegovina → Bosnien und Herzegowina. Use "du"/"ihr" or "Sie" consistently as in the source (formal "vi" → "Sie", informal "ti" → "du").`,
  tr: `Allah → Allah; Uzvišeni Allah → Yüce Allah; Kur'an → Kur'an-ı Kerim (or Kur'an); ajet → ayet; sura → sure; hadis → hadis; Poslanik / Allahov Poslanik → Peygamber Efendimiz / Allah'ın Resulü; Muhammed → Hz. Muhammed; a.s. / s.a.v.s. after the Prophet's name → (s.a.v.); a.s. after other prophets → (a.s.); r.a. → (r.a.); hutba → hutbe; ilahija → ilahi; zikr → zikir; dova → dua; mekteb → mektep; džemat → cemaat; džamija → cami; namaz → namaz; abdest → abdest; ramazan → Ramazan; bajram → bayram; kurban → kurban; hadž → hac; umra → umre; dženet → cennet; džehennem → cehennem; dunjaluk → dünya; ahiret → ahiret; tefsir → tefsir; sira → siyer; fikh → fıkıh; akaid → akaid; ummet → ümmet; sunnet → sünnet; hafiz → hafız; imam → imam; mevlud → mevlid; Bošnjaci → Boşnaklar; Bosna i Hercegovina → Bosna-Hersek.`,
  ar: `Allah → الله; Uzvišeni Allah → الله تعالى; Kur'an → القرآن الكريم; ajet → آية; sura → سورة; hadis → حديث; Poslanik / Allahov Poslanik → النبي / رسول الله; a.s. / s.a.v.s. after the Prophet's name → ﷺ; a.s. after other prophets → عليه السلام; r.a. → رضي الله عنه; hutba → خطبة (خطبة الجمعة); ilahija → إنشاد ديني (إلهية); zikr → ذكر / أذكار; dova → دعاء; mekteb → الكُتّاب (تعليم الأطفال); džemat → جماعة المسجد; džamija → مسجد / جامع; namaz → الصلاة; abdest → الوضوء; ramazan → رمضان; bajram → العيد; kurban → الأضحية; hadž → الحج; umra → العمرة; dženet → الجنة; džehennem → جهنم; dunjaluk → الدنيا; ahiret → الآخرة; tefsir → التفسير; sira → السيرة النبوية; fikh → الفقه; akaid → العقيدة; ummet → الأمة; sunnet → السنة; hafiz → حافظ القرآن; imam → الإمام; Bošnjaci → البوشناق; Bosna i Hercegovina → البوسنة والهرسك. Write names of classical Islamic figures in Arabic script (e.g. عبد الله بن المبارك, البخاري); keep names of contemporary Bosnian people in Latin letters. Use Arabic punctuation (، ؛ ؟).`,
}

/** Translation instructions; also used for translations made outside the worker (scripts/i18n) */
export function systemPrompt(target: TargetLocale, kind: 'content' | 'ui', notes?: string): string {
  const lang = LANGUAGE[target]
  return [
    `You are the translator of Misbah EDU (https://www.misbah-edu.com), an Islamic education website from Sarajevo, Bosnia and Herzegovina, run by young Muslims of the Carina mosque community: lectures, Friday sermons, Qur'an recitation, ilahije (hymns), dhikr, duas, instructive stories and community news. You translate from Bosnian into ${lang}.`,
    '',
    'Rules:',
    `- Write faithful, natural, respectful ${lang} for a Muslim audience. Keep the meaning, tone, register and structure. Do not add, omit, summarize, explain or comment.`,
    '- You receive a JSON object of segments. Translate every value separately and return the same keys. Never merge or split segments.',
    '- Keep line breaks, blank lines, list markers, Markdown, quotation marks style and spacing as in the source.',
    '- Copy unchanged: Arabic-script text, transliterations of Arabic in Latin letters (e.g. "Allāhumme innī es\'eluke...", "Subhanallahi ve bi hamdihi", "Bismillah"), URLs, e-mail addresses, phone numbers, numbers, Qur\'an references such as 13:11, emoji, brand names (Misbah, Misbah EDU, Mekteb EDU).',
    '- People\'s names stay exactly as written, including titles in front of them (hfz., ef., dr., prof., mr.). Never add a title to a name.',
    '- Qur\'an quotations: translate the meaning faithfully; do not quote another translation from memory unless it says exactly the same.',
    '- A segment that is not Bosnian (e.g. Arabic, Turkish or English lyrics, a name, a number) is copied unchanged.',
    ...(kind === 'ui'
      ? [
          '- These are interface texts of the website (menus, buttons, headings, labels). Keep them short like the source; keep ALL-CAPS headings in capitals (where the script has capitals).',
          '- They use ICU message syntax: keep placeholders such as {count}, {name} and tags such as <b>…</b> exactly; translate the words inside plural/select branches and give the plural categories that ' + lang + ' needs (e.g. one/other; Arabic: zero/one/two/few/many/other) while keeping "#" where the number goes.',
          '- In ICU a straight apostrophe right next to a brace starts quoted text, so never write \' directly before or after { or }: use the typographic apostrophe ’ there instead (e.g. Turkish "{name}’in").',
        ]
      : []),
    '',
    `Terminology for ${lang} (follow it): ${GLOSSARY[target]}`,
    ...(notes ? ['', `About this content: ${notes}`] : []),
  ].join('\n')
}

export class TranslationRefusedError extends Error {}

type Piece = { lead: string; core: string; trail: string }

function splitWhitespace(s: string): Piece {
  const m = s.match(/^(\s*)([\s\S]*?)(\s*)$/)!
  return { lead: m[1], core: m[2], trail: m[3] }
}

/** Long texts are sent in parts cut at line breaks */
function cutLong(text: string, max: number): string[] {
  if (text.length <= max) return [text]
  const parts: string[] = []
  let current = ''
  for (const line of text.split('\n')) {
    if (current && current.length + line.length + 1 > max) {
      parts.push(current)
      current = line
    } else {
      current = current ? current + '\n' + line : line
    }
  }
  if (current) parts.push(current)
  return parts
}

const LETTER = new RegExp('\\p{L}', 'u')
const hasLetters = (s: string) => LETTER.test(s)

async function translateBatch(items: string[], target: TargetLocale, kind: 'content' | 'ui', notes?: string): Promise<string[]> {
  const keys = items.map((_, i) => `s${i}`)
  const input = Object.fromEntries(items.map((v, i) => [keys[i], v]))
  const chars = items.reduce((n, s) => n + s.length, 0)
  // Generous output budget: Arabic and German come out longer than Bosnian
  const maxTokens = Math.min(48_000, 1_000 + Math.ceil(chars * 1.5))

  const message = await getClient().messages
    .stream({
      model: MODEL,
      max_tokens: maxTokens,
      thinking: { type: 'disabled' },
      system: systemPrompt(target, kind, notes),
      output_config: {
        format: {
          type: 'json_schema',
          schema: {
            type: 'object',
            properties: Object.fromEntries(keys.map(k => [k, { type: 'string' }])),
            required: keys,
            additionalProperties: false,
          },
        },
      },
      messages: [{ role: 'user', content: JSON.stringify(input, null, 1) }],
    })
    .finalMessage()

  usage.requests++
  usage.inputTokens += message.usage.input_tokens + (message.usage.cache_creation_input_tokens ?? 0) + (message.usage.cache_read_input_tokens ?? 0)
  usage.outputTokens += message.usage.output_tokens

  if (message.stop_reason === 'refusal') throw new TranslationRefusedError('Claude declined to translate this text')
  if (message.stop_reason === 'max_tokens') {
    if (items.length === 1) throw new Error('Translation did not fit into the output limit')
    const half = Math.ceil(items.length / 2)
    return [
      ...(await translateBatch(items.slice(0, half), target, kind, notes)),
      ...(await translateBatch(items.slice(half), target, kind, notes)),
    ]
  }
  const text = message.content.find(b => b.type === 'text')
  if (!text || text.type !== 'text') throw new Error('Empty translation response')
  const out = JSON.parse(text.text) as Record<string, unknown>
  return keys.map((k, i) => {
    const v = out[k]
    if (typeof v !== 'string') throw new Error(`Missing segment ${k} in translation`)
    // An empty answer for a non-empty source is never right; keep the source
    return v.trim() === '' ? items[i] : v
  })
}

/** Runs async jobs with a concurrency limit */
export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length)
  let next = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++
      out[i] = await fn(items[i], i)
    }
  })
  await Promise.all(workers)
  return out
}

/**
 * Translates Bosnian text segments into `target`, returning the translations in
 * the same order. Leading/trailing whitespace and segments without letters are
 * kept as they are; long segments are translated in parts.
 */
export async function translateSegments(
  segments: string[],
  target: TargetLocale,
  options: { kind?: 'content' | 'ui'; notes?: string; concurrency?: number } = {},
): Promise<string[]> {
  const kind = options.kind ?? 'content'
  const MAX_PART = 6_000
  const MAX_BATCH_CHARS = 6_000
  const MAX_BATCH_ITEMS = 60

  const pieces = segments.map(splitWhitespace)
  // parts[i] = list of texts to translate for segment i (empty = keep as is)
  const parts = pieces.map(p => (p.core && hasLetters(p.core) ? cutLong(p.core, MAX_PART) : []))

  const flat: { seg: number; part: number; text: string }[] = []
  parts.forEach((ps, seg) => ps.forEach((text, part) => flat.push({ seg, part, text })))

  const batches: (typeof flat)[] = []
  let batch: typeof flat = []
  let size = 0
  for (const item of flat) {
    if (batch.length && (size + item.text.length > MAX_BATCH_CHARS || batch.length >= MAX_BATCH_ITEMS)) {
      batches.push(batch)
      batch = []
      size = 0
    }
    batch.push(item)
    size += item.text.length
  }
  if (batch.length) batches.push(batch)

  const results = await mapLimit(batches, options.concurrency ?? 4, b => translateBatch(b.map(x => x.text), target, kind, options.notes))

  const translatedParts: string[][] = parts.map(ps => new Array(ps.length))
  batches.forEach((b, bi) => b.forEach((item, ii) => { translatedParts[item.seg][item.part] = results[bi][ii] }))

  return pieces.map((p, i) => (parts[i].length ? p.lead + translatedParts[i].join('\n') + p.trail : segments[i]))
}
