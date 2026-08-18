import { newsletterRepository } from "./newsletter.repository";

export const newsletterService = {
  /** Idempotente: reenviar o mesmo e-mail não é erro, só não duplica a linha. */
  async subscribe(name: string, email: string): Promise<{ alreadySubscribed: boolean }> {
    const existing = await newsletterRepository.findByEmail(email);
    if (existing) return { alreadySubscribed: true };

    await newsletterRepository.create(name, email);
    return { alreadySubscribed: false };
  },
};
