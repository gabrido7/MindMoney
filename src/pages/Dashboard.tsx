import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTransactions } from "../features/transactions/hooks/useTransactions";
import { useCategories } from "../features/categories/hooks/useCategories";
import { useAccounts } from "../features/accounts/hooks/useAccounts";
import { groupBySubcategory, compareCategoryBreakdowns } from "../features/transactions/utils/aggregations";
import { toLocalTransaction } from "../features/transactions/utils/mapApiTransaction";
import { limitSuggestion } from "../features/dashboard/utils/insights";
import { dashboardService } from "../services/dashboardService";
import { transactionsService } from "../services/transactionsService";
import { errorMessage } from "../services/api";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Icon from "../components/ui/Icon";
import Card from "../components/ui/Card";

import SummaryCards from "../features/dashboard/components/SummaryCards";
import AlertBanner from "../features/dashboard/components/AlertBanner";
import CategoryPieChart from "../features/dashboard/components/CategoryPieChart";
import EvolutionChart from "../features/dashboard/components/EvolutionChart";
import RankingCard from "../features/dashboard/components/RankingCard";
import NetWorthCard from "../features/dashboard/components/NetWorthCard";
import MonthComparisonCard from "../features/dashboard/components/MonthComparisonCard";
import InsightsCard from "../features/dashboard/components/InsightsCard";
import ScoreCard from "../features/dashboard/components/ScoreCard";
import AssistantCard from "../features/dashboard/components/AssistantCard";
import CategoryBudgetsCard from "../features/dashboard/components/CategoryBudgetsCard";


import TransactionFormModal from "../features/transactions/components/TransactionFormModal";
import TransactionFilters, {
  type TransactionFiltersState,
} from "../features/transactions/components/TransactionFilters";
import TransactionList from "../features/transactions/components/TransactionList";

import CategoryManagerModal from "../features/categories/components/CategoryManagerModal";
import ImportExportPanel from "../features/importExport/components/ImportExportPanel";

