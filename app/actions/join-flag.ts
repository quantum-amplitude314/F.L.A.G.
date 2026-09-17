"use server";

import { z } from "zod";
import { type JoinFlagState, joinFlagSchema } from "@/lib/join-flag";
import { joinFlagCopy } from "@/lib/join-flag-copy";
import { deliverJoinFlagRequest } from "@/lib/join-flag-delivery";
import {
  isTurnstileConfigured,
  turnstileResponseField,
  verifyTurnstileToken,
} from "@/lib/turnstile";

const { verification } = joinFlagCopy;

export const submitJoinFlag = async (
  _previous: JoinFlagState,
  formData: FormData,
): Promise<JoinFlagState> => {
  const field = (name: string) => {
    const value = formData.get(name);

    return typeof value === "string" ? value : "";
  };
  const values = {
    name: field("name"),
    email: field("email"),
    message: field("message"),
  };
  const parsed = joinFlagSchema.safeParse(values);

  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    const errors = {
      name: fieldErrors.name?.[0],
      email: fieldErrors.email?.[0],
      message: fieldErrors.message?.[0],
    };

    return { status: "invalid", values, errors };
  }

  if (isTurnstileConfigured()) {
    const token = field(turnstileResponseField);

    if (!token) {
      return {
        status: "invalid",
        values,
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
        values,
        errors: { verification: verification.failed },
      };
    }
  }

  try {
    await deliverJoinFlagRequest(parsed.data);
  } catch (error) {
    console.error("[join-flag] delivery failed", error);

    return { status: "failed", values };
  }

  return { status: "sent", name: parsed.data.name };
};
