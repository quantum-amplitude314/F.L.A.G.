export const joinFlagLimits = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 254,
  messageMin: 4,
  messageMax: 1200,
} as const;

export const joinFlagCopy = {
  trigger: "Join F.L.A.G.",
  title: "Join F.L.A.G.",
  description:
    "The Foundation is always looking for a man who can make a difference.",
  fields: {
    name: {
      label: "Name",
      required: "Give us a name, even a cover one.",
      tooLong: `Keep the name under ${joinFlagLimits.nameMax} characters.`,
    },
    email: {
      label: "Email",
      required: "We need a way to reach you.",
      invalid: "Enter a valid email address.",
      tooLong: `Keep the email under ${joinFlagLimits.emailMax} characters.`,
    },
    message: {
      label: "Your message",
      required: "Tell us why you are calling.",
      tooShort: `Tell us a little more — at least ${joinFlagLimits.messageMin} characters.`,
      tooLong: `Keep it under ${joinFlagLimits.messageMax} characters.`,
    },
  },
  verification: {
    required: "Complete the verification check.",
    failed: "Verification failed. Try again.",
  },
  submit: "Transmit",
  submitting: "Transmitting…",
  failed: "Transmission failed. Try again in a moment.",
  sent: (name: string) =>
    `Transmission received, ${name}. Devon will be in touch.`,
} as const;