import type { Transaction, CategoryTotal } from "../types";

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    addCategory,
    removeCategory,
    addSubcategory,
    removeSubcategory,
    getColor,
  } = useCategories();

  const { accounts } = useAccounts();

  const {
    transactions,
    pagination: txPagination,
    loading: transactionsLoading,
    loadingMore: transactionsLoadingMore,
    error: transactionsError,
    loadMore: loadMoreTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions(categories, selectedMonth);

  /**
   * Totais, comparativo com o mês anterior, ranking, evolução e alerta
   * vêm prontos do servidor (2 meses numa chamada só: o atual + o
   * anterior, este último só para o comparativo por categoria do
   * InsightsCard). Antes disso o Dashboard buscava o histórico inteiro de
   * transações e recalculava tudo isso no navegador.
   */
  const {
    data: rangeData,
    isLoading: rangeLoading,
    error: rangeQueryError,
  } = useQuery({
    queryKey: ["dashboardRange", selectedMonth, 2],
    queryFn: () => dashboardService.range(2, selectedMonth),
  });
  const rangeError = errorMessage(rangeQueryError);

  const currentSummary = rangeData?.months[rangeData.months.length - 1] ?? null;
  const previousSummary = rangeData?.months[rangeData.months.length - 2] ?? null;
  const evolutionData = rangeData?.evolution ?? [];

  const loading = categoriesLoading || transactionsLoading || rangeLoading;
  const loadError = categoriesError || transactionsError || rangeError;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFiltersState>({
    search: "",
    type: "todos",
    category: "todas",
  });

  // Drill-down de subcategoria: busca sob demanda, restrita ao mês + categoria
  // selecionados (nunca ao histórico inteiro) -- só dispara quando o usuário
  // realmente clica numa fatia do gráfico.
  const [subcategoryData, setSubcategoryData] = useState<CategoryTotal[] | null>(null);
  const [subcategoryLoading, setSubcategoryLoading] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      if (!selectedCategory) {
        setSubcategoryData(null);
        return;
      }
      const category = categories.find((c) => c.name === selectedCategory);
      if (!category?.id) {
        setSubcategoryData(null);
        return;
      }

      setSubcategoryLoading(true);
      try {
        const result = await transactionsService.list({
          month: selectedMonth,
          categoryId: category.id,
          limit: 200,
        });
        if (!active) return;
        const grouped = groupBySubcategory(result.transactions.map(toLocalTransaction), selectedCategory);
        setSubcategoryData(Object.entries(grouped).map(([name, value]) => ({ name, value })));
      } catch {
        if (active) setSubcategoryData([]);
      } finally {
        if (active) setSubcategoryLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [selectedCategory, selectedMonth, categories]);

  const visibleTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (filters.type !== "todos" && t.type !== filters.type) return false;
      if (filters.category !== "todas" && t.category !== filters.category) return false;
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const haystack = `${t.description} ${t.category} ${t.subcategory ?? ""}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [transactions, filters]);

  const categoryComparison = useMemo(() => {
    if (!currentSummary || !previousSummary) return [];
    return compareCategoryBreakdowns(currentSummary.categoryBreakdown, previousSummary.categoryBreakdown);
  }, [currentSummary, previousSummary]);

  const biggestIncrease = useMemo(
    () => categoryComparison.filter((c) => c.change > 0).sort((a, b) => b.change - a.change)[0],
    [categoryComparison]
  );
  const biggestDecrease = useMemo(
    () => categoryComparison.filter((c) => c.change < 0).sort((a, b) => a.change - b.change)[0],
    [categoryComparison]
  );
  const top3Increases = useMemo(
    () =>
      categoryComparison
        .filter((c) => c.change > 0)
        .sort((a, b) => b.change - a.change)
        .slice(0, 3),
    [categoryComparison]
  );

  const suggestion = currentSummary
    ? limitSuggestion(currentSummary.alert.status, currentSummary.ranking[0]?.name)
    : null;

  const handleOpenNew = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleEditRequest = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleSubmitTransaction = async (input: Omit<Transaction, "id">) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, input);
    } else {
      await addTransaction(input);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteError(null);
    try {
      await deleteTransaction(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Não foi possível excluir a transação.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <p className="text-ink-soft">Carregando seus dados financeiros...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg p-4">
        <div className="max-w-md text-center">
          <p className="text-negative font-medium mb-2">Não foi possível carregar o Dashboard.</p>
          <p className="text-ink-soft text-sm">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <main className="p-4 md:p-8 flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-2xl font-bold text-ink">
            Dashboard Financeiro
          </h1>

          <div className="flex flex-wrap items-center gap-2">
            <Input
              aria-label="Mês"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
            <Button onClick={handleOpenNew}>
              <Icon name="plus" size={16} />
              Nova Transação
            </Button>
            <Button variant="secondary" onClick={() => setIsCategoryModalOpen(true)}>
              <Icon name="tag" size={16} />
              Categorias
            </Button>
            <Button variant="secondary" onClick={() => setIsImportExportOpen(true)}>
              <Icon name="download" size={16} />
              Exportar / Importar
            </Button>
          </div>
        </div>

        <NetWorthCard />

        {currentSummary && currentSummary.alert.status !== "ok" && (
          <AlertBanner
            level={currentSummary.alert.status === "over" ? "over" : "near"}
            gastoPercentual={currentSummary.alert.gastoPercentual}
            suggestion={suggestion}
          />
        )}

        {currentSummary && (
          <SummaryCards
            totalEntradas={currentSummary.totals.entradas}
            totalSaidas={currentSummary.totals.saidas}
            saldo={currentSummary.totals.saldo}
            entradasChange={currentSummary.changes.entradas}
            saidasChange={currentSummary.changes.saidas}
            saldoChange={currentSummary.changes.saldo}
          />
        )}

        <ScoreCard month={selectedMonth} />

        <div className="grid md:grid-cols-2 gap-6">
          <RankingCard ranking={currentSummary?.ranking ?? []} />
          {currentSummary && (
            <MonthComparisonCard
              entradasChange={currentSummary.changes.entradas}
              saidasChange={currentSummary.changes.saidas}
              saldoChange={currentSummary.changes.saldo}
            />
          )}
        </div>

        <CategoryBudgetsCard month={selectedMonth} categories={categories} />

        <div className="grid lg:grid-cols-2 gap-6">
          <InsightsCard
            biggestIncrease={biggestIncrease}
            biggestDecrease={biggestDecrease}
            top3Increases={top3Increases}
          />
          <AssistantCard month={selectedMonth} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <EvolutionChart data={evolutionData} />
          <CategoryPieChart
            categoryData={currentSummary?.categoryBreakdown ?? []}
            colorFor={getColor}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            subcategoryData={subcategoryLoading ? null : subcategoryData}
          />
        </div>

        <Card title="Transações">
          <TransactionFilters
            categories={categories}
            filters={filters}
            onChange={setFilters}
          />
          <TransactionList
            transactions={visibleTransactions}
            onEdit={handleEditRequest}
            onDeleteRequest={setDeleteTarget}
            pagination={txPagination}
            loadingMore={transactionsLoadingMore}
            onLoadMore={loadMoreTransactions}
          />
        </Card>
      </main>

      {isFormOpen && (
        <TransactionFormModal
          categories={categories}
          accounts={accounts}
          initial={editingTransaction ?? undefined}
          onSubmit={handleSubmitTransaction}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {isCategoryModalOpen && (
        <CategoryManagerModal
          categories={categories}
          onAddCategory={addCategory}
          onRemoveCategory={removeCategory}
          onAddSubcategory={addSubcategory}
          onRemoveSubcategory={removeSubcategory}
          onClose={() => setIsCategoryModalOpen(false)}
        />
      )}

      {isImportExportOpen && (
        <ImportExportPanel
          categories={categories}
          onClose={() => setIsImportExportOpen(false)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Excluir transação"
          message={`Tem certeza que deseja excluir "${deleteTarget.description}"? Essa ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          error={deleteError}
          onConfirm={confirmDelete}
          onCancel={() => {
            setDeleteTarget(null);
            setDeleteError(null);
          }}
        />
      )}
    </div>
  );
}
