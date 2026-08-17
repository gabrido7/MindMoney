import { useRef, useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
import {
  exportBackupJSON,
  exportTransactionsCSV,
  parseBackupJSON,
  type BackupData,
} from "../utils/exportImport";
import type { Category, SavingGoals, Transaction } from "../../../types";

export default function ImportExportPanel({
  transactions,
  savingGoals,
  categories,
  onImport,
  onClose,
}: {
  transactions: Transaction[];
  savingGoals: SavingGoals;
  categories: Category[];
  onImport: (backup: BackupData) => void;
  onClose: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingBackup, setPendingBackup] = useState<BackupData | null>(null);
  const [error, setError] = useState("");

  const handleFileSelected = async (file: File) => {
    const text = await file.text();
    const backup = parseBackupJSON(text);
    if (!backup) {
      setError("Arquivo inválido. Selecione um backup exportado pelo Mind Money.");
      setPendingBackup(null);
      return;
    }
    setError("");
    setPendingBackup(backup);
  };

  return (
    <Modal title="Exportar / Importar Dados" onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Exportar</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() =>
                exportBackupJSON({ transactions, savingGoals, categories })
              }
            >
              <Icon name="download" size={16} />
              Backup completo (JSON)
            </Button>
            <Button
              variant="secondary"
              onClick={() => exportTransactionsCSV(transactions)}
            >
              <Icon name="download" size={16} />
              Transações (CSV)
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Importar</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Importa um backup em JSON exportado anteriormente. Isso substitui todas as
            transações, metas e categorias atuais.
          </p>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelected(file);
            }}
          />

          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            <Icon name="upload" size={16} />
            Selecionar arquivo
          </Button>

          {pendingBackup && (
            <div className="mt-4 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
              <p className="text-sm text-gray-700 dark:text-gray-200 mb-3">
                {pendingBackup.transactions.length} transações,{" "}
                {pendingBackup.categories.length} categorias e{" "}
                {Object.keys(pendingBackup.savingGoals).length} metas serão importadas
                (backup de{" "}
                {new Date(pendingBackup.exportedAt).toLocaleDateString("pt-BR")}).
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setPendingBackup(null)}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    onImport(pendingBackup);
                    onClose();
                  }}
                >
                  Confirmar importação
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
