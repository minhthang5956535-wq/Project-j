/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(349, 100%, 61%)',
          hover: 'hsl(349, 100%, 50%)',
          soft: 'hsla(349, 100%, 61%, 0.1)',
        },
        secondary: 'hsl(182, 100%, 27%)',
        dark: 'hsl(0, 0%, 13%)',
      },
      borderRadius: {
        'premium': '28px',
      },
      boxShadow: {
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}
