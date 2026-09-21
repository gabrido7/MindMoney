import { apiRequest } from "./api";
import type { Account, AccountInput } from "../types/api";

export const accountsService = {
  list: () => apiRequest<{ accounts: Account[] }>("/accounts"),

  create: (input: AccountInput) => apiRequest<{ account: Account }>("/accounts", { method: "POST", body: input }),

  remove: (id: number) => apiRequest<void>(`/accounts/${id}`, { method: "DELETE" }),
};
