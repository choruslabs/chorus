/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#101C3A',
        secondary: '#2B4A91',
        background: '#F7F9FC',
      },
    },
  },
  plugins: [],
};
