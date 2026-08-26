import { useState } from "react";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
import EmptyState from "../../../components/ui/EmptyState";
import { useCategoryBudgets } from "../hooks/useCategoryBudgets";
import { formatCurrency, formatPercent } from "../../../utils/formatters";
import type { Category } from "../../../types";

const STATUS_BAR: Record<string, string> = {
  ok: "bg-brand",
  near: "bg-warning",
  over: "bg-negative",
};

const STATUS_TEXT: Record<string, string> = {
  ok: "text-ink-soft",
  near: "text-warning",
  over: "text-negative",
};

function BudgetRow({
  id,
  categoryId,
  categoryName,
  categoryColor,
  amount,
  spent,
  percent,
  status,
  onChangeAmount,
  onRemove,
}: {
  id: number;
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  amount: number;
  spent: number;
  percent: number;
  status: string;
  onChangeAmount: (categoryId: number, amount: number) => void;
  onRemove: (categoryId: number) => void;
}) {
  const [draft, setDraft] = useState(String(amount));

  const handleBlur = () => {
    const value = Number(draft);
    if (!value || value === amount) {
      setDraft(String(amount));
      return;
    }
    onChangeAmount(categoryId, value);
  };

  return (
    <li className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: categoryColor }} />
          <span className="truncate text-sm font-medium text-ink">{categoryName}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="font-data text-xs text-ink-soft">
            {formatCurrency(spent)} /
          </span>
          <input
            aria-label={`Orçamento de ${categoryName}`}
            type="number"
            min={1}
            step="0.01"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleBlur}
            className="font-data w-20 rounded-lg border border-line bg-surface px-2 py-1 text-right text-xs text-ink focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <button
            type="button"
            onClick={() => onRemove(categoryId)}
            aria-label={`Remover orçamento de ${categoryName}`}
            className="text-ink-soft hover:text-negative"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      </div>

      <div className="w-full rounded-full bg-surface-alt h-2">
        <div
          className={`h-2 rounded-full transition-all duration-700 ease-out ${STATUS_BAR[status]}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <p className={`font-data text-right text-[11px] ${STATUS_TEXT[status]}`} id={`budget-percent-${id}`}>
        {formatPercent(percent, 0)}
        {status === "over" && " — orçamento estourado"}
        {status === "near" && " — perto do limite"}
      </p>
    </li>
  );
}

export default function CategoryBudgetsCard({ month, categories }: { month: string; categories: Category[] }) {
  const { budgets, isLoading, setBudget, removeBudget } = useCategoryBudgets(month);
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const budgetedIds = new Set(budgets.map((b) => b.categoryId));
  const budgetableCategories = categories.filter(
    (c) => c.id && c.type !== "entrada" && !budgetedIds.has(c.id)
  );

  const handleAdd = () => {
    setFormError(null);
    const categoryId = Number(newCategoryId);
    const amount = Number(newAmount);
    if (!categoryId) {
      setFormError("Escolha uma categoria.");
      return;
    }
    if (!amount || amount <= 0) {
      setFormError("Informe um valor maior que zero.");
      return;
    }
    setBudget(categoryId, amount);
    setNewCategoryId("");
    setNewAmount("");
  };

  return (
    <Card title="Orçamento por categoria">
      {isLoading && <p className="text-sm text-ink-soft">Carregando...</p>}

      {!isLoading && budgets.length === 0 && (
        <EmptyState icon="wallet" message="Nenhum orçamento definido para este mês ainda." />
      )}

      {budgets.length > 0 && (
        <ul className="flex flex-col divide-y divide-line mb-4">
          {budgets.map((b) => (
            <BudgetRow
              key={b.id}
              id={b.id}
              categoryId={b.categoryId}
              categoryName={b.categoryName}
              categoryColor={b.categoryColor}
              amount={b.amount}
              spent={b.spent}
              percent={b.percent}
              status={b.status}
              onChangeAmount={setBudget}
              onRemove={removeBudget}
            />
          ))}
        </ul>
      )}

      {budgetableCategories.length > 0 && (
        <div className="flex flex-wrap items-end gap-2 border-t border-line pt-4">
          <Select
            label="Categoria"
            aria-label="Categoria"
            value={newCategoryId}
            onChange={(e) => setNewCategoryId(e.target.value)}
            className="min-w-[160px] flex-1"
          >
            <option value="">Selecione</option>
            {budgetableCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Input
            label="Valor (R$)"
            type="number"
            min={1}
            step="0.01"
            placeholder="0,00"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="w-28"
          />
          <Button variant="secondary" onClick={handleAdd} className="shrink-0">
            <Icon name="plus" size={14} />
            Adicionar
          </Button>
        </div>
      )}
      {formError && <p className="mt-2 text-xs text-negative">{formError}</p>}
    </Card>
  );
}
