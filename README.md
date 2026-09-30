# F.L.A.G. concept fan-made page

Next.js App Router, React 19, Tailwind 4, shadcn (Base UI), Motion.
Artwork generated and fine-tuned by hand.
Infra on Vercel.

## Develop

```zsh
bun install
bun run dev        # http://localhost:3000
bun run format     # biome format --write
bun run lint-fix
bun run typecheck
bun run build
```

## Environment

Copy `.env.example` to `.env.local` for `next dev`. Every variable is required except `JOIN_FLAG_SENDER`; Zod parses them in `lib/env.ts` (server) and `lib/public-env.ts` (browser), and a missing or invalid one fails the build.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key (server-only) |
| `JOIN_FLAG_RECIPIENT` | Inbox that receives Join F.L.A.G. requests |
| `JOIN_FLAG_SENDER` | From address, default `F.L.A.G. <onboarding@resend.dev>` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key, inlined into the browser bundle at build |
| `TURNSTILE_SECRET_KEY` | Turnstile secret key (server-only) |

`.env.example` has the Turnstile test keys, which work on localhost.
