import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary — Burgundy
        brand: {
          DEFAULT: '#8B1E3F',
          light:   '#A94A61',
          dark:    '#5E1028',
          dim:     '#F6EFE7',
        },
        // Accent gold
        gold: {
          DEFAULT: '#C8A96B',
          light:   '#DFC89A',
          dark:    '#9E7D43',
          dim:     '#FAF7F2',
        },
        // Warm neutral grays (no cold grays)
        warm: {
          50:  '#FCFBFA',
          100: '#F5F2EF',
          200: '#E8E1DB',
          300: '#D6CCC3',
          400: '#B8ACA2',
          500: '#978A81',
          600: '#746860',
          700: '#5A4F49',
          800: '#3F3733',
          900: '#241F1D',
          950: '#141110',
        },
        // Accent palette
        accent: {
          ivory:  '#FAF7F2',
          rose:   '#D8A7B1',
          cocoa:  '#6B4A3F',
          sage:   '#8C9A7A',
          beige:  '#E7D6C7',
        },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-ibm-mono)', 'monospace'],
      },
      boxShadow: {
        card:       '0 1px 3px rgba(36,31,29,0.06), 0 4px 16px rgba(36,31,29,0.04)',
        'card-hover': '0 6px 32px rgba(36,31,29,0.12)',
        modal:      '0 24px 64px rgba(20,17,16,0.24)',
        glow:       '0 0 0 3px rgba(139,30,63,0.18)',
      },
      borderRadius: {
        card:  '8px',
        img:   '4px',
        pill:  '999px',
      },
      // 8pt spacing additions
      spacing: {
        '18': '4.5rem',  // 72px
        '22': '5.5rem',  // 88px
        '26': '6.5rem',  // 104px
      },
    },
  },
  plugins: [],
}

export default config
