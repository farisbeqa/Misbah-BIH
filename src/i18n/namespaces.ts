// Interface text files: messages/<locale>/<namespace>.json (add new ones here)
export const NAMESPACES = [
  'common',
  'nav',
  'auth',
  'account',
  'home',
  'quotes',
  'videos',
  'blog',
  'texts',
  'community',
  'about',
  'bios',
  'legal',
  'pozovite',
] as const
export type Namespace = (typeof NAMESPACES)[number]

/** Long page texts used only by server components; kept out of the browser bundle */
export const SERVER_ONLY_NAMESPACES: readonly Namespace[] = ['bios', 'legal', 'about']
