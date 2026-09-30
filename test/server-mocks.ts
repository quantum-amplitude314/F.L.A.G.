import { mock } from "bun:test";
import type { Env } from "@/lib/env";

type SendResult = {
  data: { id: string } | null;
  error: { message: string; name: string } | null;
};

export const testEnv: Env = {
  RESEND_API_KEY: "re_test",
  JOIN_FLAG_RECIPIENT: "devon@flag.example",
  JOIN_FLAG_SENDER: "F.L.A.G. <flag@flag.example>",
  TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
};

export const sentEmail: SendResult = { data: { id: "email_1" }, error: null };

export const mockServerModules = () => {
  const sendMock = mock<(input: unknown) => Promise<SendResult>>();
  mock.module("server-only", () => ({}));
  mock.module("@/lib/env", () => ({ env: testEnv }));
  mock.module("resend", () => ({
    Resend: class {
      emails = { send: sendMock };
    },
  }));
  const mocks = { sendMock };

  return mocks;
};
