import { beforeEach, describe, expect, test } from "bun:test";
import { mockServerModules, sentEmail, testEnv } from "@/test/server-mocks";

const { sendMock } = mockServerModules();

const { deliverJoinFlagRequest } = await import("@/lib/join-flag-delivery");

const request = {
  name: "Michael Knight",
  email: "michael@flag.example",
  message: "One man can make a difference.",
};

beforeEach(() => {
  sendMock.mockReset();
  sendMock.mockResolvedValue(sentEmail);
});

describe("deliverJoinFlagRequest", () => {
  test("sends the request to the recipient with the visitor as reply-to", async () => {
    await deliverJoinFlagRequest(request);

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({
      from: testEnv.JOIN_FLAG_SENDER,
      to: testEnv.JOIN_FLAG_RECIPIENT,
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

    await expect(deliverJoinFlagRequest(request)).rejects.toThrow("Invalid API key");
  });
});
