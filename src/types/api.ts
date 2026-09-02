/**
 * Tipos do que a API realmente devolve. Ficam separados de src/types/index.ts
 * (o modelo usado hoje pelo Dashboard, ainda em localStorage) de propósito —
 * são shapes diferentes (a API já traz category_name/color via JOIN, por
 * exemplo) e cada um evolui no seu próprio ritmo até a integração completa.
 */

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  passwordChangedAt: string | null;
  onboardingCompletedAt: string | null;
  createdAt: string;
}

export interface ApiSession {
  id: number;
  device: string;
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string;
  current: boolean;
}

export type NotificationType =
  | "limit_exceeded"
  | "goal_achieved"
  | "objective_deadline"
  | "category_budget_exceeded"
  | "onboarding_pending"
  | "debt_due_date";

export type NotificationPreferences = Record<NotificationType, boolean>;

export type ExperienceLevel = "iniciante" | "intermediario" | "avancado";
export type IncomeRange = "ate_2k" | "2k_5k" | "5k_10k" | "10k_20k" | "acima_20k";
export type FinancialSituation = "tudo_controle" | "aperta_mas_consigo" | "vivo_no_limite" | "endividado";
export type FinancialPriority =
  | "reserva_emergencia"
  | "quitar_dividas"
  | "investir"
  | "comprar_um_bem"
  | "aposentadoria"
  | "educacao"
  | "organizar_financas"
  | "alcancar_objetivos"
  | "controlar_gastos"
  | "construir_patrimonio";

export interface FinancialHabits {
  tracksSpending: "sim" | "as_vezes" | "nao";
  overspends: "nunca" | "as_vezes" | "frequentemente";
  creditCardUsage: "nao" | "pouco" | "frequentemente";
  investsRegularly: "nunca" | "as_vezes" | "regularmente";
}

export interface BehaviorProfile {
  label: string;
  description: string;
}

export interface FinancialRecommendation {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  actionPath: string;
}

export interface FinancialProfile {
  experienceLevel: ExperienceLevel | null;
  financialSituation: FinancialSituation | null;
  incomeRange: IncomeRange | null;
  incomeVariable: boolean;
  incomeMin: number | null;
  incomeMax: number | null;
  incomeSources: string[];
  priorities: FinancialPriority[];
  habits: FinancialHabits | null;
  updatedAt: string | null;
  recommendations: FinancialRecommendation[];
  behaviorProfile: BehaviorProfile | null;
}

/** Payload parcial -- cada passo do onboarding manda só os campos que perguntou (ver financialProfile.validation.ts no backend). */
export type UpdateFinancialProfileInput = Partial<{
  experienceLevel: ExperienceLevel | null;
  financialSituation: FinancialSituation | null;
  incomeRange: IncomeRange | null;
  incomeVariable: boolean;
  incomeMin: number | null;
  incomeMax: number | null;
  incomeSources: string[];
  priorities: FinancialPriority[];
  habits: FinancialHabits | null;
}>;

export type DebtType = "cartao_credito" | "emprestimo" | "financiamento" | "cheque_especial" | "parcelamento" | "outro";

export interface Debt {
  id: number;
  type: DebtType;
  name: string;
  totalAmount: number;
  installmentAmount: number | null;
  interestRate: number | null;
  installmentsCount: number | null;
  dueDay: number | null;
  createdAt: string;
  paidAmount: number;
  remainingAmount: number;
  progressPercent: number;
  paidOff: boolean;
  daysUntilDue: number | null;
}

export interface DebtPayment {
  id: number;
  amount: number;
  paidAt: string;
  note: string | null;
  transactionId: number | null;
  createdAt: string;
}

export interface DebtPaymentWithDebtName extends DebtPayment {
  debtName: string;
}

export interface DebtPaymentInput {
  amount: number;
  paidAt: string;
  note?: string;
}

export interface DebtInput {
  type: DebtType;
  name: string;
  totalAmount: number;
  installmentAmount?: number | null;
  interestRate?: number | null;
  installmentsCount?: number | null;
  dueDay?: number | null;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: PublicUser;
}

export interface ApiCategory {
  id: number;
  user_id: number;
  name: string;
  color: string;
  type: "entrada" | "saida" | "ambos";
  is_builtin: 0 | 1;
  archived_at: string | null;
  subcategories: ApiSubcategory[];
}

