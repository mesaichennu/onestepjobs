/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"','Georgia','serif'],
        body:    ['"DM Sans"','system-ui','sans-serif'],
        mono:    ['"JetBrains Mono"','monospace'],
      },
      colors: {
        brand: {
          50:'#eff6ff', 100:'#dbeafe', 200:'#bfdbfe', 300:'#93c5fd',
          400:'#60a5fa', 500:'#2563eb', 600:'#1d4ed8', 700:'#1e40af',
          800:'#1e3a8a', 900:'#1e3050',
        },
        orange: {
          300:'#fdba74', 400:'#fb923c', 500:'#f97316', 600:'#ea6c00', 700:'#c2410c',
        },
        gold: { 400:'#fb923c', 500:'#f97316', 600:'#ea6c00' },
      },
      animation: {
        'fade-up':'fadeUp 0.6s ease-out forwards',
        'fade-in':'fadeIn 0.5s ease-out forwards',
        'float':'float 6s ease-in-out infinite',
        'pulse-slow':'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeUp:    {'0%':{opacity:'0',transform:'translateY(20px)'},'100%':{opacity:'1',transform:'translateY(0)'}},
        fadeIn:    {'0%':{opacity:'0'},'100%':{opacity:'1'}},
        float:     {'0%,100%':{transform:'translateY(0px)'},'50%':{transform:'translateY(-10px)'}},
      },
    },
  },
  plugins: [],
}
