import { z } from "zod";

export const subscribeSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(150),
  email: z.string().trim().email("Informe um e-mail válido.").max(255),
});
