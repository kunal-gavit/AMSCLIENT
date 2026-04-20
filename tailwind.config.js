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
          DEFAULT: "#0A2A66",
          light: "#1E3A8A",
          dark: "#071D47",
        },
        secondary: {
          DEFAULT: "#1E3A8A",
          light: "#3254B2",
        },
        accent: "#F4B400",
        surface: "#FFFFFF",
        textprimary: "#111827",
        textsecondary: "#6B7280",
        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#DC2626",
        background: "#F9FAFB",
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 16px 35px -16px rgba(10, 42, 102, 0.28)',
        'glass': '0 8px 24px 0 rgba(30, 58, 138, 0.12)',
      }
    },
  },
  plugins: [],
}
