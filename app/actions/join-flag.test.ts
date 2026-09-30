import {
  afterEach,
  beforeEach,
  describe,
  expect,
  mock,
  spyOn,
  test,
} from "bun:test";
import type { JoinFlagState } from "@/lib/join-flag";
import { joinFlagCopy } from "@/lib/join-flag-copy";
import { mockServerModules, sentEmail } from "@/test/server-mocks";

const { sendMock } = mockServerModules();

const { submitJoinFlag } = await import("@/app/actions/join-flag");

const { verification } = joinFlagCopy;
const values = {
  name: "Michael Knight",
  email: "michael@flag.example",
  message: "One man can make a difference.",
};
const token = "XXXX.DUMMY.TOKEN.XXXX";
const verificationRequired: JoinFlagState = {
  status: "invalid",
  errors: { verification: verification.required },
};
const verificationFailed: JoinFlagState = {
  status: "invalid",
  errors: { verification: verification.failed },
};

const answerVerification = (body: unknown) =>
  spyOn(globalThis, "fetch").mockResolvedValue(Response.json(body));

beforeEach(() => {
  sendMock.mockReset();
  sendMock.mockResolvedValue(sentEmail);
  spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  mock.restore();
});

describe("submitJoinFlag", () => {
  test("returns field errors without verifying an invalid form", async () => {
    const fetchSpy = answerVerification({ success: true });

    const state = await submitJoinFlag({
      values: { ...values, email: "michael" },
      token,
    });

    expect(state).toMatchObject({ status: "invalid" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test("asks for verification when the token is missing", async () => {
    const fetchSpy = answerVerification({ success: true });

    const state = await submitJoinFlag({ values, token: null });

    expect(state).toEqual(verificationRequired);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test("asks for verification when the token is malformed", async () => {
    answerVerification({ success: true });

    const state = await submitJoinFlag({ values, token: "x".repeat(2049) });

    expect(state).toEqual(verificationRequired);
  });

  test("reports failed verification when Cloudflare rejects the token", async () => {
    answerVerification({
      success: false,
      "error-codes": ["invalid-input-response"],
    });

    const state = await submitJoinFlag({ values, token });

    expect(state).toEqual(verificationFailed);
    expect(sendMock).not.toHaveBeenCalled();
  });

  test("reports failed verification when Cloudflare answers unexpectedly", async () => {
    answerVerification({ outcome: "unknown" });

    const state = await submitJoinFlag({ values, token });

    expect(state).toEqual(verificationFailed);
    expect(sendMock).not.toHaveBeenCalled();
  });

  test("reports a failed delivery", async () => {
    answerVerification({ success: true });
    sendMock.mockResolvedValue({
      data: null,
      error: { message: "Invalid API key", name: "validation_error" },
    });

    const state = await submitJoinFlag({ values, token });

    expect(state).toEqual({ status: "failed" });
  });

  test("delivers a verified request", async () => {
    answerVerification({ success: true });

    const state = await submitJoinFlag({ values, token });

    expect(state).toEqual({ status: "sent", name: values.name });
    expect(sendMock).toHaveBeenCalledTimes(1);
  });
});
