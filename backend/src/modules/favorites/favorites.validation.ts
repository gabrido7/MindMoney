import { z } from "zod";

export const contentTypeSchema = z.enum(["lesson", "tool"]);

export const favoriteParamsSchema = z.object({
  contentType: contentTypeSchema,
  contentId: z.string().trim().min(1).max(150),
});

export const favoriteBodySchema = z.object({
  contentType: contentTypeSchema,
  contentId: z.string().trim().min(1).max(150),
});

export type FavoriteParams = z.infer<typeof favoriteParamsSchema>;
export type FavoriteBody = z.infer<typeof favoriteBodySchema>;
