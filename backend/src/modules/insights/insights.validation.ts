import { z } from "zod";

export const insightsQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "month deve estar no formato YYYY-MM")
    .optional(),
});

export const askQuestionSchema = z.object({
  question: z.string().trim().min(1).max(300),
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "month deve estar no formato YYYY-MM")
    .optional(),
});
