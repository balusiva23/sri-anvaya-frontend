/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FAFAF7',
        warmwhite: '#FFFFFF',
        cream: '#F5F2EB',
        sand: '#EFECE6',
        maroon: {
          50: '#FDF2F4',
          100: '#FBE8EB',
          200: '#F5CBD2',
          500: '#9E2A42',
          600: '#801D36',
          700: '#6B1D2F',
          800: '#521422',
          900: '#3D0E19',
        },
        gold: {
          50: '#FAF8F0',
          100: '#F5EEDB',
          200: '#EBDCB7',
          300: '#DFC58C',
          400: '#D4AF37',
          500: '#C5A059',
          600: '#A88440',
          700: '#85662D',
          800: '#634B20',
        },
        charcoal: {
          800: '#2B2D42',
          900: '#1F2421',
          950: '#131514',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
