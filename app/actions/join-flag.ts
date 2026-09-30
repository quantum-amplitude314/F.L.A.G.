"use server";

import {
  type JoinFlagState,
  type JoinFlagValues,
  parseJoinFlag,
} from "@/lib/join-flag";
import { joinFlagCopy } from "@/lib/join-flag-copy";
import { deliverJoinFlagRequest } from "@/lib/join-flag-delivery";
import { verifyTurnstileToken } from "@/lib/turnstile";

const { verification } = joinFlagCopy;

export const submitJoinFlag = async ({
  values,
  token,
}: {
  values: JoinFlagValues;
  token: string | null;
}): Promise<JoinFlagState> => {
  const parsed = parseJoinFlag(values);
  if (!parsed.success) return { status: "invalid", errors: parsed.errors };

  if (!token) {
    return {
      status: "invalid",
      errors: { verification: verification.required },
    };
  }

  const verified = await verifyTurnstileToken(token).catch((error) => {
    console.error("[join-flag] verification failed", error);

    return false;
  });

  if (!verified) {
    return {
      status: "invalid",
      errors: { verification: verification.failed },
    };
  }

  try {
    await deliverJoinFlagRequest(parsed.data);
  } catch (error) {
    console.error("[join-flag] delivery failed", error);

    return { status: "failed" };
  }

  return { status: "sent", name: parsed.data.name };
};
