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
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // cores semânticas de status
        status: {
          aberta:     { bg: '#fef9c3', text: '#854d0e', ring: '#fde047' },
          andamento:  { bg: '#dbeafe', text: '#1e40af', ring: '#93c5fd' },
          concluida:  { bg: '#dcfce7', text: '#166534', ring: '#86efac' },
          cancelada:  { bg: '#fee2e2', text: '#991b1b', ring: '#fca5a5' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
