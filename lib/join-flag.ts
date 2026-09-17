import { z } from "zod";
import { joinFlagCopy, joinFlagLimits } from "@/lib/join-flag-copy";

const { name, email, message } = joinFlagCopy.fields;
const { nameMin, nameMax, emailMax, messageMin, messageMax } = joinFlagLimits;

export const joinFlagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(nameMin, name.required)
    .max(nameMax, name.tooLong),
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

export type JoinFlagState =
  | { status: "idle" }
  | {
      status: "invalid";
      values: Record<JoinFlagField, string>;
      errors: Partial<Record<JoinFlagField | "verification", string>>;
    }
  | { status: "failed"; values: Record<JoinFlagField, string> }
  | { status: "sent"; name: string };

export const initialJoinFlagState: JoinFlagState = { status: "idle" };
