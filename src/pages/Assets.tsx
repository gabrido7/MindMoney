import { useState } from "react";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import InstrumentStrip from "../components/ui/InstrumentStrip";
import { useAssets } from "../features/assets/hooks/useAssets";
import { useAccounts } from "../features/accounts/hooks/useAccounts";
import AssetsSection from "../features/assets/components/AssetsSection";
import AssetDistributionCard from "../features/assets/components/AssetDistributionCard";
import AssetValueHistoryCard from "../features/assets/components/AssetValueHistoryCard";
import AddAssetModal from "../features/assets/components/AddAssetModal";
import AccountsSection from "../features/accounts/components/AccountsSection";
import AddAccountModal from "../features/accounts/components/AddAccountModal";
import { formatCurrency } from "../utils/formatters";

export default function Assets() {
  const { assets, isLoading: assetsLoading, addAsset, removeAsset } = useAssets();
  const { accounts, isLoading: accountsLoading, addAccount, removeAccount } = useAccounts();
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);

  const distinctTypes = new Set(assets.map((a) => a.type)).size;
  const totalAccountsBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-deep">
            <Icon name="trendUp" size={20} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Patrimônio</h1>
            <p className="text-sm text-ink-soft">Contas, ativos e quanto você tem de verdade -- não só quanto entrou e saiu.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-ink">Contas</h2>
          <Button onClick={() => setShowAddAccountModal(true)}>
            <Icon name="plus" size={16} />
            Nova conta
          </Button>
        </div>

        {!accountsLoading && (
          <InstrumentStrip
            items={[
              { label: "Saldo em contas", value: formatCurrency(totalAccountsBalance) },
              { label: "Contas cadastradas", value: accounts.length },
            ]}
          />
        )}

        <AccountsSection accounts={accounts} isLoading={accountsLoading} onRemove={removeAccount} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-ink">Ativos</h2>
          <Button onClick={() => setShowAddAssetModal(true)}>
            <Icon name="plus" size={16} />
            Adicionar ativo
          </Button>
        </div>

        {assetsLoading && <p className="text-ink-soft">Carregando...</p>}

        {!assetsLoading && (
          <>
            {assets.length > 0 && <AssetDistributionCard assets={assets} />}

            <InstrumentStrip
              items={[
                { label: "Ativos cadastrados", value: assets.length },
                { label: "Tipos diferentes", value: distinctTypes },
              ]}
            />

            <AssetsSection assets={assets} isLoading={assetsLoading} onRemove={removeAsset} />

            <AssetValueHistoryCard />
          </>
        )}
      </div>

      {showAddAccountModal && (
        <AddAccountModal
          onSubmit={async (input) => {
            await addAccount(input);
          }}
          onClose={() => setShowAddAccountModal(false)}
        />
      )}

      {showAddAssetModal && (
        <AddAssetModal
          onSubmit={async (input) => {
            await addAsset(input);
          }}
          onClose={() => setShowAddAssetModal(false)}
        />
      )}
    </div>
  );
}
