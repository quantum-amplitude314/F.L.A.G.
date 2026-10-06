import "server-only";

import { z } from "zod";

const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  JOIN_FLAG_RECIPIENT: z.email(),
  JOIN_FLAG_SENDER: z.string().min(1).default("F.L.A.G. <onboarding@resend.dev>"),
  TURNSTILE_SECRET_KEY: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
