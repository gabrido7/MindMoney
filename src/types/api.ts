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
  createdAt: string;
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
  type: "limit_exceeded" | "goal_achieved";
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

export interface ApiContribution {
  id: number;
  objective_id: number;
  amount: number;
  contributed_at: string;
  note: string | null;
  created_at: string;
}
