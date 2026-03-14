import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fff9df',
        lemon: '#ffde59',
        mint: '#b8f2c8',
        blush: '#ff8ba7',
        sky: '#85d5ff',
        ink: '#111111',
      },
      boxShadow: {
        neo: '10px 10px 0 #111111',
        neoSm: '6px 6px 0 #111111',
      },
      fontFamily: {
        display: ['Arial Black', 'Impact', 'sans-serif'],
        body: ['Trebuchet MS', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
