import { describe, it, expect } from "vitest";
import { parseTransactionsCSV, csvEscape } from "./exportImport";

describe("parseTransactionsCSV", () => {
  it("lê as 6 colunas na mesma ordem exportada, pulando o cabeçalho", () => {
    const csv = [
      "data,descricao,categoria,subcategoria,tipo,valor",
      '"2026-08-05","Salário","Salário","","entrada","5000.00"',
      '"2026-08-10","Mercado","Alimentação","Mercado","saida","300.50"',
    ].join("\n");

    const rows = parseTransactionsCSV(csv);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({
      date: "2026-08-05",
      description: "Salário",
      category: "Salário",
      subcategory: undefined,
      type: "entrada",
      amount: 5000,
    });
    expect(rows[1]).toMatchObject({ category: "Alimentação", subcategory: "Mercado", amount: 300.5 });
  });

  it("desfaz aspas duplicadas (campo com vírgula ou aspas dentro)", () => {
    const csv = [
      "data,descricao,categoria,subcategoria,tipo,valor",
      '"2026-08-05","Mercado, ""Feira"" da esquina","Alimentação","","saida","50.00"',
    ].join("\n");

    const rows = parseTransactionsCSV(csv);
    expect(rows[0].description).toBe('Mercado, "Feira" da esquina');
  });

  it("csvEscape seguido de parseTransactionsCSV é um roundtrip fiel", () => {
    const original = 'Descrição com "aspas" e, vírgula';
    const escaped = csvEscape(original);
    const csv = ["data,descricao,categoria,subcategoria,tipo,valor", `"2026-08-01",${escaped},"Outros","","saida","10.00"`].join(
      "\n"
    );

    const rows = parseTransactionsCSV(csv);
    expect(rows[0].description).toBe(original);
  });

  it("arquivo só com cabeçalho (sem linhas de dados) devolve lista vazia", () => {
    expect(parseTransactionsCSV("data,descricao,categoria,subcategoria,tipo,valor")).toEqual([]);
  });

  it("arquivo vazio devolve lista vazia", () => {
    expect(parseTransactionsCSV("")).toEqual([]);
  });

  it("tipo desconhecido/ausente vira 'saida' por padrão (nunca quebra o parse)", () => {
    const csv = [
      "data,descricao,categoria,subcategoria,tipo,valor",
      '"2026-08-01","x","Outros","","",""',
    ].join("\n");
    expect(parseTransactionsCSV(csv)[0].type).toBe("saida");
  });
});
