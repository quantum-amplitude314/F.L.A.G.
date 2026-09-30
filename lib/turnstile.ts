import "server-only";

import { env } from "@/lib/env";

const { TURNSTILE_SECRET_KEY: secretKey } = env;
const verifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const verifyTimeoutMs = 5_000;

export const verifyTurnstileToken = async (token: string) => {
  const response = await fetch(verifyUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ secret: secretKey, response: token }),
    signal: AbortSignal.timeout(verifyTimeoutMs),
  });
  const { success, "error-codes": errorCodes } = (await response.json()) as {
    success: boolean;
    "error-codes"?: string[];
  };
  if (!success) console.error("[join-flag] turnstile rejected", errorCodes);

  return success;
};
