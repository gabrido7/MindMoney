import { randomBytes, createHash } from "crypto";

export const RESET_TOKEN_TTL_MINUTES = 30;

export const hashResetToken = (token: string): string => createHash("sha256").update(token).digest("hex");

export function generateResetToken(): { token: string; tokenHash: string; expiresAt: Date } {
  const token = randomBytes(32).toString("hex");
  return {
    token,
    tokenHash: hashResetToken(token),
    expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000),
  };
}
