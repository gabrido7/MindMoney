import { describe, it, expect } from "vitest";
import { tokenize, search } from "./search";
import type { SearchDocument } from "../types";

describe("tokenize", () => {
  it("remove acentos e coloca em minúsculo", () => {
    expect(tokenize("Inflação")).toEqual(["inflacao"]);
  });

  it("remove palavras de parada (stopwords) comuns", () => {
    expect(tokenize("Como investir por mês")).toEqual(["investir", "mes"]);
  });

  it("descarta tokens de um único caractere (como o símbolo de R$)", () => {
    expect(tokenize("R$ 500")).toEqual(["500"]);
  });

  it("retorna lista vazia para uma busca só com stopwords", () => {
    expect(tokenize("de para com")).toEqual([]);
  });
});

const SAMPLE_INDEX: SearchDocument[] = [
  {
    type: "tool",
    id: "aportes-mensais",
    title: "Aportes mensais",
    subtitle: "Calculadora",
    href: "/ferramentas/aportes-mensais",
    keywords: "Aportes mensais Quanto investir por mês para atingir um objetivo financeiro num prazo definido.",
  },
  {
    type: "lesson",
    id: "investimentos.renda-fixa.aula-1",
    title: "O que é renda fixa",
    subtitle: "Investimentos · Renda fixa",
    href: "/educacao-financeira/investimentos/renda-fixa/investimentos.renda-fixa.aula-1",
    keywords: "O que é renda fixa Investir em renda fixa é emprestar dinheiro em troca de juros.",
  },
  {
    type: "tool",
    id: "financiamento",
    title: "Financiamento",
    subtitle: "Calculadora",
    href: "/ferramentas/financiamento",
    keywords: "Financiamento Simule as parcelas de um financiamento pelos sistemas Price ou SAC.",
  },
];

describe("search", () => {
  it("encontra documentos relevantes para uma busca em linguagem natural", () => {
    const results = search("Como investir R$ 500 por mês", SAMPLE_INDEX);
    const ids = results.map((r) => r.id);
    expect(ids).toContain("aportes-mensais");
    expect(ids).toContain("investimentos.renda-fixa.aula-1");
    expect(ids).not.toContain("financiamento");
  });

  it("retorna lista vazia para busca vazia", () => {
    expect(search("", SAMPLE_INDEX)).toEqual([]);
  });

  it("retorna lista vazia quando nenhum documento é relevante", () => {
    expect(search("xadrez astronomia", SAMPLE_INDEX)).toEqual([]);
  });

  it("prioriza match no título sobre match só no corpo (ordena por score)", () => {
    const results = search("financiamento", SAMPLE_INDEX);
    expect(results[0].id).toBe("financiamento");
  });

  it("respeita o limite de resultados", () => {
    const bigIndex = Array.from({ length: 20 }, (_, i) => ({
      type: "tool" as const,
      id: `t${i}`,
      title: "Investimento",
      subtitle: "Calculadora",
      href: "/ferramentas/x",
      keywords: "investimento investir",
    }));
    expect(search("investimento", bigIndex, 5)).toHaveLength(5);
  });

  it("é insensível a acentos e maiúsculas", () => {
    const results = search("INFLAÇÃO", [
      {
        type: "lesson",
        id: "l1",
        title: "O que é inflação",
        subtitle: "Trilha",
        href: "/x",
        keywords: "O que é inflação",
      },
    ]);
    expect(results).toHaveLength(1);
  });
});
