/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Sistema de identidade único do app inteiro (landing + plataforma):
        // Fraunces para títulos/números de destaque, Manrope pro corpo/UI
        // (substitui o font-sans padrão), Spline Sans Mono só pra cifras --
        // "voz" tipográfica própria pros dados financeiros, reforçando que
        // são números medidos, não decoração.
        sans: ['"Manrope"', "system-ui", "sans-serif"],
        display: ['"Fraunces"', "Georgia", "serif"],
        data: ['"Spline Sans Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-alt": "var(--surface-alt)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        line: "var(--line)",
        brand: {
          DEFAULT: "var(--brand)",
          deep: "var(--brand-deep)",
          soft: "var(--brand-soft)",
        },
        negative: {
          DEFAULT: "var(--negative)",
          soft: "var(--negative-soft)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          soft: "var(--warning-soft)",
        },
        panel: {
          DEFAULT: "var(--panel-bg)",
          ink: "var(--panel-ink)",
          line: "var(--panel-line)",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,24,15,0.04), 0 8px 24px -12px rgba(20,24,15,0.10)",
        "card-lg": "0 4px 12px rgba(20,24,15,0.06), 0 24px 48px -20px rgba(20,24,15,0.18)",
      },
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
        rise: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "goal-complete": "goal-complete 0.9s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        rise: "rise 0.7s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
}