import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatDateBR,
  formatMonthBR,
  formatMonthLongBR,
  addMonths,
  monthsBetween,
  calcPercentChange,
} from "./formatters";

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

describe("formatMonthLongBR", () => {
  it("escreve o mês por extenso em português", () => {
    expect(formatMonthLongBR("2027-06")).toBe("junho de 2027");
    expect(formatMonthLongBR("2026-01")).toBe("janeiro de 2026");
    expect(formatMonthLongBR("2026-12")).toBe("dezembro de 2026");
  });
});

describe("addMonths", () => {
  it("soma meses dentro do mesmo ano", () => {
    expect(addMonths("2026-08", 3)).toBe("2026-11");
  });

  it("vira o ano quando ultrapassa dezembro", () => {
    expect(addMonths("2026-11", 3)).toBe("2027-02");
  });

  it("soma zero mantém o mesmo mês", () => {
    expect(addMonths("2026-08", 0)).toBe("2026-08");
  });
});

describe("monthsBetween", () => {
  it("calcula diferença positiva quando 'to' é depois de 'from'", () => {
    expect(monthsBetween("2026-08", "2027-06")).toBe(10);
  });

  it("calcula diferença negativa quando 'to' é antes de 'from'", () => {
    expect(monthsBetween("2027-06", "2026-08")).toBe(-10);
  });

  it("mesmo mês -> 0", () => {
    expect(monthsBetween("2026-08", "2026-08")).toBe(0);
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
