import { z } from "zod";
import { joinFlagCopy, joinFlagLimits } from "@/lib/join-flag-copy";

const { name, email, message } = joinFlagCopy.fields;
const { nameMin, nameMax, emailMax, messageMin, messageMax } = joinFlagLimits;

export const joinFlagSchema = z.object({
  name: z.string().trim().min(nameMin, name.required).max(nameMax, name.tooLong),
  email: z
    .string()
    .trim()
    .min(1, email.required)
    .max(emailMax, email.tooLong)
    .pipe(z.email(email.invalid)),
  message: z
    .string()
    .trim()
    .min(1, message.required)
    .min(messageMin, message.tooShort)
    .max(messageMax, message.tooLong),
});

export type JoinFlagRequest = z.infer<typeof joinFlagSchema>;

export type JoinFlagField = keyof JoinFlagRequest;

export type JoinFlagValues = Record<JoinFlagField, string>;

export type JoinFlagErrors = Partial<Record<JoinFlagField | "verification", string | undefined>>;

export type JoinFlagState =
  | { status: "idle" }
  | { status: "invalid"; errors: JoinFlagErrors }
  | { status: "failed" }
  | { status: "sent"; name: string };

export const initialJoinFlagState: JoinFlagState = { status: "idle" };

/** Same check on both sides: the client skips the round-trip, the server never trusts the client. */
export const parseJoinFlag = (values: JoinFlagValues) => {
  const { success, data, error } = joinFlagSchema.safeParse(values);
  if (success) {
    const valid = { success, data };

    return valid;
  }

  const {
    fieldErrors: { name: [nameError] = [], email: [emailError] = [], message: [messageError] = [] },
  } = z.flattenError(error);
  const errors: JoinFlagErrors = {
    name: nameError,
    email: emailError,
    message: messageError,
  };
  const invalid = { success, errors };

  return invalid;
};
