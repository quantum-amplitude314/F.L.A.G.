"use client";

import { ChevronLeft, ChevronRight, Pause, Play, Volume2 } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ThemePlayer, type YouTubePlayer } from "@/components/theme-player";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const slides = [
  {
    src: "/console-driver.avif",
    srcSm: "/console-driver-sm.avif",
    width: 1152,
    alt: "A shadowy field operative running past a black car on a neon-lit street",
    title: "A man who does not exist",
    detail: "A new identity. A purpose that endures.",
  },
  {
    src: "/console-mechanic.avif",
    srcSm: "/console-mechanic-sm.avif",
    width: 1152,
    alt: "A mechanic silhouetted beside a black car with its hood open in a neon-lit garage",
    title: "The mind behind the machine",
    detail: "Keeping both partners alive in the field.",
  },
  {
    src: "/console-kitt.avif",
    srcSm: "/console-kitt-sm.avif",
    width: 1216,
    alt: "A black sports car in profile as a flat silhouette against horizontal magenta neon bands and two vertical cyan tubes",
    title: "Intelligence and force",
    detail: "The Knight Industries Two Thousand. Always listening.",
  },
  {
    src: "/console-devon.avif",
    srcSm: "/console-devon-sm.avif",
    width: 1216,
    alt: "A silhouetted man at a desk holding a corded telephone receiver, neon bands glowing behind him",
    title: "The voice of the Foundation",
    detail: "The conscience behind the mission.",
  },
] as const;

type Slide = (typeof slides)[number];

const controlButtonClassName =
  "rounded-full border-white/20 bg-black/40 text-white backdrop-blur hover:bg-black/70";

function SlideCaption({
  slide: { title, detail },
  className,
}: {
  slide: Slide;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-2 text-base text-white/65">{detail}</p>
    </div>
  );
}

