import { describe, it, expect } from "vitest";
import { formatCurrency, formatDateBR, formatMonthBR, calcPercentChange } from "./formatters";

describe("formatCurrency", () => {
  it("formata em BRL no padrão pt-BR", () => {
    expect(formatCurrency(1234.5)).toBe("R$ 1.234,50");
  });

  it("formata zero e negativo corretamente", () => {
    expect(formatCurrency(0)).toBe("R$ 0,00");
    expect(formatCurrency(-50)).toBe("-R$ 50,00");
  });
});

describe("formatDateBR / formatMonthBR", () => {
  it("inverte yyyy-mm-dd para dd/mm/yyyy", () => {
    expect(formatDateBR("2026-08-17")).toBe("17/08/2026");
  });

  it("inverte yyyy-mm para mm/yyyy", () => {
    expect(formatMonthBR("2026-08")).toBe("08/2026");
  });
});

describe("calcPercentChange", () => {
  it("calcula variação percentual normal", () => {
    expect(calcPercentChange(150, 100)).toBe(50);
    expect(calcPercentChange(50, 100)).toBe(-50);
  });

  it("mês anterior zero e atual positivo -> 100%", () => {
    expect(calcPercentChange(500, 0)).toBe(100);
  });

  it("mês anterior zero e atual zero -> 0%", () => {
    expect(calcPercentChange(0, 0)).toBe(0);
  });

  it("mês anterior zero e atual negativo -> -100%, nunca -Infinity (bug corrigido na etapa 2)", () => {
    expect(calcPercentChange(-650, 0)).toBe(-100);
    expect(Number.isFinite(calcPercentChange(-650, 0))).toBe(true);
  });
});
