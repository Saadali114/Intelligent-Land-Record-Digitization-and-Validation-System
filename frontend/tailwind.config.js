/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#f6f8f4',
          100: '#ecf3ea',
          200: '#dce5d7',
          300: '#c2d2bc',
          400: '#7e9a75',
          500: '#4e6e45',
          600: '#34522c',
          700: '#233d1b',
          800: '#142c0f',
          850: '#0e230a',
          900: '#091c06',
          950: '#051203',
        },
        gov: {
          dark: '#091c06',
          deep: '#0e2912',
          primary: '#14532d',
          secondary: '#166534',
          accent: '#15803d',
          gold: '#d97706',
          amber: '#f59e0b',
          emerald: '#16a34a',
          mint: '#dcfce7',
          surface: '#f6f8f4',
          border: '#dce5d7',
        },
      },
    },
  },
  plugins: [],
};
