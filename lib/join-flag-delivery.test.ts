import { beforeEach, describe, expect, mock, test } from "bun:test";
import type { Env } from "@/lib/env";

type SendResult = {
  data: { id: string } | null;
  error: { message: string; name: string } | null;
};

const envMock: Env = {
  RESEND_API_KEY: "re_test",
  JOIN_FLAG_RECIPIENT: "devon@flag.example",
  JOIN_FLAG_SENDER: "F.L.A.G. <flag@flag.example>",
  TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
};
const sendMock = mock<(input: unknown) => Promise<SendResult>>();

mock.module("server-only", () => ({}));
mock.module("./env", () => ({ env: envMock }));
mock.module("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

const { deliverJoinFlagRequest } = await import("@/lib/join-flag-delivery");

const request = {
  name: "Michael Knight",
  email: "michael@flag.example",
  message: "One man can make a difference.",
};

beforeEach(() => {
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: "email_1" }, error: null });
});

describe("deliverJoinFlagRequest", () => {
  test("sends the request to the recipient with the visitor as reply-to", async () => {
    await deliverJoinFlagRequest(request);

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({
      from: "F.L.A.G. <flag@flag.example>",
      to: "devon@flag.example",
      replyTo: request.email,
      subject: `Join F.L.A.G. form: ${request.name}`,
      text: `${request.name} <${request.email}>\n\n${request.message}`,
    });
  });

  test("rejects when Resend reports an error", async () => {
    sendMock.mockResolvedValue({
      data: null,
      error: { message: "Invalid API key", name: "validation_error" },
    });

    await expect(deliverJoinFlagRequest(request)).rejects.toThrow(
      "Invalid API key",
    );
  });
});
