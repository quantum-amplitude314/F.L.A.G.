import { Caveat } from "next/font/google";
import { CharacterDossier } from "@/components/character-dossier";
import { JoinFlagDialog } from "@/components/join-flag-dialog";
import { foundationProfiles } from "@/lib/foundation-profiles";

const caveat = Caveat({ subsets: ["latin"], weight: "400" });

export function Foundation() {
  return (
    <section
      id="foundation"
      aria-labelledby="foundation-title"
      className="relative scroll-mt-20 overflow-hidden border-t border-border"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,oklch(0.57_0.22_22/0.09),transparent_30rem),radial-gradient(circle_at_12%_58%,oklch(0.62_0.24_330/0.11),transparent_32rem),radial-gradient(circle_at_88%_68%,oklch(0.75_0.15_210/0.09),transparent_30rem)]" />
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(oklch(0.79_0.15_207)_1px,transparent_1px),linear-gradient(90deg,oklch(0.79_0.15_207)_1px,transparent_1px)] [background-size:4rem_4rem]" />

      <div className="relative mx-auto max-w-[120rem] px-6 py-24 sm:py-28 lg:px-10 lg:py-32 2xl:px-16">
        <header className="mx-auto max-w-6xl text-center">
          <h2
            id="foundation-title"
            className="text-balance text-[clamp(3.5rem,8.5vw,8.5rem)] leading-[0.82] font-semibold tracking-[-0.075em] uppercase"
          >
            <span className="block">Meet the</span>
            Foundation.
          </h2>
          <blockquote
            className={`${caveat.className} mx-auto mt-8 w-fit text-3xl leading-none text-muted-foreground sm:mr-12 sm:ml-auto sm:text-4xl`}
          >
            “One man can make a difference.”
          </blockquote>
        </header>

        <div className="mx-auto mt-16 grid max-w-[96rem] gap-8 xl:grid-cols-2 2xl:gap-10">
          {foundationProfiles.map((profile) => {
            const { id } = profile;

            return <CharacterDossier key={id} profile={profile} />;
          })}
        </div>

        <div className="mt-16 flex justify-center 2xl:mt-20">
          <JoinFlagDialog />
        </div>
      </div>
    </section>
  );
}
