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
        noir: {
          950: '#07090c',
          900: '#0c0f14',
          850: '#11151d',
          800: '#171c26',
          700: '#222938',
          600: '#323c4e',
          500: '#4b576d',
          400: '#7c8ba1',
          300: '#a6b4c9',
          200: '#d1d9e6',
          100: '#f0f4f8',
        },
        blood: {
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          900: '#450a0a',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        cyber: {
          cyan: '#06b6d4',
          neon: '#10b981',
          purple: '#8b5cf6',
        }
      },
      fontFamily: {
        mono: ['"Courier Prime"', 'Courier', 'monospace'],
        display: ['"Cinzel"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'glitch': 'glitch 1s infinite linear alternate-reverse',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      },
      boxShadow: {
        'neon-red': '0 0 20px rgba(239, 68, 68, 0.4)',
        'neon-amber': '0 0 20px rgba(245, 158, 11, 0.35)',
        'neon-cyan': '0 0 20px rgba(6, 182, 212, 0.35)',
        'case-folder': '0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      }
    },
  },
  plugins: [],
}
