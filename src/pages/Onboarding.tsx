import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoMark from "../components/ui/LogoMark";
import { useAuth } from "../hooks/useAuth";
import { useCategories } from "../features/categories/hooks/useCategories";
import { useOnboarding, type FixedExpenseDraft, type IncomeDraft } from "../features/onboarding/hooks/useOnboarding";
import OnboardingProgressBar from "../features/onboarding/components/OnboardingProgressBar";
import StepWelcome from "../features/onboarding/components/StepWelcome";
import StepMotivation from "../features/onboarding/components/StepMotivation";
import StepFinancialSituation from "../features/onboarding/components/StepFinancialSituation";
import StepIncome from "../features/onboarding/components/StepIncome";
import StepExpenses from "../features/onboarding/components/StepExpenses";
import StepDebts from "../features/onboarding/components/StepDebts";
import StepHabits from "../features/onboarding/components/StepHabits";
import StepResults from "../features/onboarding/components/StepResults";
import type { DebtInput, ExperienceLevel, FinancialHabits, FinancialPriority, FinancialSituation } from "../types/api";

const TOTAL_STEPS = 8;
const ALL_SKIPPABLE_STEPS = ["motivacao", "perfil", "renda", "despesas", "dividas", "habitos"];

const EMPTY_INCOME: IncomeDraft = { amount: 0, variable: false, min: null, max: null, sources: [] };

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories, loading: loadingCategories } = useCategories();
  const { saveMotivation, saveSituation, saveIncome, saveExpenses, saveDebts, saveHabits, complete, saving, error } =
    useOnboarding(categories);

  const [step, setStep] = useState(0);
  const [skippedSteps, setSkippedSteps] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const [motivation, setMotivation] = useState<FinancialPriority[]>([]);
  const [financialSituation, setFinancialSituation] = useState<FinancialSituation | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
  const [incomeDraft, setIncomeDraft] = useState<IncomeDraft>(EMPTY_INCOME);

  const markCompleted = (key: string) => setCompletedSteps((prev) => [...prev, key]);
  const markSkipped = (key: string, next: number) => {
    setSkippedSteps((prev) => [...prev, key]);
    setStep(next);
  };

  const finishOnboarding = async (finalSkipped: string[]) => {
    await complete(finalSkipped);
    navigate("/dashboard", { replace: true });
  };

  const handleSkipAll = () => {
    const remaining = ALL_SKIPPABLE_STEPS.filter((key) => !completedSteps.includes(key));
    finishOnboarding(remaining);
  };

  const handleMotivationContinue = async () => {
    await saveMotivation(motivation);
    markCompleted("motivacao");
    setStep(2);
  };

  const handleSituationContinue = async () => {
    await saveSituation({ financialSituation, experienceLevel });
    markCompleted("perfil");
    setStep(3);
  };

  const handleIncomeContinue = async (draft: IncomeDraft) => {
    setIncomeDraft(draft);
    await saveIncome(draft);
    markCompleted("renda");
    setStep(4);
  };

  const handleExpensesContinue = async (expenses: FixedExpenseDraft[]) => {
    if (expenses.length > 0) await saveExpenses(expenses);
    markCompleted("despesas");
    setStep(5);
  };

  const handleDebtsContinue = async (debts: DebtInput[]) => {
    if (debts.length > 0) await saveDebts(debts);
    markCompleted("dividas");
    setStep(6);
  };

  const handleHabitsContinue = async (habits: FinancialHabits) => {
    await saveHabits(habits);
    markCompleted("habitos");
    setStep(7);
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-4 md:px-10">
        <div className="flex items-center gap-2">
          <LogoMark size={32} />
          <span className="font-display text-base font-semibold text-ink">Mind Money</span>
        </div>
        {step > 0 && step < TOTAL_STEPS - 1 && (
          <button
            type="button"
            onClick={handleSkipAll}
            disabled={saving}
            className="text-sm font-medium text-ink-soft transition-colors hover:text-ink disabled:opacity-50"
          >
            Pular configuração
          </button>
        )}
      </header>

      <main className="flex flex-1 items-start justify-center px-6 py-12 md:py-16">
        <div className="w-full max-w-md">
          {step > 0 && (
            <div className="mb-8">
              <OnboardingProgressBar step={step} totalSteps={TOTAL_STEPS} />
            </div>
          )}

          {error && (
            <p role="alert" className="mb-4 text-sm font-medium text-negative">
              {error}
            </p>
          )}

          {loadingCategories ? (
            <p className="text-sm text-ink-soft">Carregando...</p>
          ) : (
            <div key={step} className="motion-reduce:animate-none animate-rise">
              {step === 0 && <StepWelcome userName={user?.name ?? ""} onContinue={() => setStep(1)} />}

              {step === 1 && (
                <StepMotivation
                  selected={motivation}
                  onChange={setMotivation}
                  onContinue={handleMotivationContinue}
                  onSkip={() => markSkipped("motivacao", 2)}
                />
              )}

              {step === 2 && (
                <StepFinancialSituation
                  financialSituation={financialSituation}
                  experienceLevel={experienceLevel}
                  onChangeSituation={setFinancialSituation}
                  onChangeExperience={setExperienceLevel}
                  onContinue={handleSituationContinue}
                  onSkip={() => markSkipped("perfil", 3)}
                />
              )}

              {step === 3 && (
                <StepIncome
                  initialValue={incomeDraft}
                  onContinue={handleIncomeContinue}
                  onSkip={() => markSkipped("renda", 4)}
                />
              )}

              {step === 4 && (
                <StepExpenses onContinue={handleExpensesContinue} onSkip={() => markSkipped("despesas", 5)} />
              )}

              {step === 5 && <StepDebts onContinue={handleDebtsContinue} onSkip={() => markSkipped("dividas", 6)} />}

              {step === 6 && (
                <StepHabits onContinue={handleHabitsContinue} onSkip={() => markSkipped("habitos", 7)} />
              )}

              {step === 7 && (
                <StepResults saving={saving} onFinish={() => finishOnboarding(skippedSteps)} />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
