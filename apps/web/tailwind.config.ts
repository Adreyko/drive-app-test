import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fcf7ef',
        lemon: '#f2d98c',
        mint: '#cfe9d7',
        blush: '#efb4be',
        sky: '#bfdcf1',
        ink: '#1f1b18',
      },
      boxShadow: {
        neo: '4px 4px 0 rgba(31, 27, 24, 0.9)',
        neoSm: '2px 2px 0 rgba(31, 27, 24, 0.8)',
      },
      fontFamily: {
        display: ['Marker Felt', 'Segoe Print', 'Bradley Hand', 'cursive'],
        body: ['Avenir Next', 'Trebuchet MS', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
