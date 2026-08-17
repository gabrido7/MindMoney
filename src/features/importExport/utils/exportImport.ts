import type { Category, SavingGoals, Transaction } from "../../../types";

export interface BackupData {
  version: 1;
  exportedAt: string;
  transactions: Transaction[];
  savingGoals: SavingGoals;
  categories: Category[];
}

const downloadFile = (content: string, filename: string, mimeType: string) => {
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

const csvEscape = (value: string) => `"${value.replace(/"/g, '""')}"`;

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
