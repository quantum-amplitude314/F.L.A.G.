import "server-only";

import { Resend } from "resend";
import { env } from "@/lib/env";
import type { JoinFlagRequest } from "@/lib/join-flag";

const deliveryTimeoutMs = 5_000;

const sendWithTimeout = async <T>(send: Promise<T>) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Resend did not answer in time")), deliveryTimeoutMs);
  });

  try {
    return await Promise.race([send, timeout]);
  } finally {
    clearTimeout(timer);
  }
};

export const deliverJoinFlagRequest = async ({ name, email, message }: JoinFlagRequest) => {
  const { RESEND_API_KEY: apiKey, JOIN_FLAG_RECIPIENT: recipient, JOIN_FLAG_SENDER: sender } = env;
  const resend = new Resend(apiKey);
  const { error } = await sendWithTimeout(
    resend.emails.send({
      from: sender,
      to: recipient,
      replyTo: email,
      subject: `Join F.L.A.G. form: ${name}`,
      text: `${name} <${email}>\n\n${message}`,
    }),
  );

  if (error) throw new Error(error.message);
};
