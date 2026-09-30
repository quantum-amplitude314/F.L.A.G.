import "server-only";

import { z } from "zod";
import { env } from "@/lib/env";

const { TURNSTILE_SECRET_KEY: secretKey } = env;
const verifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const verifyTimeoutMs = 5_000;

export const turnstileTokenSchema = z.string().min(1).max(2048);

const verifyResponseSchema = z.object({
  success: z.boolean(),
  "error-codes": z.array(z.string()).default([]),
});

export const verifyTurnstileToken = async (token: string) => {
  const response = await fetch(verifyUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ secret: secretKey, response: token }),
    signal: AbortSignal.timeout(verifyTimeoutMs),
  });
  const { success, "error-codes": errorCodes } = verifyResponseSchema.parse(
    await response.json(),
  );
  if (!success) console.error("[join-flag] turnstile rejected", errorCodes);

  return success;
};
