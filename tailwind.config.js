// tailwind.config.js
import { defineConfig } from 'tailwindcss';

export default defineConfig({
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        heading: ['var(--font-heading)'],
        vietnam: ['var(--font-vietnam)'],
      },
    },
  },
  plugins: [],
});
