import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2E3192',
          secondary: '#3F51B5',
          accent: '#2DB6E3',
          purple: '#6C63FF',
          gray: '#B0B3B8',
        },
        bg: {
          light: '#F8FAFC',
          dark: '#0F172A',
        },
        text: {
          primary: '#1E293B',
          secondary: '#64748B',
        },
        success: '#22C55E',
        error: '#EF4444',
      },
      fontFamily: {
        display: ['"Reem Kufi"', 'sans-serif'],
        calligraphy: ['Amiri', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        display: ['clamp(2rem, 7vw, 3.5rem)', { lineHeight: '1.15', fontWeight: '700' }],
        h1: ['clamp(1.75rem, 5.5vw, 2.5rem)', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['clamp(1.5rem, 4vw, 1.875rem)', { lineHeight: '1.3', fontWeight: '500' }],
        h3: ['1.25rem', { lineHeight: '1.35', fontWeight: '600' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.7', fontWeight: '400' }],
      },
      screens: {
        xs: '375px',
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(46, 49, 146, 0.08), 0 2px 8px -2px rgba(15, 23, 42, 0.06)',
        'card-hover': '0 12px 32px -4px rgba(46, 49, 146, 0.16), 0 4px 12px -2px rgba(15, 23, 42, 0.08)',
        glow: '0 0 30px rgba(45, 182, 227, 0.55)',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        'float-slow': 'float-slow 5s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [typography],
}
