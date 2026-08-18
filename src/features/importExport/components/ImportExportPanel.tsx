import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
import { exportBackupJSON, exportTransactionsCSV } from "../utils/exportImport";
import { transactionsService } from "../../../services/transactionsService";
import { toLocalTransaction } from "../../transactions/utils/mapApiTransaction";
import { useApiRequest } from "../../../hooks/useApiRequest";
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

  return (
    <Modal title="Exportar Dados" onClose={onClose}>
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
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Importar</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Indisponível no momento. Agora que os dados vêm da API, a importação em massa
            depende de um endpoint de importação no backend que ainda não existe — é mais
            seguro deixar essa função desativada do que reintroduzi-la de forma incompleta.
          </p>
        </div>
      </div>
    </Modal>
  );
}
