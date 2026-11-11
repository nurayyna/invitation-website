/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design-system palette (mirrors src/styles/tokens.css)
        'forest':    '#1C3524',
        'burgundy':  '#681A2B',
        'sage':      '#A5AC8C',
        'ivory':     '#F7F1E6',
        'gold':      '#B49A60',
        // Legacy aliases used by sections not yet restyled
        'green-dark': '#1C3524',
        'green-mid':  '#2A4A34',
        'cream':      '#F7F1E6',
        'cream-mid':  '#ECE3D0',
        'maroon':     '#681A2B',
      },
      fontFamily: {
        serif:   ['Cormorant Garamond', 'Georgia', 'serif'],
        display: ['Bodoni Moda', 'Didot', 'Georgia', 'serif'],
        script:  ['Pinyon Script', 'cursive'],
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
