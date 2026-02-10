/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Akzentfarben — an site.config.ts anpassen
        'accent': '#D81B86',
        'accent-dark': '#B31269',
        // Neutrale Farben (identisch in allen Projekten)
        'dark': '#1A1A1A',
        'gray-text': '#333333',
        'gray-muted': '#6B6B6B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'widest': '0.15em',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
