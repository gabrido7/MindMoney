import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";
import { formatCurrency } from "../../../utils/formatters";
import type { CategoryTotal } from "../../../types";

/**
 * Recharts (v3.7) desenha um arco degenerado quando uma única fatia cobre 100% do
 * círculo (startAngle/endAngle coincidem). Com apenas uma categoria não há nada
 * a comparar visualmente mesmo, então renderizamos um círculo sólido em vez do Pie.
 */
function SingleSliceCircle({
  item,
  color,
  size,
  onClick,
}: {
  item: CategoryTotal;
  color: string;
  size: number;
  onClick?: () => void;
}) {
  const radius = size / 2 - 6;
  return (
    <div
      style={{ height: size + 16 }}
      className="flex flex-col items-center justify-center gap-3"
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill={color}
          cursor={onClick ? "pointer" : undefined}
          onClick={onClick}
        />
      </svg>
      <span className="text-sm text-gray-700 dark:text-gray-200">
        {item.name} (100,0%) — {formatCurrency(item.value)}
      </span>
    </div>
  );
}

export default function CategoryPieChart({
  categoryData,
  colorFor,
  selectedCategory,
  onSelectCategory,
  subcategoryData,
}: {
  categoryData: CategoryTotal[];
  colorFor: (name: string) => string;
  selectedCategory: string | null;
  onSelectCategory: (name: string | null) => void;
  subcategoryData: CategoryTotal[] | null;
}) {
  const total = categoryData.reduce((acc, item) => acc + item.value, 0);

  return (
    <Card title="Distribuição por Categoria">
      {categoryData.length === 0 ? (
        <EmptyState message="Nenhuma saída no mês." />
      ) : (
        <div className="grid md:grid-cols-[1fr_auto] gap-4 items-center">
          {categoryData.length === 1 ? (
            <SingleSliceCircle
              item={categoryData[0]}
              color={colorFor(categoryData[0].name)}
              size={200}
              onClick={() => onSelectCategory(categoryData[0].name)}
            />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  outerRadius={100}
                  label={({ name, value }) =>
                    `${name} (${total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)`
                  }
                  onClick={(data) => onSelectCategory(data.name)}
                >
                  {categoryData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={colorFor(entry.name)}
                      cursor="pointer"
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value?: number) => formatCurrency(value ?? 0)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}

          <div className="flex flex-col gap-1 md:min-w-[180px]">
            {categoryData
              .slice()
              .sort((a, b) => b.value - a.value)
              .map((item) => (
                <button
                  key={item.name}
                  onClick={() => onSelectCategory(item.name)}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: colorFor(item.name) }}
                    />
                    {item.name}
                  </span>
                  <span className="font-medium text-gray-500 dark:text-gray-400">
                    {formatCurrency(item.value)}
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}

      {selectedCategory && subcategoryData && (
        <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Detalhamento de {selectedCategory}
            </h3>
            <Button variant="ghost" onClick={() => onSelectCategory(null)}>
              Fechar
            </Button>
          </div>

          {subcategoryData.length === 0 ? (
            <EmptyState message="Sem subcategorias lançadas." />
          ) : subcategoryData.length === 1 ? (
            <SingleSliceCircle
              item={subcategoryData[0]}
              color={colorFor(subcategoryData[0].name)}
              size={180}
            />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={subcategoryData} dataKey="value" outerRadius={90} label>
                  {subcategoryData.map((entry) => (
                    <Cell key={entry.name} fill={colorFor(entry.name)} />
                  ))}
                </Pie>
                <Tooltip formatter={(value?: number) => formatCurrency(value ?? 0)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </Card>
  );
}
