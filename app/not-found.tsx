import Link from "next/link";
import { StatusPage, statusActionClassName } from "@/components/status-page";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <StatusPage
      eyebrow="Signal lost · 404"
      title="This road leads nowhere."
      lead="The Foundation has no record of this page."
    >
      <Button
        size="lg"
        className={statusActionClassName}
        nativeButton={false}
        render={<Link href="/">Back to base</Link>}
      />
    </StatusPage>
  );
}
