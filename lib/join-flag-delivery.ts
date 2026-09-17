import "server-only";

import { Resend } from "resend";
import type { JoinFlagRequest } from "@/lib/join-flag";

const resendApiKey = process.env.RESEND_API_KEY;
const recipient = process.env.JOIN_FLAG_RECIPIENT;
const sender =
  process.env.JOIN_FLAG_SENDER ?? "F.L.A.G. <onboarding@resend.dev>";
const deliveryTimeoutMs = 5_000;

const sendWithTimeout = async <T>(send: Promise<T>) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error("Resend did not answer in time")),
      deliveryTimeoutMs,
    );
  });

  try {
    return await Promise.race([send, timeout]);
  } finally {
    clearTimeout(timer);
  }
};

export const deliverJoinFlagRequest = async ({
  name,
  email,
  message,
}: JoinFlagRequest) => {
  if (!resendApiKey || !recipient) {
    console.debug("[join-flag] delivery not configured", {
      name,
      email,
      message,
    });

    return;
  }

  const resend = new Resend(resendApiKey);
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
