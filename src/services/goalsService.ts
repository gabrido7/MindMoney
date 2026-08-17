import { apiRequest } from "./api";
import type { ApiGoal } from "../types/api";

export const goalsService = {
  list: (month?: string) => apiRequest<{ goals: ApiGoal[] }>("/goals", { query: { month } }),

  create: (input: { referenceMonth: string; targetAmount: number }) =>
    apiRequest<{ goal: ApiGoal }>("/goals", { method: "POST", body: input }),

  update: (id: number, input: { targetAmount: number }) =>
    apiRequest<{ goal: ApiGoal }>(`/goals/${id}`, { method: "PUT", body: input }),

  remove: (id: number) => apiRequest<void>(`/goals/${id}`, { method: "DELETE" }),
};
