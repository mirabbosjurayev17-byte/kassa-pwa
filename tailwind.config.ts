import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Fontshare CDN orqali 'Satoshi' yuklanadi (layout.tsx <head>).
        // Step 10'da next/font/local'ga o'tganda var(--font-satoshi) ga qaytamiz.
        sans: ['Satoshi', 'system-ui', 'sans-serif'],
      },
      colors: {
        base: '#F8FAFC',
        surface: '#FFFFFF',
        ink: '#0F172A',
        mute: '#64748B',
        border: '#E2E8F0',
        subtle: '#F1F5F9',
        blue: {
          DEFAULT: '#0077CC',
          light: '#0EA5E9',
          dark: '#004A80',
          pale: '#E0F2FE',
        },
      },
      borderRadius: {
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
      },
    },
  },
  plugins: [],
} satisfies Config
