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
    },
  },
  plugins: [typography],
}
