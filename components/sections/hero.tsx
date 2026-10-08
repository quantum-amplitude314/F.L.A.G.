"use client";

import { ArrowDown } from "lucide-react";
import { useReducedMotion, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";
import { MissionConsole } from "@/components/mission-console";
import { Button } from "@/components/ui/button";
import { RetroGrid } from "@/components/ui/retro-grid";

const highlightClassName = "inline-block rounded-[0.08em] px-[0.04em]";
const magentaHighlightClassName =
  "bg-[linear-gradient(90deg,oklch(0.58_0.24_330/0.4),oklch(0.68_0.2_300/0.1))]";
const cyanHighlightClassName =
  "bg-[linear-gradient(90deg,oklch(0.72_0.16_207/0.4),oklch(0.65_0.19_245/0.1))]";

export function Hero() {
  const sceneRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-5%", "16%"]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], ["7%", "-18%"]);
  const foregroundScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.1]);

  return (
    <>
      <section id="hero" ref={sceneRef} className="relative scroll-mt-20 border-b border-border">
        <div className="relative flex min-h-[max(46rem,100svh)] items-center overflow-hidden">
          <m.div className="absolute -inset-[8%]" style={{ y: reducedMotion ? 0 : backgroundY }}>
            <img
              src="/hero.avif"
              srcSet="/hero-sm.avif 1280w, /hero.avif 2560w"
              sizes="116vw"
              alt="K.I.T.T. driving away down a desert highway into a neon dusk"
              fetchPriority="high"
              className="absolute inset-0 size-full object-cover object-[58%_center]"
            />
          </m.div>

          <m.div
            aria-hidden
            className="absolute -inset-[10%] mix-blend-screen"
            style={{
              y: reducedMotion ? 0 : foregroundY,
              scale: reducedMotion ? 1 : foregroundScale,
              backgroundImage:
                "radial-gradient(circle at 78% 64%, oklch(0.76 0.17 207 / 0.22), transparent 19rem), radial-gradient(circle at 18% 82%, oklch(0.58 0.24 330 / 0.16), transparent 25rem), linear-gradient(112deg, transparent 35%, oklch(0.63 0.18 288 / 0.08) 58%, transparent 74%)",
            }}
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.055_0.02_275/0.97)_0%,oklch(0.06_0.02_275/0.88)_28%,oklch(0.06_0.02_275/0.42)_58%,oklch(0.06_0.02_275/0.16)_100%),linear-gradient(0deg,oklch(0.055_0.02_275/0.78),transparent_55%)]" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-background to-transparent" />

          <div className="relative z-10 w-full px-[clamp(1.5rem,5vw,8rem)] py-32">
            <div className="max-w-[76rem]">
              <p className="text-base font-semibold uppercase tracking-[0.22em] text-primary sm:text-lg">
                Knight Rider
              </p>
              <h1 className="mt-6 text-[clamp(2.5rem,10.45vw,3.35rem)] leading-[0.92] font-semibold text-white sm:text-[clamp(3.35rem,5.5vw,5.75rem)] lg:tracking-[-0.15rem]">
                A{" "}
                <span className={`${highlightClassName} ${magentaHighlightClassName}`}>
                  shadowy&nbsp;flight
                </span>{" "}
                into the
                <br />
                dangerous world of a man
                <br />
                <span
                  className={`${highlightClassName} ${cyanHighlightClassName} text-[0.75em] lg:text-[1em]`}
                >
                  who&nbsp;does&nbsp;not&nbsp;exist
                </span>
              </h1>
              <Button
                size="lg"
                className="mt-10 h-12 rounded-full px-6 font-mono uppercase tracking-[0.14em] shadow-[0_0_30px_-10px_var(--primary)]"
                nativeButton={false}
                render={
                  <a href="#mission-console">
                    Enter Mission Console
                    <ArrowDown />
                  </a>
                }
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-20 sm:py-28">
        <RetroGrid
          className="absolute inset-0"
          angle={70}
          opacity={0.14}
          lightLineColor="oklch(0.75 0.15 210 / 0.4)"
          darkLineColor="oklch(0.75 0.15 210 / 0.4)"
        />
        <div className="relative mx-auto max-w-7xl">
          <MissionConsole />
        </div>
      </section>
    </>
  );
}
