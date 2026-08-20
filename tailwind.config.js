/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        // Pop + brilho verde num keyframe só -- animate-* do Tailwind seta a propriedade
        // CSS "animation" inteira, então duas classes animate-* juntas no mesmo elemento
        // não tocam simultaneamente (uma sobrescreve a outra); precisa ser um keyframe combinado.
        "goal-complete": {
          "0%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(12,163,12,0.45)" },
          "35%": { transform: "scale(1.025)", boxShadow: "0 0 0 14px rgba(12,163,12,0)" },
          "100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(12,163,12,0)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(-4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "goal-complete": "goal-complete 0.9s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
}