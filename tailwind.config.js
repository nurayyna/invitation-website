/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'green-dark': '#1C3520',
        'green-mid':  '#2E5933',
        'cream':      '#FBF6EC',
        'cream-mid':  '#EDE4CF',
        'gold':       '#B8963C',
        'maroon':     '#6B1B2A',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:  ['Jost', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
