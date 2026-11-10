/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ink: '#121614',
        panel: '#1C2420',
        panel2: '#24302A',
        line: '#314038',
        cream: '#F4EFE4',
        mute: '#B7C0B4',
        brass: '#D4B36A',
        brassink: '#1A1408',
        pine: '#8FB392',
        clay: '#D37A5C',
      },
    },
  },
  plugins: [],
};
