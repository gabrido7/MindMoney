import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(60),
  type: z.enum(["entrada", "saida", "ambos"]),
});

export const createSubcategorySchema = z.object({
  name: z.string().trim().min(1).max(60),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateSubcategoryInput = z.infer<typeof createSubcategorySchema>;
