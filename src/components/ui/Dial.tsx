import type { ReactNode } from "react";
import ScoreArc from "./ScoreArc";

const CENTER_TEXT_SIZE: Record<"sm" | "md" | "lg", string> = {
  sm: "text-xs",
  md: "text-xl",
  lg: "text-3xl",
};

/**
 * Camada fina sobre o ScoreArc -- padroniza o "rótulo embaixo do arco"
 * (hoje cada tela que usa ScoreArc monta esse texto à mão, de um jeito
 * diferente). Dial é o primitivo que qualquer tela usa quando o número é
 * uma proporção de algo (progresso, nota, %) -- não serve pra valores sem
 * teto natural (patrimônio, saldo), que continuam como leitura em texto.
 */
export default function Dial({
  value,
  max = 100,
  size = "md",
  color = "var(--brand)",
  trackColor,
  center,
  label,
  sublabel,
}: {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  trackColor?: string;
  /** Conteúdo central; se omitido, mostra `value` formatado em mono. */
  center?: ReactNode;
  label?: string;
  sublabel?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <ScoreArc value={value} max={max} size={size} color={color} trackColor={trackColor}>
        <span className={`font-data font-bold text-ink ${CENTER_TEXT_SIZE[size]}`}>
          {center ?? Math.round(value)}
        </span>
      </ScoreArc>
      {(label || sublabel) && (
        <div className="leading-tight">
          {sublabel && (
            <p className="text-xs font-semibold" style={{ color }}>
              {sublabel}
            </p>
          )}
          {label && <p className="text-xs text-ink-soft">{label}</p>}
        </div>
      )}
    </div>
  );
}
