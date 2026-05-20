import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        kbs: {
          cyan: '#29ABE2',
          navy: '#1F2E7A',
          purple: '#6B5FA5',
          lavender: '#B0A8D0',
        },
        surface: {
          white: '#F8F9FF',
          grey: '#EEF0F8',
        },
        text: {
          dark: '#1A1A2E',
          medium: '#4A4A6A',
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
