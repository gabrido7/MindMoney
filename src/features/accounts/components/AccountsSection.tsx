import { useState } from "react";
import Card from "../../../components/ui/Card";
import Icon from "../../../components/ui/Icon";
import EmptyState from "../../../components/ui/EmptyState";
import { Ledger, LedgerRow } from "../../../components/ui/Ledger";
import { formatCurrency } from "../../../utils/formatters";
import type { Account, AccountType } from "../../../types/api";

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  corrente: "Conta corrente",
  poupanca: "Poupança",
  carteira: "Carteira",
  outro: "Outro",
};

function AccountRow({ account, onRemove }: { account: Account; onRemove: (id: number) => Promise<void> }) {
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setError(null);
    setRemoving(true);
    try {
      await onRemove(account.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível remover essa conta.");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <LedgerRow
      icon="wallet"
      iconTone={account.balance >= 0 ? "brand" : "negative"}
      title={
        <>
          {account.name}
          {error && <span className="ml-2 text-xs font-normal text-negative">{error}</span>}
        </>
      }
      meta={ACCOUNT_TYPE_LABELS[account.type]}
      value={formatCurrency(account.balance)}
      tone={account.balance >= 0 ? "positive" : "negative"}
      actions={
        <button
          type="button"
          onClick={handleRemove}
          disabled={removing}
          aria-label={`Remover conta ${account.name}`}
          className="p-2 rounded-lg text-ink-soft hover:bg-negative-soft hover:text-negative disabled:opacity-50"
        >
          <Icon name="close" size={14} />
        </button>
      }
    />
  );
}

export default function AccountsSection({
  accounts,
  isLoading,
  onRemove,
}: {
  accounts: Account[];
  isLoading: boolean;
  onRemove: (id: number) => Promise<void>;
}) {
  return (
    <Card title="Suas contas">
      {isLoading && <p className="text-sm text-ink-soft">Carregando...</p>}

      {!isLoading && accounts.length === 0 && <EmptyState icon="wallet" message="Nenhuma conta cadastrada." />}

      {accounts.length > 0 && (
        <Ledger className="max-h-96 overflow-y-auto pr-1">
          {accounts.map((account) => (
            <AccountRow key={account.id} account={account} onRemove={onRemove} />
          ))}
        </Ledger>
      )}
    </Card>
  );
}
