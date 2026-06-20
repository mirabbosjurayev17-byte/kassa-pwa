import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter-tight)', 'system-ui', 'sans-serif'],
      },
      colors: {
        base: '#E8EEE8',     // sage green background
        surface: '#FFFFFF',
        ink: '#0F1A0F',      // near-black (dark green tint)
        mute: '#6B7B6B',
        border: '#DCE5DC',
        subtle: '#F2F5F2',

        // Dark card (hero)
        dark: {
          DEFAULT: '#141F14',
          card: '#1A2B1A',
        },

        // Green accent
        green: {
          DEFAULT: '#2DB550',
          dark: '#1E8A3A',
          light: '#5DC877',
          pale: '#E6F5EB',
        },

        // Semantic
        positive: '#2DB550',
        negative: '#E53935',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
} satisfies Config