export interface ApiSubcategory {
  id: number;
  category_id: number;
  name: string;
  color: string;
  archived_at: string | null;
}

export interface ApiTransaction {
  id: number;
  user_id: number;
  category_id: number;
  subcategory_id: number | null;
  category_name: string;
  category_color: string;
  subcategory_name: string | null;
  description: string;
  amount: number;
  type: "entrada" | "saida";
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export interface ApiTransactionInput {
  categoryId: number;
  subcategoryId?: number;
  description: string;
  amount: number;
  type: "entrada" | "saida";
  transactionDate: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiGoal {
  id: number;
  user_id: number;
  reference_month: string;
  target_amount: number;
  created_at: string;
  updated_at: string;
  saldo: number;
  progressPercent: number;
}

export interface ApiNotification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  read_at: string | null;
  created_at: string;
}

export interface DashboardMonthSummary {
  month: string;
  totals: { entradas: number; saidas: number; saldo: number };
  previousMonth: { month: string; entradas: number; saidas: number; saldo: number };
  changes: { entradas: number; saidas: number; saldo: number };
  categoryBreakdown: { categoryId: number; name: string; color: string; value: number }[];
  ranking: { categoryId: number; name: string; color: string; value: number }[];
  goal: { id: number; targetAmount: number; progressPercent: number } | null;
  alert: { status: "over" | "near" | "ok"; gastoPercentual: number; threshold: number };
}

export interface DashboardData extends DashboardMonthSummary {
  evolution: { month: string; saldo: number }[];
}

export interface DashboardRangeData {
  months: DashboardMonthSummary[];
  evolution: { month: string; saldo: number }[];
}

export type ScoreLevel = "Excelente" | "Bom" | "Regular" | "Atenção" | "Crítico";

export interface ScoreData {
  month: string;
  score: number;
  level: ScoreLevel;
  breakdown: {
    spendingControl: number;
    savingsCapacity: number;
    evolution: number;
    consistency: number;
    hasGoal: boolean;
    gastoPercentual: number;
    monthsWithinLimit: number;
  };
}

export interface ScoreHistoryEntry {
  month: string;
  score: number;
  level: ScoreLevel;
}

export type ObjectiveCategory = "compra" | "viagem" | "educacao" | "reserva" | "patrimonio" | "personalizada";

export type ObjectivePriority = "alta" | "media" | "baixa";

export type PaceStatus = "on_track" | "behind" | "ahead" | "insufficient_data" | null;

export interface ApiObjective {
  id: number;
  name: string;
  category: ObjectiveCategory;
  priority: ObjectivePriority;
  targetAmount: number;
  targetMonth: string;
  currentAmount: number;
  remainingAmount: number;
  progressPercent: number;
  achieved: boolean;
  overdue: boolean;
  monthsRemaining: number;
  requiredMonthlyAmount: number;
  daysRemaining: number;
  createdAt: string;
  monthlyPace: number | null;
  paceStatus: PaceStatus;
  paceMonthlyDifference: number;
  paceMonthsEarlier: number;
}

export interface ObjectiveSummary {
  totalTarget: number;
  totalSaved: number;
  overallProgressPercent: number;
  nearDeadlineCount: number;
  totalObjectives: number;
  mostUrgentObjective: {
    id: number;
    name: string;
    category: ObjectiveCategory;
    daysRemaining: number;
  } | null;
}

export interface ObjectiveEvolutionPoint {
  month: string;
  totalSaved: number;
}

export type FavoriteContentType = "lesson" | "tool";

export interface ApiFavorite {
  contentType: FavoriteContentType;
  contentId: string;
  createdAt: string;
}

export interface ApiLessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt: string | null;
  quizScore: number | null;
  quizTotal: number | null;
  exerciseResponse: string | null;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface GamificationSummary {
  totalXp: number;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  streak: number;
  achievements: Achievement[];
}

export interface GamificationResult {
  xpAwarded: number;
  totalXp: number;
  level: number;
  leveledUp: boolean;
  newAchievements: Achievement[];
}

export interface ApiContribution {
  id: number;
  objective_id: number;
  amount: number;
  contributed_at: string;
  note: string | null;
  created_at: string;
}

export type CategoryBudgetStatus = "ok" | "near" | "over";

export interface CategoryBudget {
  id: number;
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  amount: number;
  spent: number;
  percent: number;
  status: CategoryBudgetStatus;
}
