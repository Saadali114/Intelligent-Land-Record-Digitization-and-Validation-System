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
        gov: {
          dark: '#0f172a',
          primary: '#1e3a8a',
          secondary: '#0369a1',
          gold: '#d97706',
          emerald: '#059669',
          surface: '#f8fafc',
          border: '#e2e8f0',
        },
      },
    },
  },
  plugins: [],
};
