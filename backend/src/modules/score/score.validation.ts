import { z } from "zod";

export const scoreQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "month deve estar no formato YYYY-MM")
    .optional(),
});

export const scoreHistoryQuerySchema = z.object({
  months: z.coerce.number().int().min(1).max(24).optional(),
});
