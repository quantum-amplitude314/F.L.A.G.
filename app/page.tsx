import { Navigation } from "@/components/navigation";
import { Foundation } from "@/components/sections/foundation";
import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
    <>
      <Navigation />

      <main className="flex-1">
        <Hero />
        <Foundation />
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="font-mono text-sm uppercase tracking-[0.16em] text-muted-foreground">
            Knight Industries Two Thousand
          </div>
          <p className="text-sm text-muted-foreground">
            A fan-made concept page. Knight Rider and K.I.T.T. belong to their
            respective rights holders.
          </p>
        </div>
      </footer>
    </>
  );
}
