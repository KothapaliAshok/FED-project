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
          50: '#f0f9f2',
          100: '#dcf4e0',
          200: '#bce8c4',
          300: '#8fd5a0',
          400: '#6BAA6F',
          500: '#79C081',
          600: '#5fa366',
          700: '#4d8253',
          800: '#406846',
          900: '#36563b',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f6f8',
          200: '#e6e6e6',
          300: '#d4d4d4',
          400: '#9a9a9a',
          500: '#7a7a7a',
          600: '#5a5a5a',
          700: '#2f2f2f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}

