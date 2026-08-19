import { apiRequest } from "./api";
import type {
  ApiObjective,
  ApiContribution,
  ObjectiveCategory,
  ObjectiveEvolutionPoint,
  ObjectivePriority,
  ObjectiveSummary,
} from "../types/api";

export interface ObjectiveInput {
  name: string;
  category: ObjectiveCategory;
  priority: ObjectivePriority;
  targetAmount: number;
  targetMonth: string;
}

export interface ContributionInput {
  amount: number;
  contributedAt: string;
  note?: string;
}

export const objectivesService = {
  list: () => apiRequest<{ objectives: ApiObjective[] }>("/objectives"),

  summary: () => apiRequest<ObjectiveSummary>("/objectives/summary"),

  evolution: () => apiRequest<{ evolution: ObjectiveEvolutionPoint[] }>("/objectives/evolution"),

  create: (input: ObjectiveInput) =>
    apiRequest<{ objective: ApiObjective }>("/objectives", { method: "POST", body: input }),

  update: (id: number, input: ObjectiveInput) =>
    apiRequest<{ objective: ApiObjective }>(`/objectives/${id}`, { method: "PUT", body: input }),

  remove: (id: number) => apiRequest<void>(`/objectives/${id}`, { method: "DELETE" }),

  listContributions: (id: number) =>
    apiRequest<{ contributions: ApiContribution[] }>(`/objectives/${id}/contributions`),

  addContribution: (id: number, input: ContributionInput) =>
    apiRequest<{ objective: ApiObjective }>(`/objectives/${id}/contributions`, {
      method: "POST",
      body: input,
    }),

  removeContribution: (id: number, contributionId: number) =>
    apiRequest<{ objective: ApiObjective }>(`/objectives/${id}/contributions/${contributionId}`, {
      method: "DELETE",
    }),
};
