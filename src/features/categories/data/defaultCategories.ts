import type { Category } from "../../../types";

const sub = (name: string, color: string) => ({ name, color });

export const defaultCategories: Category[] = [
  {
    name: "Salário",
    color: "#22c55e",
    type: "entrada",
    builtin: true,
    subcategories: [],
  },
  {
    name: "Alimentação",
    color: "#f97316",
    type: "saida",
    subcategories: [
      sub("Mercado", "#f97316"),
      sub("Restaurante", "#fb923c"),
      sub("Delivery", "#fdba74"),
      sub("Lanche", "#fed7aa"),
    ],
  },
  {
    name: "Transporte",
    color: "#3b82f6",
    type: "saida",
    subcategories: [
      sub("Combustível", "#3b82f6"),
      sub("Uber", "#60a5fa"),
      sub("Manutenção", "#93c5fd"),
      sub("Transporte Público", "#bfdbfe"),
      sub("Estacionamento", "#dbeafe"),
    ],
  },
  {
    name: "Moradia",
    color: "#ef4444",
    type: "saida",
    subcategories: [
      sub("Aluguel", "#ed4a4a"),
      sub("Financiamento", "#e84f4f"),
      sub("Condomínio", "#e35454"),
      sub("Energia", "#e35b5b"),
      sub("Água", "#e06060"),
      sub("Internet", "#d96868"),
    ],
  },
  {
    name: "Lazer",
    color: "#a855f7",
    type: "saida",
    subcategories: [
      sub("Cinema", "#a854f7"),
      sub("Viagem", "#c084fc"),
      sub("Streaming", "#ce9dfc"),
      sub("Jogos", "#9c39fa"),
      sub("Eventos", "#cc9ef7"),
    ],
  },
  {
    name: "Saúde",
    color: "#10b981",
    type: "saida",
    subcategories: [
      sub("Farmácia", "#04b579"),
      sub("Consulta", "#22b382"),
      sub("Exames", "#16b580"),
      sub("Academia", "#3dba90"),
      sub("Convênio", "#62b599"),
      sub("Luta", "#72b39c"),
    ],
  },
  {
    name: "Educação",
    color: "#6366f1",
    type: "saida",
    subcategories: [
      sub("Curso", "#7173f0"),
      sub("Faculdade", "#8082ed"),
      sub("Livros", "#8f91eb"),
      sub("Material", "#9d9feb"),
    ],
  },
  {
    name: "Investimento",
    color: "#eab308",
    type: "saida",
    subcategories: [
      sub("Criptomoeda", "#eab308"),
      sub("FII", "#facc15"),
      sub("Ações", "#fde047"),
      sub("Renda Fixa", "#fef08a"),
      sub("Tesouro Direto", "#fff5a6"),
    ],
  },
  {
    name: "Compras",
    color: "#ec4899",
    type: "saida",
    subcategories: [
      sub("Roupas", "#e864a5"),
      sub("Eletrônicos", "#e675ac"),
      sub("Casa", "#e386b3"),
      sub("Presentes", "#e39abd"),
    ],
  },
  {
    name: "Assinaturas",
    color: "#59d8ff",
    type: "saida",
    subcategories: [
      sub("Netflix", "#73deff"),
      sub("Spotify", "#87e3ff"),
      sub("Amazon", "#9ee8ff"),
    ],
  },
  {
    name: "Outros",
    color: "#6b7280",
    type: "ambos",
    builtin: true,
    subcategories: [],
  },
];
