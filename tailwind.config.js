/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Primary: deep sapphire — trustworthy, analytical, corporate-ready
        brand: {
          50: '#EEF3FF',
          100: '#DCE6FE',
          200: '#B9CDFC',
          300: '#8BAAF7',
          400: '#5A82EF',
          500: '#3561E3',
          600: '#2347C8',
          700: '#1C38A3',
          800: '#1B3182',
          900: '#1A2B63',
          950: '#0E1838',
        },
        // Ink: near-black navy for headings and footer
        ink: {
          DEFAULT: '#0B1426',
          soft: '#1E293B',
        },
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        growBar: {
          '0%': { transform: 'scaleY(0.15)' },
          '100%': { transform: 'scaleY(1)' },
        },
        drawLine: {
          '0%': { strokeDashoffset: '220' },
          '100%': { strokeDashoffset: '0' },
        },
        pulseDot: {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(2.6)', opacity: '0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        growBar: 'growBar 1.1s cubic-bezier(.2,.8,.2,1) both',
        drawLine: 'drawLine 2s ease-out both',
        pulseDot: 'pulseDot 1.8s ease-out infinite',
      },
    },
  },
  plugins: [],
};
