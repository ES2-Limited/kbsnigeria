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
        display: ['3.5rem', { lineHeight: '1.15', fontWeight: '700' }],
        h1: ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['1.875rem', { lineHeight: '1.3', fontWeight: '500' }],
        h3: ['1.5rem', { lineHeight: '1.35', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }],
      },
    },
  },
  plugins: [typography],
}