function SlideControls({
  autoAdvance,
  volume,
  onToggle,
  onVolumeChange,
  onPrevious,
  onNext,
}: {
  autoAdvance: boolean;
  volume: number;
  onToggle?: (() => void) | undefined;
  onVolumeChange: (volume: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex shrink-0 gap-2">
      {onToggle ? (
        <div className="flex h-9 items-center gap-2 rounded-full border border-input bg-input/30 px-3 text-white backdrop-blur">
          <Volume2 aria-hidden="true" className="size-4 shrink-0" />
          <div className="w-20">
            <Slider
              value={[volume]}
              step={5}
              thumbLabel="Theme volume"
              onValueChange={(nextValue) => {
                const [nextVolume] = [nextValue].flat();
                if (nextVolume !== undefined) onVolumeChange(nextVolume);
              }}
            />
          </div>
        </div>
      ) : null}
      {onToggle ? (
        <Button
          variant="outline"
          size="icon-lg"
          onClick={onToggle}
          aria-label={autoAdvance ? "Pause slideshow" : "Play slideshow"}
          aria-pressed={autoAdvance}
          className={controlButtonClassName}
        >
          {autoAdvance ? <Pause /> : <Play />}
        </Button>
      ) : null}
      <Button
        variant="outline"
        size="icon-lg"
        onClick={onPrevious}
        aria-label="Previous mission slide"
        className={controlButtonClassName}
      >
        <ChevronLeft />
      </Button>
      <Button
        variant="outline"
        size="icon-lg"
        onClick={onNext}
        aria-label="Next mission slide"
        className={controlButtonClassName}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

export function MissionConsole() {
  const [index, setIndex] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [sequenceStarted, setSequenceStarted] = useState(false);
  const [playerRequested, setPlayerRequested] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const playWhenReadyRef = useRef(false);
  const [volume, setVolume] = useState(60);
  const volumeRef = useRef(volume);
  const activeSlide = slides[index] ?? slides[0];

  useEffect(() => {
    if (!autoAdvance) return;
    // Re-armed on every slide change so a manual pick gets the full dwell time.
    const timeoutId = window.setTimeout(() => setIndex((index + 1) % slides.length), 6500);
    return () => window.clearTimeout(timeoutId);
  }, [autoAdvance, index]);

  const select = (nextIndex: number) => {
    setIndex((nextIndex + slides.length) % slides.length);
  };

  const playTheme = () => {
    playWhenReadyRef.current = true;
    setPlayerRequested(true);
  };

  const startSequence = () => {
    playTheme();
    setSequenceStarted(true);
    setAutoAdvance(true);
    playerRef.current?.playVideo();
  };

  const changeVolume = (nextVolume: number) => {
    volumeRef.current = nextVolume;
    setVolume(nextVolume);
    playerRef.current?.setVolume(nextVolume);
  };

  const toggleSequence = () => {
    playWhenReadyRef.current = !autoAdvance;
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
              <m.div
                key={activeSlide.src}
                initial={{ opacity: 0, scale: 1.025, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.99, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={activeSlide.src}
                  srcSet={`${activeSlide.srcSm} 768w, ${activeSlide.src} ${activeSlide.width}w`}
                  sizes="(min-width: 1280px) 940px, (min-width: 900px) 70vw, 100vw"
                  loading="lazy"
                  alt={activeSlide.alt}
                  className="absolute inset-0 size-full object-cover"
                />
              </m.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(3,3,12,0.92),transparent_50%)]" />
            <AnimatePresence>
              {!sequenceStarted ? (
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.28 }}
                  className="absolute inset-x-0 top-0 z-10 flex justify-center p-5"
                >
                  <Button
                    size="lg"
                    onClick={startSequence}
                    className="h-12 rounded-full border border-primary/25 bg-primary/95 px-6 font-mono uppercase tracking-[0.14em] shadow-[0_0_30px_-10px_var(--primary)]"
                  >
                    <Play className="fill-current" />
                    Start pursuit sequence
                  </Button>
                </m.div>
              ) : null}
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 hidden items-end justify-between gap-5 p-8 min-[900px]:flex">
              <SlideCaption slide={activeSlide} className="max-w-xl" />
              <SlideControls
                autoAdvance={autoAdvance}
                volume={volume}
                onToggle={sequenceStarted ? toggleSequence : undefined}
                onVolumeChange={changeVolume}
                onPrevious={() => select(index - 1)}
                onNext={() => select(index + 1)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-border p-5 min-[900px]:hidden">
            <SlideCaption slide={activeSlide} />
            <SlideControls
              autoAdvance={autoAdvance}
              volume={volume}
              onToggle={sequenceStarted ? toggleSequence : undefined}
              onVolumeChange={changeVolume}
              onPrevious={() => select(index - 1)}
              onNext={() => select(index + 1)}
            />
          </div>
        </div>

        <aside className="flex min-w-0 flex-col bg-background/35">
          <nav
            aria-label="Mission Console scenes"
            className="hidden grid-cols-1 gap-px bg-border min-[900px]:grid"
          >
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => select(slideIndex)}
                aria-current={slideIndex === index ? "true" : undefined}
                className={cn(
                  "group flex min-w-0 items-center gap-3 bg-background/90 p-4 text-left outline-none transition-colors focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring",
                  slideIndex === index ? "bg-primary/10" : "hover:bg-muted/70",
                )}
              >
                <span className="relative block aspect-video w-20 shrink-0 overflow-hidden rounded-lg bg-black">
                  <Image
                    src={slide.src}
                    alt=""
                    fill
                    sizes="80px"
                    className={cn(
                      "object-cover transition duration-300",
                      slideIndex === index
                        ? "opacity-100"
                        : "opacity-55 grayscale group-hover:opacity-100 group-hover:grayscale-0",
                    )}
                  />
                </span>
                <span className="line-clamp-2 text-sm leading-5 font-medium">{slide.title}</span>
              </button>
            ))}
          </nav>

          <ThemePlayer
            playerRef={playerRef}
            active={playerRequested}
            playWhenReadyRef={playWhenReadyRef}
            volumeRef={volumeRef}
            onPlay={playTheme}
          />
        </aside>
      </div>
    </section>
  );
}
