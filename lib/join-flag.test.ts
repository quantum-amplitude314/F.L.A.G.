import { describe, expect, test } from "bun:test";
import { parseJoinFlag } from "@/lib/join-flag";
import { joinFlagCopy } from "@/lib/join-flag-copy";

const { fields } = joinFlagCopy;

const validValues = {
  name: "Michael Knight",
  email: "michael@flag.example",
  message: "One man can make a difference.",
};

describe("parseJoinFlag", () => {
  test("returns the trimmed request when every field is valid", () => {
    const parsed = parseJoinFlag({
      name: "  Michael Knight ",
      email: " michael@flag.example ",
      message: " One man can make a difference. ",
    });

    expect(parsed).toEqual({ success: true, data: validValues });
  });

  test("returns the first message of each invalid field", () => {
    const parsed = parseJoinFlag({ name: "M", email: "michael", message: "" });

    expect(parsed).toEqual({
      success: false,
      errors: {
        name: fields.name.required,
        email: fields.email.invalid,
        message: fields.message.required,
      },
    });
  });

  test("leaves valid fields without a message", () => {
    const parsed = parseJoinFlag({ ...validValues, message: "Hi" });

    expect(parsed).toEqual({
      success: false,
      errors: {
        name: undefined,
        email: undefined,
        message: fields.message.tooShort,
      },
    });
  });
});
