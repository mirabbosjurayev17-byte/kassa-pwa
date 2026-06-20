import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        base: '#F8FAFC',
        surface: '#FFFFFF',
        ink: '#0F172A',
        mute: '#64748B',
        border: '#E2E8F0',
        subtle: '#F1F5F9',
        blue: {
          DEFAULT: '#1883FF',   // accent — CTA, savdo, brand (Ocean Breeze)
          light: '#99CAFF',     // badge, subtle highlight
          dark: '#004EE0',      // emphasis, chart dark bar
          pale: '#E3F2FF',      // hover bg, tint, card bg
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
