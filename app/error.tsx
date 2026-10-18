"use client";

import Link from "next/link";
import { StatusPage, statusActionClassName } from "@/components/status-page";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <StatusPage
      eyebrow="System fault"
      title="K.I.T.T. hit a glitch."
      lead="Something on this page failed. Try again, or head back to base."
    >
      <Button size="lg" className={statusActionClassName} onClick={() => retry()}>
        Try again
      </Button>
      <Button
        size="lg"
        variant="outline"
        className={statusActionClassName}
        nativeButton={false}
        render={<Link href="/">Back to base</Link>}
      />
    </StatusPage>
  );
}
