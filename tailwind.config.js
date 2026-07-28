/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: ['./src/app/**/*.{ts,tsx}', './src/presentation/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: '#F35744',
        'brand-pressed': '#D6432F',
        surface: '#F0F0F3',
        'surface-dark': '#212225',
        'surface-selected': '#E0E1E6',
        'surface-selected-dark': '#2E3135',
        muted: '#60646C',
        'muted-dark': '#B0B4BA',
      },
    },
  },
  plugins: [],
};
