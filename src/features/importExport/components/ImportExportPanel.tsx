import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
import { exportBackupJSON, exportTransactionsCSV, parseTransactionsCSV, type ImportRow } from "../utils/exportImport";
import { transactionsService, type ImportResult } from "../../../services/transactionsService";
import { toLocalTransaction } from "../../transactions/utils/mapApiTransaction";
import { useApiRequest } from "../../../hooks/useApiRequest";
import { errorMessage } from "../../../services/api";
import { invalidateFinancialData } from "../../../lib/invalidateFinancialData";
import type { Category, SavingGoals } from "../../../types";

export default function ImportExportPanel({
  savingGoals,
  categories,
  onClose,
}: {
  savingGoals: SavingGoals;
  categories: Category[];
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  /**
   * Busca o histórico inteiro só aqui, sob demanda, quando o usuário
   * realmente pede um backup/exportação -- diferente do Dashboard, que
   * não busca mais tudo de uma vez por padrão. Exportar é a única ação
   * que genuinamente precisa do histórico completo.
   */
  const { data: allTransactions, loading, error } = useApiRequest(
    () => transactionsService.listAll(),
    []
  );

  const transactions = allTransactions?.map(toLocalTransaction) ?? [];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileSelect = async (file: File) => {
    setResult(null);
    setImportError(null);
    setParseError(null);
    setFileName(file.name);

    const text = await file.text();
    const parsed = parseTransactionsCSV(text);

    if (parsed.length === 0) {
      setParseError("Não foi possível ler nenhuma linha válida deste arquivo.");
      setRows([]);
      return;
    }

    setRows(parsed);
  };

  const handleImport = async () => {
    setImporting(true);
    setImportError(null);
    try {
      const res = await transactionsService.importBatch(rows);
      setResult(res);
      setRows([]);
      setFileName(null);
      if (res.imported > 0) invalidateFinancialData(queryClient);
    } catch (err) {
      setImportError(errorMessage(err) ?? "Não foi possível importar as transações.");
    } finally {
      setImporting(false);
    }
  };

  const resetImportSelection = () => {
    setRows([]);
    setFileName(null);
    setParseError(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Modal title="Exportar / Importar Dados" onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Exportar</h3>

          {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Preparando seus dados...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {!loading && !error && (
            <>
              <p className="text-xs text-gray-400 mb-3">
                {transactions.length} transações no total.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={() => exportBackupJSON({ transactions, savingGoals, categories })}
                >
                  <Icon name="download" size={16} />
                  Backup completo (JSON)
                </Button>
                <Button variant="secondary" onClick={() => exportTransactionsCSV(transactions)}>
                  <Icon name="download" size={16} />
                  Transações (CSV)
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Importar transações (CSV)</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Use um arquivo no mesmo formato do CSV exportado acima. Categoria e subcategoria são
            reconhecidas pelo nome; linhas com uma categoria que você não tem são ignoradas (e
            listadas depois de importar), o resto é importado normalmente.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />

          {!fileName && !result && (
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
              <Icon name="upload" size={16} />
              Escolher arquivo CSV
            </Button>
          )}

          {fileName && rows.length > 0 && !result && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-600 p-4">
              <p className="text-sm text-gray-700 dark:text-gray-200 mb-1">
                <strong>{fileName}</strong> — {rows.length} transações prontas para importar.
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 mb-3 list-disc ml-4">
                {rows.slice(0, 3).map((r, i) => (
                  <li key={i}>
                    {r.date} · {r.description} · {r.category} · {r.type} · {r.amount}
                  </li>
                ))}
                {rows.length > 3 && <li>... e mais {rows.length - 3}</li>}
              </ul>
              <div className="flex gap-3">
                <Button onClick={handleImport} disabled={importing}>
                  {importing ? "Importando..." : `Importar ${rows.length} transações`}
                </Button>
                <Button variant="ghost" onClick={resetImportSelection} disabled={importing}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {parseError && <p className="text-sm text-red-500 mt-2">{parseError}</p>}
          {importError && <p className="text-sm text-red-500 mt-2">{importError}</p>}

          {result && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-600 p-4">
              <p className="text-sm font-medium text-green-600 mb-1">
                {result.imported} {result.imported === 1 ? "transação importada" : "transações importadas"}
                {result.skipped.length > 0 && `, ${result.skipped.length} ignoradas`}.
              </p>
              {result.skipped.length > 0 && (
                <ul className="text-xs text-gray-500 dark:text-gray-400 list-disc ml-4 mt-2">
                  {result.skipped.map((s, i) => (
                    <li key={i}>
                      Linha {s.row}: {s.reason}
                    </li>
                  ))}
                </ul>
              )}
              <Button variant="secondary" className="mt-3" onClick={resetImportSelection}>
                Importar outro arquivo
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
