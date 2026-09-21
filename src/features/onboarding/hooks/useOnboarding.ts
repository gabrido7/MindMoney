import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "../../../services/transactionsService";
import { usersService } from "../../../services/usersService";
import { debtsService } from "../../../services/debtsService";
import { accountsService } from "../../../services/accountsService";
import { errorMessage } from "../../../services/api";
import { invalidateFinancialData } from "../../../lib/invalidateFinancialData";
import { useAuth } from "../../../hooks/useAuth";
import type { Category } from "../../../types";
import type {
  DebtInput,
  ExperienceLevel,
  FinancialHabits,
  FinancialPriority,
  FinancialProfile,
  FinancialSituation,
  IncomeRange,
  UpdateFinancialProfileInput,
} from "../../../types/api";

const today = () => new Date().toISOString().slice(0, 10);

/** A conta seedada no cadastro (ver seedDefaultAccount no backend) -- onboarding lança renda/despesas nela, sem perguntar conta nenhuma (usuário recém-criado só tem essa). */
async function getDefaultAccountId(): Promise<number> {
  const { accounts } = await accountsService.list();
  return accounts[0].id;
}

function resolveCategory(categories: Category[], name: string, subcategoryName?: string) {
  const category = categories.find((c) => c.name === name);
  if (!category?.id) return null;
  if (!subcategoryName) return { categoryId: category.id, subcategoryId: undefined };
  const subcategory = category.subcategories.find((s) => s.name === subcategoryName);
  return { categoryId: category.id, subcategoryId: subcategory?.id };
}

/** Deriva a faixa de renda (usada pelas recomendações) a partir do valor exato informado -- evita perguntar duas vezes. */
export function deriveIncomeRange(amount: number): IncomeRange {
  if (amount <= 2000) return "ate_2k";
  if (amount <= 5000) return "2k_5k";
  if (amount <= 10000) return "5k_10k";
  if (amount <= 20000) return "10k_20k";
  return "acima_20k";
}

export interface FixedExpenseDraft {
  categoryName: string;
  subcategoryName?: string;
  label: string;
  amount: number;
  periodicity: "mensal" | "anual";
}

export interface IncomeDraft {
  amount: number;
  variable: boolean;
  min: number | null;
  max: number | null;
  sources: string[];
}

/**
 * Onboarding não guarda dado próprio -- renda e despesas viram transações
 * reais (mesmos endpoints do resto do app), dívidas viram linhas reais em
 * /debts, e o resto (motivação, perfil, hábitos) vai pro perfil financeiro
 * já existente, que fica em cache sob a chave ["financial-profile"] -- as
 * mesma usada por useFinancialProfile.ts (aba Financeiro do Perfil), então
 * StepResults consegue ler behaviorProfile/recommendations sem buscar de
 * novo. Só o passo final (completeOnboarding) grava algo específico do
 * wizard (onboarding_completed_at / onboarding_skipped_steps).
 */
export function useOnboarding(categories: Category[]) {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  const saveProfilePatch = async (input: UpdateFinancialProfileInput) => {
    const result = await usersService.updateFinancialProfile(input);
    queryClient.setQueryData<{ profile: FinancialProfile }>(["financial-profile"], result);
    return result;
  };

  const motivationMutation = useMutation({
    mutationFn: (priorities: FinancialPriority[]) => saveProfilePatch({ priorities }),
  });

  const situationMutation = useMutation({
    mutationFn: (input: { financialSituation: FinancialSituation | null; experienceLevel: ExperienceLevel | null }) =>
      saveProfilePatch(input),
  });

  const incomeMutation = useMutation({
    mutationFn: async (input: IncomeDraft) => {
      const resolved = resolveCategory(categories, "Salário");
      if (input.amount > 0 && resolved) {
        const accountId = await getDefaultAccountId();
        await transactionsService.create({
          accountId,
          categoryId: resolved.categoryId,
          description: "Renda mensal",
          amount: input.amount,
          type: "entrada",
          transactionDate: today(),
        });
      }
      await saveProfilePatch({
        incomeRange: input.amount > 0 ? deriveIncomeRange(input.amount) : undefined,
        incomeVariable: input.variable,
        incomeMin: input.variable ? input.min : null,
        incomeMax: input.variable ? input.max : null,
        incomeSources: input.sources,
      });
    },
    onSuccess: () => invalidateFinancialData(queryClient),
  });

  const expensesMutation = useMutation({
    mutationFn: async (expenses: FixedExpenseDraft[]) => {
      if (expenses.length === 0) return;
      const accountId = await getDefaultAccountId();
      for (const expense of expenses) {
        const resolved = resolveCategory(categories, expense.categoryName, expense.subcategoryName);
        if (!resolved) continue;
        await transactionsService.create({
          accountId,
          categoryId: resolved.categoryId,
          subcategoryId: resolved.subcategoryId,
          description: expense.periodicity === "anual" ? `${expense.label} (anual)` : expense.label,
          amount: expense.amount,
          type: "saida",
          transactionDate: today(),
        });
      }
    },
    onSuccess: () => invalidateFinancialData(queryClient),
  });

  const debtsMutation = useMutation({
    mutationFn: async (debts: DebtInput[]) => {
      for (const debt of debts) {
        await debtsService.create(debt);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["debts"] }),
  });

  const habitsMutation = useMutation({
    mutationFn: (habits: FinancialHabits) => saveProfilePatch({ habits }),
  });

  const completeMutation = useMutation({
    mutationFn: (skippedSteps: string[]) => usersService.completeOnboarding({ skippedSteps }),
    onSuccess: ({ user }) => updateUser(user),
  });

  return {
    saveMotivation: (priorities: FinancialPriority[]) => motivationMutation.mutateAsync(priorities),
    saveSituation: (input: { financialSituation: FinancialSituation | null; experienceLevel: ExperienceLevel | null }) =>
      situationMutation.mutateAsync(input),
    saveIncome: (input: IncomeDraft) => incomeMutation.mutateAsync(input),
    saveExpenses: (expenses: FixedExpenseDraft[]) => expensesMutation.mutateAsync(expenses),
    saveDebts: (debts: DebtInput[]) => debtsMutation.mutateAsync(debts),
    saveHabits: (habits: FinancialHabits) => habitsMutation.mutateAsync(habits),
    complete: (skippedSteps: string[]) => completeMutation.mutateAsync(skippedSteps),
    saving:
      motivationMutation.isPending ||
      situationMutation.isPending ||
      incomeMutation.isPending ||
      expensesMutation.isPending ||
      debtsMutation.isPending ||
      habitsMutation.isPending ||
      completeMutation.isPending,
    error: errorMessage(
      motivationMutation.error ??
        situationMutation.error ??
        incomeMutation.error ??
        expensesMutation.error ??
        debtsMutation.error ??
        habitsMutation.error ??
        completeMutation.error
    ),
  };
}
