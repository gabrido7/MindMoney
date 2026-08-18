import { useEffect, useMemo, useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useApiRequest } from "../hooks/useApiRequest";
import { useTransactions } from "../features/transactions/hooks/useTransactions";
import { useCategories } from "../features/categories/hooks/useCategories";
import { useSavingGoals } from "../features/goals/hooks/useSavingGoals";
import { groupBySubcategory, compareCategoryBreakdowns } from "../features/transactions/utils/aggregations";
import { toLocalTransaction } from "../features/transactions/utils/mapApiTransaction";
import { limitSuggestion } from "../features/dashboard/utils/insights";
import { dashboardService } from "../services/dashboardService";
import { transactionsService } from "../services/transactionsService";

import Sidebar from "../components/ui/Sidebar";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Icon from "../components/ui/Icon";

import SummaryCards from "../features/dashboard/components/SummaryCards";
import AlertBanner from "../features/dashboard/components/AlertBanner";
import CategoryPieChart from "../features/dashboard/components/CategoryPieChart";
import EvolutionChart from "../features/dashboard/components/EvolutionChart";
import RankingCard from "../features/dashboard/components/RankingCard";
import MonthComparisonCard from "../features/dashboard/components/MonthComparisonCard";
import InsightsCard from "../features/dashboard/components/InsightsCard";
import ScoreCard from "../features/dashboard/components/ScoreCard";
import AssistantCard from "../features/dashboard/components/AssistantCard";

import GoalCard from "../features/goals/components/GoalCard";

import TransactionFormModal from "../features/transactions/components/TransactionFormModal";
import TransactionFilters, {
  type TransactionFiltersState,
} from "../features/transactions/components/TransactionFilters";
import TransactionList from "../features/transactions/components/TransactionList";

import CategoryManagerModal from "../features/categories/components/CategoryManagerModal";
import ImportExportPanel from "../features/importExport/components/ImportExportPanel";

import type { Transaction, CategoryTotal } from "../types";

export default function Dashboard() {
  const [darkMode, setDarkMode] = useDarkMode();

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

  const {
    goals: _goals,
    loading: goalsLoading,
    error: goalsError,
    setGoalForMonth,
    getGoalForMonth,
  } = useSavingGoals();

  /**
   * Totais, comparativo com o mês anterior, ranking, evolução e alerta
   * vêm prontos do servidor (2 meses numa chamada só: o atual + o
   * anterior, este último só para o comparativo por categoria do
   * InsightsCard). Antes disso o Dashboard buscava o histórico inteiro de
   * transações e recalculava tudo isso no navegador.
   */
  const {
    data: rangeData,
    loading: rangeLoading,
    error: rangeError,
  } = useApiRequest(() => dashboardService.range(2, selectedMonth), [selectedMonth]);

  const currentSummary = rangeData?.months[rangeData.months.length - 1] ?? null;
  const previousSummary = rangeData?.months[rangeData.months.length - 2] ?? null;
  const evolutionData = rangeData?.evolution ?? [];

  const loading = categoriesLoading || transactionsLoading || goalsLoading || rangeLoading;
  const loadError = categoriesError || transactionsError || goalsError || rangeError;

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Carregando seus dados financeiros...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md text-center">
          <p className="text-red-500 font-medium mb-2">Não foi possível carregar o Dashboard.</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 md:flex">
      <Sidebar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        monthControl={
          <Input
            label="Mês"
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        }
        actions={
          <>
            <Button className="w-full justify-start" onClick={handleOpenNew}>
              <Icon name="plus" size={16} />
              Nova Transação
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => setIsCategoryModalOpen(true)}
            >
              <Icon name="tag" size={16} />
              Gerenciar Categorias
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => setIsImportExportOpen(true)}
            >
              <Icon name="download" size={16} />
              Exportar / Importar
            </Button>
          </>
        }
      />

      <main className="flex-1 min-w-0 p-4 md:p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard Financeiro
        </h1>

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

        <GoalCard
          month={selectedMonth}
          goal={getGoalForMonth(selectedMonth)}
          saldo={currentSummary?.totals.saldo ?? 0}
          onChangeGoal={(value) => setGoalForMonth(selectedMonth, value)}
        />

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

        <InsightsCard
          biggestIncrease={biggestIncrease}
          biggestDecrease={biggestDecrease}
          top3Increases={top3Increases}
        />

        <AssistantCard month={selectedMonth} />

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

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Transações
          </h2>
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
        </div>
      </main>

      {isFormOpen && (
        <TransactionFormModal
          categories={categories}
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
          savingGoals={_goals}
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
