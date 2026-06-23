import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
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
        '3xl': '28px',
        full: '9999px',
      },
      boxShadow: {
        // soft, modern fintech elevation (subtle on light surfaces)
        card: '0 1px 2px rgba(2,27,26,0.04), 0 10px 28px -12px rgba(2,27,26,0.10)',
        'card-hover': '0 2px 6px rgba(2,27,26,0.06), 0 16px 40px -16px rgba(2,27,26,0.16)',
        float: '0 8px 30px -6px rgba(2,27,26,0.22)',
      },
      keyframes: {
        'bar-indeterminate': {
          '0%': { transform: 'translateX(-100%) scaleX(0.4)' },
          '50%': { transform: 'translateX(20%) scaleX(0.6)' },
          '100%': { transform: 'translateX(120%) scaleX(0.4)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'bar-indeterminate': 'bar-indeterminate 1.1s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        'fade-up': 'fade-up 0.4s ease both',
      },
    },
  },
  plugins: [],
} satisfies Config
