"use server";

import { type JoinFlagState, type JoinFlagValues, parseJoinFlag } from "@/lib/join-flag";
import { joinFlagCopy } from "@/lib/join-flag-copy";
import { deliverJoinFlagRequest } from "@/lib/join-flag-delivery";
import { turnstileTokenSchema, verifyTurnstileToken } from "@/lib/turnstile";

const { verification } = joinFlagCopy;

const verificationRequired: JoinFlagState = {
  status: "invalid",
  errors: { verification: verification.required },
};
const verificationFailed: JoinFlagState = {
  status: "invalid",
  errors: { verification: verification.failed },
};
const deliveryFailed: JoinFlagState = { status: "failed" };

export const submitJoinFlag = async ({
  values,
  token,
}: {
  values: JoinFlagValues;
  token: string | null;
}): Promise<JoinFlagState> => {
  const parsed = parseJoinFlag(values);
  if (!parsed.success) {
    const invalid: JoinFlagState = { status: "invalid", errors: parsed.errors };

    return invalid;
  }
  const { data: request } = parsed;

  const parsedToken = turnstileTokenSchema.safeParse(token);
  if (!parsedToken.success) return verificationRequired;

  const verified = await verifyTurnstileToken(parsedToken.data).catch((error) => {
    console.error("[join-flag] verification failed", error);

    return false;
  });
  if (!verified) return verificationFailed;

  try {
    await deliverJoinFlagRequest(request);
  } catch (error) {
    console.error("[join-flag] delivery failed", error);

    return deliveryFailed;
  }
  const sent: JoinFlagState = { status: "sent", name: request.name };

  return sent;
};
