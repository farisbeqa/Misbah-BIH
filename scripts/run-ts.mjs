// Runs a TypeScript script: node scripts/run-ts.mjs <file.ts> [args...]
// The script is bundled with esbuild (dependencies stay in node_modules) into
// node_modules/.cache/run-ts and executed with the remaining arguments.
import { build } from 'esbuild'
import { mkdirSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const [, , entry, ...args] = process.argv
if (!entry) {
  console.error('usage: node scripts/run-ts.mjs <file.ts> [args...]')
  process.exit(1)
}

const outdir = resolve('node_modules/.cache/run-ts')
mkdirSync(outdir, { recursive: true })
const outfile = resolve(outdir, basename(entry).replace(/\.ts$/, '.mjs'))

await build({
  entryPoints: [entry],
  outfile,
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  packages: 'external',
  logLevel: 'warning',
})

process.argv = [process.argv[0], resolve(entry), ...args]
await import(pathToFileURL(outfile).href)
