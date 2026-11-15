# Website languages

The site is in **Bosnian (default)**, English, Arabic, German and Turkish.

| Language | URL | Notes |
|---|---|---|
| Bosanski (`bs`) | `/blog` | source language, existing URLs unchanged |
| English (`en`) | `/en/blog` | |
| العربية (`ar`) | `/ar/blog` | right-to-left, Noto Sans Arabic |
| Deutsch (`de`) | `/de/blog` | |
| Türkçe (`tr`) | `/tr/blog` | |

The visitor picks the language in the menu (globe icon). The choice is stored
in the `NEXT_LOCALE` cookie and unprefixed addresses then redirect to that
language. There is no detection by browser language.

## How it works

- `src/middleware.ts` strips the prefix (`/en/blog` is served by `src/app/blog`)
  and tells the page its language in the `x-misbah-locale` header.
- Interface texts: [next-intl](https://next-intl.dev), messages in
  `messages/<locale>/<namespace>.json`. **Bosnian (`messages/bs`) is the source**;
  the other languages are generated with `npm run i18n:translate` and may be
  edited by hand afterwards. A text missing in a language falls back to Bosnian.
- Database content (videos, blog, duas, ...) is translated automatically by the
  translator worker (`lambda/translator`, Claude Haiku 5.5 on Amazon Bedrock) into
  the `Translation` table when an admin saves an item (plus a daily sweep), and
  shown with `localizeRows()` (see below). Every text is translated once and
  stored: visitors never trigger a Claude request. Admins can review and edit
  translations at `/admin/prijevodi`.
- Costs: the worker logs `claude usage` (tokens, estimated USD) to CloudWatch for
  every invocation that called Claude; failed translations are retried at most
  3 times automatically (see `lambda/translator/index.ts`).

## Writing a page

```tsx
// Server component
import { getTranslations } from 'next-intl/server'
import Link from '@/i18n/navigation'                 // never next/link in the public site
import { getLocale, formatDate } from '@/i18n/server'
import { localizeRows, localizeRow } from '@/lib/translations'

export async function generateMetadata() {
  const t = await getTranslations('blog')
  return { title: t('meta.title'), description: t('meta.description') }
  // no `alternates`: the root layout adds canonical + hreflang for every page
}

export default async function Page() {
  const locale = getLocale()
  const t = await getTranslations('blog')
  const posts = await localizeRows('blog', await prisma.blogPost.findMany(...), locale)
  return <h1>{t('title')}</h1>
}
```

```tsx
// Client component
'use client'
import { useTranslations } from 'next-intl'
import Link, { usePathname, useRouter, useCurrentLocale } from '@/i18n/navigation'
import { formatDateIntl, formatShortDate } from '@/i18n/format'

const t = useTranslations('blog')
const locale = useCurrentLocale()
fetch(`/api/videos?category=kuran&lang=${locale}`)   // API lists accept ?lang=
```

Rules:

- Every visible Bosnian text goes into `messages/bs/<namespace>.json` (nested,
  camelCase keys). Names of people, Arabic text, e-mails, phone numbers and URLs
  stay in code.
- Plurals use ICU: `"{count, plural, one {# predavanje} few {# predavanja} other {# predavanja}}"`.
  Placeholders: `"Autor: {name}"` → `t('by', { name })`.
- Long structured content (lists of paragraphs) can be read with `t.raw('key')`.
- `usePathname()` from `@/i18n/navigation` returns the path without the
  language prefix, so `pathname.startsWith('/blog')` works in every language.
- Database rows shown to visitors go through `localizeRows(entity, rows, locale)`
  / `localizeRow(...)`. Entities: `video`, `blog`, `activity`, `quote`, `gallery`,
  `ilahija`, `dua`, `mekteb`, `zikr`, `prica`. Localized rows have
  `translated: true`; ilahije keep their original lyrics in `content` and get the
  translated meaning in `meaning`. Show `<MachineTranslationNote show={row.translated} />`
  on detail pages.
- Right-to-left: use logical Tailwind classes (`ps-*`/`pe-*`, `ms-*`/`me-*`,
  `start-*`/`end-*`, `text-start`/`text-end`, `border-s`/`border-e`,
  `rounded-s`/`rounded-e`) instead of left/right ones, and add `flip-rtl` to
  arrow and chevron icons. They render exactly the same in left-to-right languages.
- The Bosnian page must look exactly as before.

## Adding or changing texts

1. Edit `messages/bs/<namespace>.json` (and the code using the key).
2. Run `npm run i18n:translate` (needs AWS credentials with Bedrock access): it
   translates new and changed Bosnian texts into en/ar/de/tr and leaves the
   rest (including hand edits) alone.
3. Commit the changed message files.

## Translating everything at once outside the worker

The first full translation of the site (Nov 2026) was made in a Claude Code
session instead of by the worker:

1. `node scripts/run-ts.mjs scripts/i18n/content-export.ts <source.json>` exports
   the published Bosnian content with the worker's source fingerprints (read-only).
2. The texts are translated with the worker's rules (`systemPrompt()` in
   `lambda/translator/claude.ts`) into a file of
   `{ model, rows: [{ entity, id, locale, hash, fields }] }`.
3. `node scripts/run-ts.mjs scripts/i18n/content-import.ts <import.json>` writes
   them into the `Translation` table (hand-corrected translations stay). The
   worker then only translates items edited or added afterwards.
