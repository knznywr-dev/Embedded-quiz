/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        brand: {
          50: '#eff5ff',
          100: '#dbe8fe',
          200: '#bfd7fe',
          300: '#93bbfd',
          400: '#609afa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        ink: {
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
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -12px rgba(15, 23, 42, 0.14)',
        lifted: '0 2px 4px rgba(15, 23, 42, 0.04), 0 18px 40px -16px rgba(30, 64, 175, 0.28)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'page-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'question-in': {
          '0%': { opacity: '0', transform: 'translateX(22px) scale(0.995)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        pop: {
          '0%': { transform: 'scale(0.55)' },
          '60%': { transform: 'scale(1.18)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(20px, -14px) scale(1.07)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(240%)' },
        },
        'confetti-fall': {
          '0%': {
            opacity: '0',
            transform: 'translate3d(0, -20px, 0) rotate(0deg)',
          },
          '12%': { opacity: '1' },
          '100%': {
            opacity: '0',
            transform:
              'translate3d(var(--drift, 0px), 220px, 0) rotate(720deg)',
          },
        },
      },
      animation: {
        'fade-up': 'fade-up 360ms ease-out both',
        'fade-in': 'fade-in 240ms ease-out both',
        'scale-in': 'scale-in 240ms ease-out both',
        'page-in': 'page-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'question-in':
          'question-in 380ms cubic-bezier(0.22, 1, 0.36, 1) both',
        pop: 'pop 280ms cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float 11s ease-in-out infinite',
        drift: 'drift 16s ease-in-out infinite',
        shimmer: 'shimmer 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
