"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ThemePlayer, type YouTubePlayer } from "@/components/theme-player";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    src: "/console-driver.avif",
    alt: "A shadowy field operative running past a black car on a neon-lit street",
    title: "A man who does not exist",
    detail: "A new identity. A purpose that endures.",
  },
  {
    src: "/console-mechanic.avif",
    alt: "A mechanic silhouetted beside a black car with its hood open in a neon-lit garage",
    title: "The mind behind the machine",
    detail: "Keeping both partners alive in the field.",
  },
  {
    src: "/console-kitt.avif",
    alt: "A black sports car in profile as a flat silhouette against horizontal magenta neon bands and two vertical cyan tubes",
    title: "Intelligence and force",
    detail: "The Knight Industries Two Thousand. Always listening.",
  },
  {
    src: "/console-devon.avif",
    alt: "A silhouetted man at a desk holding a corded telephone receiver, neon bands glowing behind him",
    title: "The voice of the Foundation",
    detail: "The conscience behind the mission.",
  },
] as const;

const controlButtonClassName =
  "rounded-full border-white/20 bg-black/40 text-white backdrop-blur hover:bg-black/70";

export function MissionConsole() {
  const [index, setIndex] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [sequenceStarted, setSequenceStarted] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const activeSlide = slides[index];

  useEffect(() => {
    if (!autoAdvance) return;
    // Re-armed on every slide change so a manual pick gets the full dwell time.
    const timeoutId = window.setTimeout(
      () => setIndex((index + 1) % slides.length),
      6500,
    );
    return () => window.clearTimeout(timeoutId);
  }, [autoAdvance, index]);

  const select = (nextIndex: number) => {
    setIndex((nextIndex + slides.length) % slides.length);
  };

  const startSequence = () => {
    setSequenceStarted(true);
    setAutoAdvance(true);
    playerRef.current?.playVideo();
  };

  const toggleSequence = () => {
    if (autoAdvance) {
      playerRef.current?.pauseVideo();
    } else {
      playerRef.current?.playVideo();
    }
    setAutoAdvance(!autoAdvance);
  };

  return (
    <section
      id="mission-console"
      aria-label="Mission console"
      className="relative scroll-mt-24 overflow-hidden rounded-[2rem] border border-border bg-card/65 text-left shadow-[0_40px_120px_-55px_rgba(34,211,238,0.42)] backdrop-blur-xl"
    >
      <BorderBeam
        size={180}
        duration={12}
        colorFrom="#22d3ee"
        colorTo="#e879f9"
        borderWidth={1.2}
      />

      <div className="relative z-10 grid min-[900px]:grid-cols-[minmax(0,1fr)_17rem] xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 min-[900px]:border-r min-[900px]:border-border">
          <div className="relative aspect-video overflow-hidden bg-black">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeSlide.src}
                initial={{ opacity: 0, scale: 1.025, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.99, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={activeSlide.src}
                  alt={activeSlide.alt}
                  fill
                  sizes="(min-width: 1280px) 940px, (min-width: 900px) 70vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(3,3,12,0.92),transparent_50%)]" />
            <AnimatePresence>
              {!sequenceStarted ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.28 }}
                  className="absolute inset-0 z-10 flex items-center justify-center p-5"
                >
                  <Button
                    size="lg"
                    onClick={startSequence}
                    className="h-12 rounded-full border border-primary/25 bg-primary/95 px-6 font-mono uppercase tracking-[0.14em] shadow-[0_0_30px_-10px_var(--primary)]"
                  >
                    <Play className="fill-current" />
                    Start pursuit sequence
                  </Button>
                </motion.div>
              ) : null}
            </AnimatePresence>
            <div
              hidden={!sequenceStarted}
              className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-5 sm:p-8"
            >
              <div className="max-w-xl">
                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                  {activeSlide.title}
                </h2>
                <p className="mt-2 hidden text-base text-white/65 sm:block">
                  {activeSlide.detail}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {sequenceStarted ? (
                  <Button
                    variant="outline"
                    size="icon-lg"
                    onClick={toggleSequence}
                    aria-label={
                      autoAdvance ? "Pause slideshow" : "Play slideshow"
                    }
                    aria-pressed={autoAdvance}
                    className={controlButtonClassName}
                  >
                    {autoAdvance ? <Pause /> : <Play />}
                  </Button>
                ) : null}
                <Button
                  variant="outline"
                  size="icon-lg"
                  onClick={() => select(index - 1)}
                  aria-label="Previous mission slide"
                  className={controlButtonClassName}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  size="icon-lg"
                  onClick={() => select(index + 1)}
                  aria-label="Next mission slide"
                  className={controlButtonClassName}
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <aside className="flex min-w-0 flex-col bg-background/35">
          <nav
            aria-label="Mission Console scenes"
            className="grid auto-cols-fr grid-flow-col gap-px bg-border min-[900px]:grid-flow-row min-[900px]:grid-cols-1"
          >
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => select(slideIndex)}
                aria-current={slideIndex === index ? "true" : undefined}
                className={cn(
                  "group flex min-w-0 flex-col gap-2 bg-background/90 p-3 text-left outline-none transition-colors focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring min-[900px]:flex-row min-[900px]:items-center min-[900px]:gap-3 min-[900px]:p-4",
                  slideIndex === index ? "bg-primary/10" : "hover:bg-muted/70",
                )}
              >
                <span className="relative block aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-black min-[900px]:w-20">
                  <Image
                    src={slide.src}
                    alt=""
                    fill
                    sizes={`(min-width: 900px) 80px, ${100 / slides.length}vw`}
                    className={cn(
                      "object-cover transition duration-300",
                      slideIndex === index
                        ? "opacity-100"
                        : "opacity-55 grayscale group-hover:opacity-100 group-hover:grayscale-0",
                    )}
                  />
                </span>
                <span className="line-clamp-2 text-sm leading-5 font-medium">
                  {slide.title}
                </span>
              </button>
            ))}
          </nav>

          <div className="border-t border-border min-[900px]:mt-auto">
            <ThemePlayer playerRef={playerRef} />
          </div>
        </aside>
      </div>
    </section>
  );
}
