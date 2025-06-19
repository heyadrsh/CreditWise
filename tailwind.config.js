/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Times Internet Corporate Color Palette
        'times-blue': {
          50: '#f0f7ff',
          100: '#e0f0ff',
          200: '#bae1ff',
          300: '#7cc8ff',
          400: '#36acff',
          500: '#0891f1',
          600: '#0071ce',
          700: '#005aa6',
          800: '#024e89',
          900: '#084371',
          950: '#062a4b',
        },
        'times-gray': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        
        // Semantic color mapping for Times Internet with dark mode support
        primary: {
          DEFAULT: '#0071ce',
          50: '#f0f7ff',
          100: '#e0f0ff',
          200: '#bae1ff',
          300: '#7cc8ff',
          400: '#36acff',
          500: '#0891f1',
          600: '#0071ce',
          700: '#005aa6',
          800: '#024e89',
          900: '#084371',
          dark: '#36acff',
          light: '#36acff',
        },
        background: {
          DEFAULT: '#ffffff',
          secondary: '#f8fafc',
          tertiary: '#f1f5f9',
          dark: '#0f172a',
          'dark-secondary': '#1e293b',
          'dark-tertiary': '#334155',
          card: '#ffffff',
          'card-dark': '#1e293b',
        },
        text: {
          primary: '#0f172a',
          secondary: '#334155',
          tertiary: '#64748b',
          light: '#94a3b8',
          inverse: '#ffffff',
          'primary-dark': '#f8fafc',
          'secondary-dark': '#e2e8f0',
          'tertiary-dark': '#cbd5e1',
          'light-dark': '#94a3b8',
        },
        border: {
          DEFAULT: '#e2e8f0',
          light: '#f1f5f9',
          medium: '#cbd5e1',
          dark: '#94a3b8',
          'dark-default': '#475569',
          'dark-light': '#334155',
          'dark-medium': '#64748b',
        },
        accent: {
          blue: '#0071ce',
          green: '#22c55e',
          orange: '#f59e0b',
          red: '#ef4444',
          'blue-dark': '#36acff',
          'green-dark': '#4ade80',
          'orange-dark': '#fbbf24',
          'red-dark': '#f87171',
        },
        // Additional color aliases for compatibility
        'accent-red': '#ef4444',
        'accent-green': '#22c55e',
        'accent-orange': '#f59e0b'
      },
      fontFamily: {
        'times': ['Lato', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'corporate-hover': 'corporateHover 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        corporateHover: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' },
        },
      },
      boxShadow: {
        'times': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'times-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'times-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'times-corporate': '0 4px 12px rgb(0 113 206 / 0.15)',
        'times-dark': '0 1px 3px 0 rgb(255 255 255 / 0.1), 0 1px 2px -1px rgb(255 255 255 / 0.1)',
        'times-md-dark': '0 4px 6px -1px rgb(255 255 255 / 0.1), 0 2px 4px -2px rgb(255 255 255 / 0.1)',
        'times-lg-dark': '0 10px 15px -3px rgb(255 255 255 / 0.1), 0 4px 6px -4px rgb(255 255 255 / 0.1)',
      },
    },
  },
  plugins: [],
}
