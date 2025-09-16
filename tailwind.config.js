/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'text-travel-primary-600',
    'hover:text-travel-primary-700',
    'bg-travel-primary-50',
    'bg-travel-primary-100',
    'bg-travel-primary-500',
    'bg-travel-primary-600',
    'bg-travel-primary-700',
    'border-travel-primary-500',
    'focus:ring-travel-primary-500',
    'text-travel-gradient',
    'bg-travel-gradient',
    'bg-travel-gradient-light',
    'bg-travel-gradient-dark',
    'hover:bg-travel-gradient-dark',
  ],
  theme: {
    extend: {
      colors: {
        'travel': {
          'primary': {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            300: '#f9a8d4',
            400: '#f472b6',
            500: '#ec4899',
            600: '#db2777',
            700: '#be185d',
            800: '#9d174d',
            900: '#831843',
            950: '#500724',
          },
          'secondary': {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
            950: '#450a0a',
          },
          'accent': {
            50: '#fff1f2',
            100: '#ffe4e6',
            200: '#fecdd3',
            300: '#fda4af',
            400: '#fb7185',
            500: '#f43f5e',
            600: '#e11d48',
            700: '#be123c',
            800: '#9f1239',
            900: '#881337',
            950: '#4c0519',
          }
        }
      },
      backgroundImage: {
        'travel-gradient': 'linear-gradient(135deg, #ec4899 0%, #ef4444 100%)',
        'travel-gradient-light': 'linear-gradient(135deg, #fce7f3 0%, #fee2e2 100%)',
        'travel-gradient-dark': 'linear-gradient(135deg, #be185d 0%, #b91c1c 100%)',
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.text-travel-gradient': {
          'background': 'var(--travel-gradient)',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'color': 'var(--travel-primary-500)', // Fallback color
        }
      })
    }
  ],
}
