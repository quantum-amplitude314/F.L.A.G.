import "server-only";

const secretKey = process.env.TURNSTILE_SECRET_KEY;
const verifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const verifyTimeoutMs = 5_000;

export const turnstileResponseField = "cf-turnstile-response";

export const isTurnstileConfigured = () => Boolean(secretKey);

export const verifyTurnstileToken = async (token: string) => {
  if (!secretKey) return true;

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
