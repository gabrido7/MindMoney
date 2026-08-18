import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import type { Category, Transaction, TransactionType } from "../../../types";
import type { TransactionInput } from "../hooks/useTransactions";

export default function TransactionFormModal({
  categories,
  initial,
  onSubmit,
  onClose,
}: {
  categories: Category[];
  initial?: Transaction;
  onSubmit: (input: TransactionInput) => Promise<void>;
  onClose: () => void;
}) {
  const firstCategory = categories[0]?.name ?? "";

  const [category, setCategory] = useState(initial?.category ?? firstCategory);
  const [subcategory, setSubcategory] = useState(initial?.subcategory ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [type, setType] = useState<TransactionType>(initial?.type ?? "saida");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedCategory = categories.find((c) => c.name === category);
  const typeIsEditable = selectedCategory?.type === "ambos";
  const isOutros = selectedCategory?.builtin && selectedCategory.type === "ambos";

  const handleCategoryChange = (name: string) => {
    setCategory(name);
    setSubcategory("");
    const found = categories.find((c) => c.name === name);
    if (found && found.type !== "ambos") setType(found.type);
  };

  const handleSubmit = async () => {
    if (!amount || !date || !category) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError("O valor deve ser maior que zero.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await onSubmit({
        description: isOutros ? description || category : category,
        amount: numericAmount,
        type,
        date,
        category,
        subcategory: subcategory || undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar a transação.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={initial ? "Editar Transação" : "Nova Transação"} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <Select
          label="Categoria"
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.name}>{c.name}</option>
          ))}
        </Select>

        {isOutros && (
          <Input
            label="Descrição"
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        )}

        {!!selectedCategory?.subcategories.length && (
          <Select
            label="Subcategoria"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          >
            <option value="">Selecione</option>
            {selectedCategory.subcategories.map((s) => (
              <option key={s.name}>{s.name}</option>
            ))}
          </Select>
        )}

        <Input
          label="Valor"
          type="number"
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Input
          label="Data"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <Select
          label="Tipo"
          value={type}
          disabled={!typeIsEditable}
          onChange={(e) => setType(e.target.value as TransactionType)}
        >
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </Select>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Salvando..." : initial ? "Salvar" : "Adicionar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
