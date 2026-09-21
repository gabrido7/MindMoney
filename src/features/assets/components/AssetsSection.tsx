import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
import EmptyState from "../../../components/ui/EmptyState";
import { assetsService } from "../../../services/assetsService";
import { errorMessage } from "../../../services/api";
import { formatCurrency } from "../../../utils/formatters";
import { useGamification } from "../../gamification/hooks/useGamification";
import AssetValueUpdateModal from "./AssetValueUpdateModal";
import type { Asset, AssetValueUpdate } from "../../../types/api";
import { ASSET_TYPE_LABELS } from "../constants";

function AssetRow({ asset, onRemove }: { asset: Asset; onRemove: (id: number) => void }) {
  const queryClient = useQueryClient();
  const { celebrate } = useGamification();
  const [showHistory, setShowHistory] = useState(false);
  const [updateModal, setUpdateModal] = useState<"add" | AssetValueUpdate | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["assetValueUpdates", asset.id],
    queryFn: () => assetsService.listValueUpdates(asset.id),
    enabled: showHistory,
  });

  const invalidateAfterUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ["assets"] });
    queryClient.invalidateQueries({ queryKey: ["assetValueUpdates", asset.id] });
    queryClient.invalidateQueries({ queryKey: ["assetValueHistory"] });
  };

  const addUpdateMutation = useMutation({
    mutationFn: (input: Parameters<typeof assetsService.addValueUpdate>[1]) =>
      assetsService.addValueUpdate(asset.id, input),
    onSuccess: ({ gamification }) => {
      invalidateAfterUpdate();
      celebrate(gamification);
    },
  });

  const editUpdateMutation = useMutation({
    mutationFn: (vars: { updateId: number; input: Parameters<typeof assetsService.updateValueUpdate>[2] }) =>
      assetsService.updateValueUpdate(asset.id, vars.updateId, vars.input),
    onSuccess: ({ gamification }) => {
      invalidateAfterUpdate();
      celebrate(gamification);
    },
  });

  const removeUpdateMutation = useMutation({
    mutationFn: (updateId: number) => assetsService.removeValueUpdate(asset.id, updateId),
    onSuccess: ({ gamification }) => {
      invalidateAfterUpdate();
      celebrate(gamification);
      setRemoveError(null);
    },
    onError: (err) => setRemoveError(errorMessage(err) ?? "Não foi possível remover esse registro."),
  });

  return (
    <li className="py-4 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">{asset.name}</p>
          <p className="text-xs text-ink-soft">{ASSET_TYPE_LABELS[asset.type]}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-data text-sm font-semibold text-brand-deep">{formatCurrency(asset.currentValue)}</span>
          <button
            type="button"
            onClick={() => onRemove(asset.id)}
            aria-label={`Remover ativo ${asset.name}`}
            className="text-ink-soft hover:text-negative"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={() => setUpdateModal("add")} className="text-xs">
          <Icon name="plus" size={12} />
          Atualizar saldo
        </Button>
        <button
          type="button"
          onClick={() => setShowHistory((v) => !v)}
          className="flex items-center gap-1 text-xs text-ink-soft transition-colors hover:text-brand"
        >
          {showHistory ? "Ocultar histórico" : "Ver histórico"}
          <Icon
            name="chevronDown"
            size={12}
            className={`transition-transform duration-200 ${showHistory ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {showHistory && (
        <div className="motion-reduce:animate-none animate-fade-in mt-3 border-t border-line pt-3">
          {isLoading && <p className="text-xs text-ink-soft">Carregando...</p>}
          {removeError && <p className="mb-2 text-xs text-negative">{removeError}</p>}
          {data && data.updates.length === 0 && (
            <p className="text-xs text-ink-soft">Nenhuma atualização de saldo registrada ainda.</p>
          )}
          {data && data.updates.length > 0 && (
            <ul className="flex max-h-48 flex-col gap-2 overflow-y-auto pr-1">
              {data.updates.map((u) => (
                <li key={u.id} className="flex items-center justify-between text-sm">
                  <span className="font-data text-ink-soft">
                    {u.valuedAt.split("-").reverse().join("/")} · {formatCurrency(u.value)}
                    {u.note ? ` · ${u.note}` : ""}
                  </span>
                  <span className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setUpdateModal(u)}
                      aria-label="Editar valor"
                      className="rounded p-1 text-ink-soft transition-colors hover:bg-surface-alt hover:text-brand active:scale-90"
                    >
                      <Icon name="edit" size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeUpdateMutation.mutate(u.id)}
                      disabled={removeUpdateMutation.isPending}
                      aria-label="Remover valor"
                      className="rounded p-1 text-negative transition-colors hover:bg-negative-soft active:scale-90"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {updateModal && (
        <AssetValueUpdateModal
          assetName={asset.name}
          initial={typeof updateModal === "object" ? updateModal : undefined}
          onSubmit={async (values) => {
            if (typeof updateModal === "object") {
              await editUpdateMutation.mutateAsync({ updateId: updateModal.id, input: values });
            } else {
              await addUpdateMutation.mutateAsync(values);
            }
          }}
          onClose={() => setUpdateModal(null)}
        />
      )}
    </li>
  );
}

export default function AssetsSection({
  assets,
  isLoading,
  onRemove,
}: {
  assets: Asset[];
  isLoading: boolean;
  onRemove: (id: number) => void;
}) {
  return (
    <Card title="Seus ativos">
      {isLoading && <p className="text-sm text-ink-soft">Carregando...</p>}

      {!isLoading && assets.length === 0 && (
        <EmptyState icon="wallet" message="Nenhum ativo cadastrado." />
      )}

      {assets.length > 0 && (
        <ul className="flex max-h-[36rem] flex-col divide-y divide-line overflow-y-auto pr-1">
          {assets.map((asset) => (
            <AssetRow key={asset.id} asset={asset} onRemove={onRemove} />
          ))}
        </ul>
      )}
    </Card>
  );
}
