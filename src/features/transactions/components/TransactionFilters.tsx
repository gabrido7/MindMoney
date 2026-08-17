import Select from "../../../components/ui/Select";
import Icon from "../../../components/ui/Icon";
import type { Category, TransactionType } from "../../../types";

export interface TransactionFiltersState {
  search: string;
  type: TransactionType | "todos";
  category: string;
}

export default function TransactionFilters({
  categories,
  filters,
  onChange,
}: {
  categories: Category[];
  filters: TransactionFiltersState;
  onChange: (filters: TransactionFiltersState) => void;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon name="search" size={16} />
        </span>
        <input
          type="text"
          placeholder="Buscar por descrição ou categoria..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full pl-9 p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Select
        value={filters.type}
        onChange={(e) =>
          onChange({ ...filters, type: e.target.value as TransactionType | "todos" })
        }
        className="md:w-40"
      >
        <option value="todos">Todos os tipos</option>
        <option value="entrada">Entradas</option>
        <option value="saida">Saídas</option>
      </Select>

      <Select
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        className="md:w-48"
      >
        <option value="todas">Todas as categorias</option>
        {categories.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
