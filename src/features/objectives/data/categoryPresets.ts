import type { ObjectiveCategory } from "../../../types/api";

export interface CategoryPreset {
  value: ObjectiveCategory;
  label: string;
  icon: string;
  suggestions: string[];
}

export const CATEGORY_PRESETS: CategoryPreset[] = [
  {
    value: "compra",
    label: "Compra",
    icon: "🏠",
    suggestions: ["Comprar um carro", "Comprar uma casa", "Entrada de imóvel"],
  },
  {
    value: "viagem",
    label: "Viagem",
    icon: "✈️",
    suggestions: ["Viagem internacional", "Férias", "Intercâmbio"],
  },
  {
    value: "educacao",
    label: "Educação",
    icon: "🎓",
    suggestions: ["Faculdade", "Curso", "Material de estudo"],
  },
  {
    value: "reserva",
    label: "Reserva",
    icon: "🛡️",
    suggestions: ["Reserva de emergência", "Fundo de segurança"],
  },
  {
    value: "patrimonio",
    label: "Patrimônio",
    icon: "💰",
    suggestions: ["Investimento", "Primeiro R$ 10 mil", "Primeiro R$ 100 mil"],
  },
  {
    value: "personalizada",
    label: "Personalizada",
    icon: "🎯",
    suggestions: [],
  },
];

export const CATEGORY_BY_VALUE: Record<ObjectiveCategory, CategoryPreset> = Object.fromEntries(
  CATEGORY_PRESETS.map((c) => [c.value, c])
) as Record<ObjectiveCategory, CategoryPreset>;
