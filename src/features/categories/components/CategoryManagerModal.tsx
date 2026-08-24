import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
import type { Category, TransactionType } from "../../../types";

export default function CategoryManagerModal({
  categories,
  onAddCategory,
  onRemoveCategory,
  onAddSubcategory,
  onRemoveSubcategory,
  onClose,
}: {
  categories: Category[];
  onAddCategory: (name: string, type: Category["type"]) => Promise<void>;
  onRemoveCategory: (name: string) => Promise<void>;
  onAddSubcategory: (categoryName: string, subName: string) => Promise<void>;
  onRemoveSubcategory: (categoryName: string, subName: string) => Promise<void>;
  onClose: () => void;
}) {
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryType, setNewCategoryType] = useState<TransactionType | "ambos">(
    "saida"
  );
  const [subInputs, setSubInputs] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const runAction = async (action: () => Promise<void>) => {
    setError(null);
    setBusy(true);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível concluir a ação.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="Gerenciar Categorias" onClose={onClose} size="lg">
      <div className="flex flex-col gap-6">
        {error && <p className="text-negative text-sm font-medium">{error}</p>}

        <div className="flex flex-wrap gap-3 items-end border-b border-line pb-4">
          <Input
            label="Nova categoria"
            placeholder="Ex: Pets"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 min-w-[160px]"
          />
          <Select
            label="Tipo"
            value={newCategoryType}
            onChange={(e) =>
              setNewCategoryType(e.target.value as TransactionType | "ambos")
            }
          >
            <option value="saida">Saída</option>
            <option value="entrada">Entrada</option>
            <option value="ambos">Ambos</option>
          </Select>
          <Button
            disabled={busy}
            onClick={() => {
              if (!newCategory.trim()) return;
              runAction(async () => {
                await onAddCategory(newCategory, newCategoryType);
                setNewCategory("");
              });
            }}
          >
            <Icon name="plus" size={16} />
            Adicionar
          </Button>
        </div>

        <div className="flex flex-col gap-4 max-h-96 overflow-y-auto">
          {categories.map((category) => (
            <div
              key={category.name}
              className="rounded-xl border border-line p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 font-medium text-ink">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </span>
                {!category.builtin && (
                  <button
                    disabled={busy}
                    onClick={() => runAction(() => onRemoveCategory(category.name))}
                    aria-label={`Remover categoria ${category.name}`}
                    className="text-negative hover:bg-negative-soft p-1.5 rounded-lg disabled:opacity-50"
                  >
                    <Icon name="trash" size={16} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {category.subcategories.map((sub) => (
                  <span
                    key={sub.name}
                    className="flex items-center gap-1.5 rounded-full bg-surface-alt px-3 py-1 text-xs text-ink-soft"
                  >
                    {sub.name}
                    <button
                      disabled={busy}
                      onClick={() => runAction(() => onRemoveSubcategory(category.name, sub.name))}
                      aria-label={`Remover subcategoria ${sub.name}`}
                    >
                      <Icon name="close" size={12} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nova subcategoria"
                  value={subInputs[category.name] ?? ""}
                  onChange={(e) =>
                    setSubInputs((prev) => ({ ...prev, [category.name]: e.target.value }))
                  }
                  className="flex-1 p-2 text-sm rounded-lg border border-line bg-surface text-ink"
                />
                <Button
                  variant="secondary"
                  disabled={busy}
                  onClick={() => {
                    const value = subInputs[category.name]?.trim();
                    if (!value) return;
                    runAction(async () => {
                      await onAddSubcategory(category.name, value);
                      setSubInputs((prev) => ({ ...prev, [category.name]: "" }));
                    });
                  }}
                >
                  <Icon name="plus" size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
