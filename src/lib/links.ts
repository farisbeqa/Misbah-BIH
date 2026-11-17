// Sister sites linked from the Misbah navigation

/**
 * Mekteb: lessons by the ilmihal for the mekteb (Strossa, with hafiz Hamdo Solo).
 * Separate static site (repo farisbeqa/mekteb, AWS Amplify app "mekteb") on a
 * Misbah subdomain. The old /mekteb pages redirect there (next.config.mjs).
 */
export const MEKTEB_URL = 'https://mekteb.misbah-edu.com'

/**
 * While the Mekteb site is work in progress it is password protected (Amplify
 * access control on branch main) and the "Mekteb" button is hidden from the
 * Misbah menu. When it goes public: turn the password off in Amplify and set
 * this to true.
 */
export const MEKTEB_PUBLIC = false
