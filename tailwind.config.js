/** @type {import('tailwindcss').Config} */
const stitchTheme = require('./styles/stitch-theme').default

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: stitchTheme.colors,
      fontFamily: stitchTheme.fontFamily,
      fontSize: stitchTheme.fontSize,
      fontWeight: stitchTheme.fontWeight,
      spacing: stitchTheme.spacing,
      borderRadius: stitchTheme.borderRadius,
      boxShadow: stitchTheme.boxShadow,
      transitionDuration: stitchTheme.transitionDuration,
      animation: {
        ...stitchTheme.animation,
      },
      keyframes: {
        ...stitchTheme.keyframes,
      },
      perspective: stitchTheme.perspective,
      backdropBlur: stitchTheme.backdropBlur,
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}
