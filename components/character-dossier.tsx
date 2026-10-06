import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { TiltCard } from "@/components/ui/tilt-card";

export interface DossierTrait {
  icon: LucideIcon;
  label: string;
  detail: string;
}

export interface DossierProfile {
  id: string;
  name: string;
  role: string;
  statement: string;
  biography: string;
  avatar: string;
  avatarAlt: string;
  poster: string;
  posterAlt: string;
  traits: readonly DossierTrait[];
}

interface CharacterDossierProps {
  profile: DossierProfile;
}

export function CharacterDossier({ profile }: CharacterDossierProps) {
  const { id, name, role, statement, biography, avatar, avatarAlt, poster, posterAlt, traits } =
    profile;

  const nameId = `${id}-name`;

  return (
    <TiltCard
      ariaLabelledby={nameId}
      className="flex flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_24px_60px_-45px_oklch(0.79_0.15_207/0.45)]"
    >
      <div className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,260px)]">
        <div className="flex flex-col px-5 pt-[1.125rem] pb-2.5">
          <div className="relative z-10 -mt-16 size-20 overflow-hidden rounded-full border border-primary/40 bg-muted shadow-[0_0_30px_-9px_var(--primary)] sm:mt-0 2xl:size-24">
            <Image src={avatar} alt={avatarAlt} fill sizes="96px" className="object-cover" />
          </div>
          <h3
            id={nameId}
            className="mt-6 text-2xl leading-none font-semibold tracking-[-0.035em] 2xl:text-3xl"
          >
            {name}
          </h3>
          <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">
            {role}
          </p>
          <div className="my-6 h-px bg-linear-to-r from-primary/55 to-transparent" />
          <p className="text-base leading-6 font-semibold uppercase tracking-[0.06em] text-primary 2xl:text-lg 2xl:leading-7">
            {statement}
          </p>
          <p className="mt-5 text-[0.95rem] leading-7 text-muted-foreground">{biography}</p>
        </div>

        <figure className="relative order-first aspect-[4/5] w-full overflow-hidden sm:order-none sm:max-w-[260px] sm:justify-self-end sm:self-start sm:rounded-bl-[1.75rem]">
          <Image
            src={poster}
            alt={posterAlt}
            fill
            sizes="(min-width: 640px) 260px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,oklch(0.075_0.025_275/0.64),transparent_45%)]" />
        </figure>
      </div>

      <dl aria-label={`${name} traits`} className="grid sm:grid-cols-3">
        {traits.map(({ icon: Icon, label, detail }) => (
          <div key={label} className="flex items-center gap-3 px-5 py-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/8 text-primary">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <dt className="text-sm font-semibold">{label}</dt>
              <dd className="text-xs leading-5 text-muted-foreground">{detail}</dd>
            </div>
          </div>
        ))}
      </dl>
    </TiltCard>
  );
}
