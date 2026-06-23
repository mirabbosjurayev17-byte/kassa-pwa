import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-onest)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // ── Emerald / Caribbean Green system (brand palette) ──
        base: '#EEF4F1',     // soft anti-flash mint background
        surface: '#FFFFFF',
        ink: '#021B1A',      // Rich Black (deep emerald-black)
        mute: '#5E726B',     // muted stone-green
        border: '#DBE7E1',
        subtle: '#F1F7F6',   // Anti-Flash White

        // Dark card (hero) — Rich Black / Pine
        dark: {
          DEFAULT: '#021B1A', // Rich Black
          card: '#06302B',    // Pine
        },

        // Green accent
        green: {
          DEFAULT: '#03624C', // Bangladesh Green — workhorse (white text on it, links on light)
          dark: '#06302B',    // Pine — hover/darker
          light: '#2CC295',   // Mountain Meadow
          bright: '#00DF81',  // Caribbean Green — glow accent on dark surfaces / FAB
          pale: '#E2F6EC',    // light mint tint
        },

        // Semantic
        positive: '#0E7A56',
        negative: '#E5484D',
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
