import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Cores do gestor (painel interno) nas cores da Moriá: os cinzas viram
      // tons de café/areia e o azul dos botões vira verde oliva.
      colors: {
        neutral: {
          // Tons de texto bem claros (creme) para ler bem sobre o café escuro.
          50: "#fffdf9",
          100: "#fffbf4",
          200: "#f8f2e8",
          300: "#f0e8da",
          400: "#e6dbc8",
          500: "#d2c4ac",
          600: "#a8957b",
          700: "#544130",
          800: "#3f3024",
          900: "#2c2119",
          950: "#1e1611",
        },
        blue: {
          50: "#f5f5e6",
          100: "#e9e9c9",
          200: "#dcdba6",
          300: "#cdcb86",
          400: "#bab76a",
          500: "#8e8d42",
          600: "#6d6e2f",
          700: "#585927",
          800: "#45461f",
          900: "#33341a",
          950: "#24250f",
        },
      },
      keyframes: {
        'slide-in-right': { from: { opacity: '0', transform: 'translateX(56px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        'slide-in-left': { from: { opacity: '0', transform: 'translateX(-56px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        'fade-up': { from: { opacity: '0', transform: 'translateY(18px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        kenburns: { from: { transform: 'scale(1.02) translate3d(0,0,0)' }, to: { transform: 'scale(1.14) translate3d(-1.5%,-1%,0)' } },
        progress: { from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } },
        'drawer-in': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        'sheet-up': { from: { opacity: '0', transform: 'translateY(48px) scale(0.98)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
        pop: { '0%': { transform: 'scale(1)' }, '40%': { transform: 'scale(1.3)' }, '100%': { transform: 'scale(1)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'toast-in': { from: { opacity: '0', transform: 'translateY(16px) scale(0.96)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
      },
      animation: {
        'slide-in-right': 'slide-in-right 520ms cubic-bezier(0.22,1,0.36,1) both',
        'slide-in-left': 'slide-in-left 520ms cubic-bezier(0.22,1,0.36,1) both',
        'fade-up': 'fade-up 640ms cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 400ms ease-out both',
        kenburns: 'kenburns 9s ease-out both',
        progress: 'progress 5500ms linear both',
        'drawer-in': 'drawer-in 420ms cubic-bezier(0.22,1,0.36,1) both',
        'sheet-up': 'sheet-up 420ms cubic-bezier(0.22,1,0.36,1) both',
        pop: 'pop 380ms ease-out',
        shimmer: 'shimmer 1.4s infinite',
        'toast-in': 'toast-in 320ms cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
};

export default config;
