import { z } from "zod";

export const dashboardRangeQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "month deve estar no formato YYYY-MM")
    .optional(),
  months: z.coerce.number().int().min(1).max(24).default(6),
});

export type DashboardRangeQuery = z.infer<typeof dashboardRangeQuerySchema>;
