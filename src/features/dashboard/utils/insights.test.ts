import { describe, it, expect } from "vitest";
import { limitSuggestion, categoryTip } from "./insights";

describe("limitSuggestion", () => {
  it("status ok não gera sugestão", () => {
    expect(limitSuggestion("ok", "Alimentação")).toBeNull();
  });

  it("status near gera aviso genérico", () => {
    expect(limitSuggestion("near", "Alimentação")).toMatch(/aproximando do limite/);
  });

  it("status over cita a maior categoria e a dica correspondente", () => {
    expect(limitSuggestion("over", "Alimentação")).toContain("Alimentação");
    expect(limitSuggestion("over", "Alimentação")).toContain("delivery");
  });

  it("status over sem categoria conhecida cai no texto genérico", () => {
    expect(limitSuggestion("over", undefined)).toBe("Revise seus gastos.");
  });
});

describe("categoryTip", () => {
  it("categoria conhecida tem dica específica", () => {
    expect(categoryTip("Transporte")).toMatch(/combustível/);
  });

  it("categoria desconhecida cai no texto genérico", () => {
    expect(categoryTip("Categoria Inventada")).toMatch(/Revise seus gastos/);
  });
});
