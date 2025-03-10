/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkgray: '#444341',
        lightgray: '#CBD0D2',
        mywhite: '#ECEAE1',
        llg: '#e3eaee',
        midgray: '#787d7e',
      },
      fontFamily: {
        sans: ['Inter Variable', 'Helvetica', 'Arial', 'sans-serif'],
        inter: ['Inter Variable'],
        poppins: ['Poppins'],
        koulen: ['Koulen'],
        interItalic: ['Inter-Italic'],
        interBold: ['Inter-Bold']
      }
    },
  },
  plugins: [],
}

