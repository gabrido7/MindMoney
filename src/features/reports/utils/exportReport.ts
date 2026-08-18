import { downloadFile, csvEscape } from "../../importExport/utils/exportImport";

export interface MonthReport {
  month: string;
  entradas: number;
  saidas: number;
  saldo: number;
  savingsRate: number;
}

export const exportReportCSV = (rows: MonthReport[]) => {
  const header = ["mes", "entradas", "saidas", "saldo", "percentual_economia"];
  const lines = rows.map((r) =>
    [r.month, r.entradas.toFixed(2), r.saidas.toFixed(2), r.saldo.toFixed(2), r.savingsRate.toFixed(1)]
      .map((v) => csvEscape(String(v)))
      .join(",")
  );

  downloadFile(
    [header.join(","), ...lines].join("\n"),
    `mindmoney-relatorio-${new Date().toISOString().slice(0, 10)}.csv`,
    "text/csv"
  );
};
