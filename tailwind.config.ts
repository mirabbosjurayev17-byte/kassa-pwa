import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        base: '#F0F4FF',
        surface: '#FFFFFF',
        ink: '#0A1628',
        mute: '#6B7FA3',
        border: '#DDE4F0',
        subtle: '#EEF2FF',
        // Primary blue — savdo, CTA, brand
        blue: {
          DEFAULT: '#2A61EE',
          dark: '#0350A7',
          light: '#5B8AF5',
          pale: '#E8EFFF',
        },
        // Teal accent (WOW) — xarajat, FAB highlight
        teal: {
          DEFAULT: '#0DC7E0',
          dark: '#0A9DB5',
          light: '#47D4E7',
          pale: '#E0F9FC',
        },
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '10px',
        xl: '14px',
        '2xl': '18px',
        full: '9999px',
      },
    },
  },
  plugins: [],
} satisfies Config
