import type { ReactNode } from "react";

export const statusActionClassName =
  "h-12 rounded-full px-6 font-mono uppercase tracking-[0.14em] shadow-[0_0_30px_-10px_var(--primary)]";

type StatusPageProps = { eyebrow: string; title: string; lead: string; children: ReactNode };

/** The 404 and error pages: the hero's type scale without the scene. */
export function StatusPage({ eyebrow, title, lead, children }: StatusPageProps) {
  return (
    <main className="flex flex-1 items-center px-[clamp(1.5rem,5vw,8rem)] py-32">
      <div className="max-w-3xl">
        <p className="text-base font-semibold uppercase tracking-[0.22em] text-primary sm:text-lg">
          {eyebrow}
        </p>
        <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-semibold text-white">
          {title}
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">{lead}</p>
        <div className="mt-10 flex flex-wrap gap-3">{children}</div>
      </div>
    </main>
  );
}
