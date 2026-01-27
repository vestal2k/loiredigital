/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Loire Élégance - Palette Premium
        'noir': '#1a1a1a',
        'noir-light': '#2d2d2d',
        'or': '#b8860b',
        'or-light': '#d4a84b',
        'or-dark': '#8b6914',
        'creme': '#faf9f7',
        'creme-dark': '#f5f3f0',
        'charbon': '#4a4a4a',
        'gris-doux': '#e8e6e3',
        'gris-moyen': '#9a9a9a',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'elegant': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'elegant-lg': '0 10px 40px rgba(0, 0, 0, 0.12)',
        'elegant-hover': '0 20px 60px rgba(0, 0, 0, 0.15)',
        'or': '0 4px 20px rgba(184, 134, 11, 0.25)',
      },
      borderRadius: {
        'elegant': '6px',
      },
      letterSpacing: {
        'elegant': '-0.02em',
        'wide-elegant': '0.05em',
      },
    },
  },
  plugins: [],
}
