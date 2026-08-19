import type { ObjectivePriority } from "../../../types/api";

export interface PriorityPreset {
  value: ObjectivePriority;
  label: string;
  dot: string;
  textClass: string;
}

export const PRIORITY_PRESETS: PriorityPreset[] = [
  { value: "alta", label: "Alta", dot: "🔴", textClass: "text-[#d03b3b]" },
  { value: "media", label: "Média", dot: "🟡", textClass: "text-[#b8860b] dark:text-[#fab219]" },
  { value: "baixa", label: "Baixa", dot: "🟢", textClass: "text-[#0ca30c]" },
];

export const PRIORITY_BY_VALUE: Record<ObjectivePriority, PriorityPreset> = Object.fromEntries(
  PRIORITY_PRESETS.map((p) => [p.value, p])
) as Record<ObjectivePriority, PriorityPreset>;
