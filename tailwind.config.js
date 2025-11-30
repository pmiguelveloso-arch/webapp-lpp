/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'SF Pro Display', 'Inter', 'sans-serif']
      },
      colors: {
        primary: "#0A84FF"
      },
      boxShadow: {
        "soft": "0 18px 45px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};
