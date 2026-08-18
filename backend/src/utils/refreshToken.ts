import { randomBytes, createHash } from "crypto";
import { env } from "../config/env";

export const hashRefreshToken = (token: string): string => createHash("sha256").update(token).digest("hex");

export function generateRefreshToken(): { token: string; tokenHash: string; expiresAt: Date } {
  const token = randomBytes(32).toString("hex");
  return {
    token,
    tokenHash: hashRefreshToken(token),
    expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000),
  };
}
