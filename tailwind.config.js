/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Enhanced dark mode colors - deeper blacks
        dark: {
          bg: '#0a0a0b',        // Main background - nearly black
          card: '#111113',       // Cards/elevated surfaces
          hover: '#1a1a1d',      // Hover states
          border: '#27272a',     // Borders
          text: '#fafafa',       // Primary text
          'text-muted': '#a1a1aa', // Secondary text
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      // Golden Ratio spacing (φ ≈ 1.618)
      spacing: {
        'golden-xs': '0.5rem',    // 8px
        'golden-sm': '0.809rem',  // 13px (8 * 1.618)
        'golden-md': '1.309rem',  // 21px (13 * 1.618)
        'golden-lg': '2.118rem',  // 34px (21 * 1.618)
        'golden-xl': '3.427rem',  // 55px (34 * 1.618)
        'golden-2xl': '5.545rem', // 89px (55 * 1.618)
      },
      // Golden Ratio typography
      fontSize: {
        'golden-xs': ['0.809rem', { lineHeight: '1.618' }],  // 13px
        'golden-sm': ['0.875rem', { lineHeight: '1.618' }],  // 14px
        'golden-base': ['1rem', { lineHeight: '1.618' }],    // 16px
        'golden-md': ['1.309rem', { lineHeight: '1.618' }],  // 21px
        'golden-lg': ['1.618rem', { lineHeight: '1.618' }],  // 26px
        'golden-xl': ['2.618rem', { lineHeight: '1.4' }],    // 42px
        'golden-2xl': ['4.236rem', { lineHeight: '1.3' }],   // 68px
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to bottom right, #3b82f6, #9333ea)',
        'gradient-blue-purple': 'linear-gradient(to right, #3b82f6, #9333ea)',
        'gradient-dark': 'linear-gradient(to bottom, #0a0a0b, #111113)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
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
      },
    },
  },
  plugins: [],
}
