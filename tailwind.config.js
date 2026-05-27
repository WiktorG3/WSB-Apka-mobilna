/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#121317',
        card: '#161A21',
        border: '#2E333B',
        foreground: '#FAFAFA',
        muted: '#9AA3B3',
        primary: '#6262D1',
        danger: '#E63939',
        success: '#2BC262',
      },
    },
  },
  plugins: [],
};
