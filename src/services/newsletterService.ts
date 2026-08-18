import { apiRequest } from "./api";

export const newsletterService = {
  subscribe: (input: { name: string; email: string }) =>
    apiRequest<{ alreadySubscribed: boolean }>("/newsletter", { method: "POST", body: input }),
};
