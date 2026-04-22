import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './lib/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'slate': {
          '50': '#f8fafc',
          '900': '#0f172a',
        },
      },
    },
  },
  plugins: [],
};

export default config;
