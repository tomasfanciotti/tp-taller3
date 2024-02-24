/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html', './node_modules/react-tailwindcss-select/dist/index.esm.js'],
  safelist: [
    '-translate-x-full',
    {
      pattern: /-?translate-y-(full|[0-9]{1,2})/,
    },
    'sm:grid-cols-1',
    'sm:grid-cols-2',
    'xl:grid-cols-1',
    'xl:grid-cols-2',
    'xl:grid-cols-4',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        current: 'currentColor',
        primary: {
          50 :'var(--primary-color-50)',
          100 :'var(--primary-color-100)',
          200 :'var(--primary-color-200)',
          300 :'var(--primary-color-300)',
          400 :'var(--primary-color-400)',
          500 :'var(--primary-color-500)',
          600 :'var(--primary-color-600)',
          700 :'var(--primary-color-700)',
          800 :'var(--primary-color-800)',
          900 :'var(--primary-color-900)',
        },
        secondary: {
          50 :'var(--secondary-color-50)',
          100 :'var(--secondary-color-100)',
          200 :'var(--secondary-color-200)',
          300 :'var(--secondary-color-300)',
          400 :'var(--secondary-color-400)',
          500 :'var(--secondary-color-500)',
          600 :'var(--secondary-color-600)',
          700 :'var(--secondary-color-700)',
          800 :'var(--secondary-color-800)',
          900 :'var(--secondary-color-900)',
        },
      },
      animation: {
        scale: 'scale 0.7s ease-in-out infinite',
      },
      keyframes: {
        scale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        }
      },
      ringOffsetWidth: {
        '3': '3px',
      },
      screens: {
        'xs': '576px',
      },
      scale: {
        '60': '0.6',
      },
      maxHeight: {
        '10vh': '10vh',
        '11vh': '11vh',
        '12vh': '12vh',
        '13vh': '13vh',
        '14vh': '14vh',
        '20vh': '20vh',
        '30vh': '30vh',
        '40vh': '40vh',
        '50vh': '50vh',
        '60vh': '60vh',
        '70vh': '70vh',
        '80vh': '80vh',
        '90vh': '90vh',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}
