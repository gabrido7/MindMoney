import { useMemo, useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useTransactions } from "../features/transactions/hooks/useTransactions";
import { useCategories } from "../features/categories/hooks/useCategories";
import { useSavingGoals } from "../features/goals/hooks/useSavingGoals";
import {
  filterByMonth,
  sumByType,
  categoryTotals,
  groupBySubcategory,
  compareCategories,
  monthlyEvolution,
  getPreviousMonth,
} from "../features/transactions/utils/aggregations";
import { calcPercentChange } from "../utils/formatters";
import { limitSuggestion } from "../features/dashboard/utils/insights";

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

import GoalCard from "../features/goals/components/GoalCard";

import TransactionFormModal from "../features/transactions/components/TransactionFormModal";
import TransactionFilters, {
  type TransactionFiltersState,
} from "../features/transactions/components/TransactionFilters";
import TransactionList from "../features/transactions/components/TransactionList";

import CategoryManagerModal from "../features/categories/components/CategoryManagerModal";
import ImportExportPanel from "../features/importExport/components/ImportExportPanel";

import type { Transaction } from "../types";

const ALERT_PERCENT = 70;

export default function Dashboard() {
  const [darkMode, setDarkMode] = useDarkMode();

  const { transactions, addTransaction, updateTransaction, deleteTransaction, replaceAll: replaceTransactions } =
    useTransactions();
  const {
    categories,
    addCategory,
    removeCategory,
    addSubcategory,
    removeSubcategory,
    getColor,
    replaceAll: replaceCategories,
  } = useCategories();
  const { goals, setGoalForMonth, getGoalForMonth, replaceAll: replaceGoals } = useSavingGoals();

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFiltersState>({
    search: "",
    type: "todos",
    category: "todas",
  });

  const monthTransactions = useMemo(
    () => filterByMonth(transactions, selectedMonth),
    [transactions, selectedMonth]
  );

  const previousMonth = useMemo(() => getPreviousMonth(selectedMonth), [selectedMonth]);

  const previousMonthTransactions = useMemo(
    () => filterByMonth(transactions, previousMonth),
    [transactions, previousMonth]
  );

  const totalEntradas = useMemo(
    () => sumByType(monthTransactions, "entrada"),
    [monthTransactions]
  );
  const totalSaidas = useMemo(
    () => sumByType(monthTransactions, "saida"),
    [monthTransactions]
  );
  const saldo = totalEntradas - totalSaidas;

  const prevEntradas = useMemo(
    () => sumByType(previousMonthTransactions, "entrada"),
    [previousMonthTransactions]
  );
  const prevSaidas = useMemo(
    () => sumByType(previousMonthTransactions, "saida"),
    [previousMonthTransactions]
  );
  const prevSaldo = prevEntradas - prevSaidas;

  const entradasChange = calcPercentChange(totalEntradas, prevEntradas);
  const saidasChange = calcPercentChange(totalSaidas, prevSaidas);
  const saldoChange = calcPercentChange(saldo, prevSaldo);

  const categoryData = useMemo(
    () => categoryTotals(monthTransactions),
    [monthTransactions]
  );

  const rankingGastos = useMemo(
    () => [...categoryData].sort((a, b) => b.value - a.value).slice(0, 3),
    [categoryData]
  );

  const gastoPercentual = totalEntradas > 0 ? (totalSaidas / totalEntradas) * 100 : 0;
  const ultrapassouLimite = totalEntradas > 0 && gastoPercentual > ALERT_PERCENT;
  const quaseNoLimite =
    totalEntradas > 0 &&
    gastoPercentual >= ALERT_PERCENT * 0.8 &&
    gastoPercentual < ALERT_PERCENT;
  const limitStatus = ultrapassouLimite ? "over" : quaseNoLimite ? "near" : "ok";
  const suggestion = limitSuggestion(limitStatus, rankingGastos[0]?.name);

  const categoryComparison = useMemo(
    () => compareCategories(monthTransactions, previousMonthTransactions),
    [monthTransactions, previousMonthTransactions]
  );

  const biggestIncrease = useMemo(
    () =>
      categoryComparison.filter((c) => c.change > 0).sort((a, b) => b.change - a.change)[0],
    [categoryComparison]
  );
  const biggestDecrease = useMemo(
    () =>
      categoryComparison.filter((c) => c.change < 0).sort((a, b) => a.change - b.change)[0],
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

  const evolutionData = useMemo(() => monthlyEvolution(transactions), [transactions]);

  const subcategoryData = useMemo(() => {
    if (!selectedCategory) return null;
    return Object.entries(groupBySubcategory(monthTransactions, selectedCategory)).map(
      ([name, value]) => ({ name, value })
    );
  }, [monthTransactions, selectedCategory]);

  const visibleTransactions = useMemo(() => {
    return monthTransactions.filter((t) => {
      if (filters.type !== "todos" && t.type !== filters.type) return false;
      if (filters.category !== "todas" && t.category !== filters.category) return false;
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const haystack = `${t.description} ${t.category} ${t.subcategory ?? ""}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [monthTransactions, filters]);

  const handleOpenNew = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleEditRequest = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleSubmitTransaction = (input: Omit<Transaction, "id">) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, input);
    } else {
      addTransaction(input);
    }
  };

  const confirmDelete = () => {
    if (deleteTarget) deleteTransaction(deleteTarget.id);
    setDeleteTarget(null);
  };

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

        {limitStatus !== "ok" && (
          <AlertBanner
            level={limitStatus === "over" ? "over" : "near"}
            gastoPercentual={gastoPercentual}
            suggestion={suggestion}
          />
        )}

        <SummaryCards
          totalEntradas={totalEntradas}
          totalSaidas={totalSaidas}
          saldo={saldo}
          entradasChange={entradasChange}
          saidasChange={saidasChange}
          saldoChange={saldoChange}
        />

        <GoalCard
          month={selectedMonth}
          goal={getGoalForMonth(selectedMonth)}
          saldo={saldo}
          onChangeGoal={(value) => setGoalForMonth(selectedMonth, value)}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <RankingCard ranking={rankingGastos} />
          <MonthComparisonCard
            entradasChange={entradasChange}
            saidasChange={saidasChange}
            saldoChange={saldoChange}
          />
        </div>

        <InsightsCard
          biggestIncrease={biggestIncrease}
          biggestDecrease={biggestDecrease}
          top3Increases={top3Increases}
        />

        <div className="grid lg:grid-cols-2 gap-6">
          <EvolutionChart data={evolutionData} />
          <CategoryPieChart
            categoryData={categoryData}
            colorFor={getColor}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            subcategoryData={subcategoryData}
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
          transactions={transactions}
          savingGoals={goals}
          categories={categories}
          onImport={(backup) => {
            replaceTransactions(backup.transactions);
            replaceCategories(backup.categories);
            replaceGoals(backup.savingGoals);
          }}
          onClose={() => setIsImportExportOpen(false)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Excluir transação"
          message={`Tem certeza que deseja excluir "${deleteTarget.description}"? Essa ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
