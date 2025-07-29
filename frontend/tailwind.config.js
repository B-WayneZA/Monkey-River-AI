module.exports = {
  darkMode: 'class', 
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // primary color
          dark: '#1D4ED8'    // Dark mode variant
        },
        secondary: {
          DEFAULT: '#10B981', // secondary color
          dark: '#047857'     // Dark mode variant
        }
      },
    },
  },
  plugins: [],
}