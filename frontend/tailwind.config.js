/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f7faf3',   // creme clarissimo
          100: '#F1F7D4',   // creme da paleta
          200: '#d6ecda',
          300: '#9FCBAD',   // verde suave
          400: '#7dbda0',
          500: '#6EADBC',   // azul-esverdeado
          600: '#5a9aaa',
          700: '#4A4466',   // roxo escuro — cor principal
          800: '#3a3450',
          900: '#2a2438',
        },
        // aliases semânticos para usar no código
        uni: {
          purple: '#4A4466',
          teal:   '#6EADBC',
          green:  '#9FCBAD',
          cream:  '#F1F7D4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        oswald: ['var(--font-oswald)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}