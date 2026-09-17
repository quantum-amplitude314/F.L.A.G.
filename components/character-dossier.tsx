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
  const {
    id,
    name,
    role,
    statement,
    biography,
    avatar,
    avatarAlt,
    poster,
    posterAlt,
    traits,
  } = profile;

  const nameId = `${id}-name`;

  return (
    <TiltCard
      ariaLabelledby={nameId}
      className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card/45 shadow-[0_32px_90px_-55px_rgba(232,121,249,0.75)]"
    >
      <div className="grid grow sm:grid-cols-[minmax(0,1fr)_minmax(0,260px)]">
        <div className="flex flex-col p-6 md:p-7 2xl:p-8">
          <div className="relative size-20 overflow-hidden rounded-full border border-primary/40 bg-muted shadow-[0_0_30px_-9px_var(--primary)] 2xl:size-24">
            <Image
              src={avatar}
              alt={avatarAlt}
              fill
              sizes="96px"
              className="object-cover"
            />
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
          <p className="mt-5 text-[0.95rem] leading-7 text-muted-foreground">
            {biography}
          </p>
        </div>

        <figure className="relative min-h-80 w-full max-w-[260px] justify-self-end overflow-hidden border-t border-border sm:aspect-[4/5] sm:min-h-0 sm:self-start sm:border-t-0 sm:border-b sm:border-l">
          <Image
            src={poster}
            alt={posterAlt}
            fill
            sizes="260px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,oklch(0.075_0.025_275/0.64),transparent_45%)]" />
        </figure>
      </div>

      <dl aria-label={`${name} traits`} className="grid sm:grid-cols-3">
        {traits.map(({ icon: Icon, label, detail }) => (
          <div
            key={label}
            className="border-t border-border p-5 sm:not-last:border-r"
          >
            <dt className="flex items-center gap-3 text-sm font-semibold">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/8 text-primary">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              {label}
            </dt>
            <dd className="mt-1 ml-12 text-xs leading-5 text-muted-foreground">
              {detail}
            </dd>
          </div>
        ))}
      </dl>
    </TiltCard>
  );
}
