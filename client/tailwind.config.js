/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          500: '#5bb462',
          600: '#4a9c51',
          700: '#3d8444'
        },
        yellow: {
          500: '#f5c542',
          600: '#e6b73b',
          700: '#d4a833'
        },
        purple: {
          500: '#b983ff',
          600: '#a76dff',
          700: '#9557ff'
        },
        red: {
          500: '#ef476f',
          600: '#e0395f',
          700: '#d12b4f'
        }
      },
      animation: {
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'flip': 'flip 0.6s ease-in-out',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'confetti': 'confetti 3s ease-in-out forwards'
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
        },
        flip: {
          '0%': { transform: 'rotateX(0deg)' },
          '50%': { transform: 'rotateX(90deg)' },
          '100%': { transform: 'rotateX(0deg)' }
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(91, 180, 98, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(91, 180, 98, 0.8)' }
        }
      }
    },
  },
  plugins: [],
}
