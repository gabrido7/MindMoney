import type { Category, SavingGoals, Transaction } from "../../../types";

export interface BackupData {
  version: 1;
  exportedAt: string;
  transactions: Transaction[];
  savingGoals: SavingGoals;
  categories: Category[];
}

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportBackupJSON = (data: Omit<BackupData, "version" | "exportedAt">) => {
  const backup: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    ...data,
  };
  downloadFile(
    JSON.stringify(backup, null, 2),
    `mindmoney-backup-${backup.exportedAt.slice(0, 10)}.json`,
    "application/json"
  );
};

export const csvEscape = (value: string) => `"${value.replace(/"/g, '""')}"`;

export const exportTransactionsCSV = (transactions: Transaction[]) => {
  const header = ["data", "descricao", "categoria", "subcategoria", "tipo", "valor"];
  const rows = transactions.map((t) =>
    [
      t.date,
      t.description,
      t.category,
      t.subcategory ?? "",
      t.type,
      t.amount.toFixed(2),
    ]
      .map((v) => csvEscape(String(v)))
      .join(",")
  );

  downloadFile(
    [header.join(","), ...rows].join("\n"),
    `mindmoney-transacoes-${new Date().toISOString().slice(0, 10)}.csv`,
    "text/csv"
  );
};

export interface ImportRow {
  date: string;
  description: string;
  category: string;
  subcategory?: string;
  type: "entrada" | "saida";
  amount: number;
}

/** Desfaz csvEscape: lê um campo entre aspas, com "" representando uma aspa literal dentro do valor. */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * Espelho de exportTransactionsCSV: mesmas 6 colunas, na mesma ordem
 * (data, descricao, categoria, subcategoria, tipo, valor). Não valida
 * contra as categorias do usuário aqui -- isso é responsabilidade do
 * backend (POST /api/transactions/import), que resolve por nome e
 * reporta linhas puladas em vez de confiar no que o navegador manda.
 */
export function parseTransactionsCSV(text: string): ImportRow[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  return lines.slice(1).map((line) => {
    const [date, description, category, subcategory, type, amount] = parseCSVLine(line);
    return {
      date: (date ?? "").trim(),
      description: (description ?? "").trim(),
      category: (category ?? "").trim(),
      subcategory: subcategory?.trim() || undefined,
      type: type?.trim() === "entrada" ? "entrada" : "saida",
      amount: Number(amount) || 0,
    };
  });
}

export const parseBackupJSON = (text: string): BackupData | null => {
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      Array.isArray(parsed.transactions) &&
      typeof parsed.savingGoals === "object" &&
      Array.isArray(parsed.categories)
    ) {
      return parsed as BackupData;
    }
    return null;
  } catch {
    return null;
  }
};
