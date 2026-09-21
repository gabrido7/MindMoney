import { z } from "zod";

export const netWorthHistoryQuerySchema = z.object({
  months: z.coerce.number().int().min(2).max(24).optional(),
});
