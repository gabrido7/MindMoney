import { useEffect, useRef, useState, type ReactNode } from "react";

const SIZE_PX: Record<"sm" | "md" | "lg", number> = { sm: 56, md: 96, lg: 160 };
const STROKE_PX: Record<"sm" | "md" | "lg", number> = { sm: 5, md: 8, lg: 12 };

/**
 * Arco circular reutilizado como o motivo visual de assinatura do app inteiro
 * (score financeiro, XP/nível, progresso de meta, resultado de quiz) --
 * a ideia central do MindMoney é transformar dados em um número/progresso,
 * então esse número sempre aparece do mesmo jeito, em vez de cada tela
 * inventar sua própria barra/anel.
 */
export default function ScoreArc({
  value,
  max = 100,
  size = "md",
  color = "var(--brand)",
  trackColor = "var(--surface-alt)",
  children,
}: {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  trackColor?: string;
  children?: ReactNode;
}) {
  const px = SIZE_PX[size];
  const stroke = STROKE_PX[size];
  const radius = px / 2 - stroke;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(value, 0), max);
  const ratio = max > 0 ? clamped / max : 0;

  const [drawn, setDrawn] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    raf.current = requestAnimationFrame(() => setDrawn(ratio));
    return () => cancelAnimationFrame(raf.current);
  }, [ratio]);

  const offset = circumference * (1 - drawn);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: px, height: px }}>
      <svg width={px} height={px} viewBox={`0 0 ${px} ${px}`} className="-rotate-90">
        <circle cx={px / 2} cy={px / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={px / 2}
          cy={px / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
}
