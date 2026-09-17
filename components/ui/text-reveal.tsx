"use client";

import type { MotionValue } from "motion/react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

export interface TextRevealWordContext {
  index: number;
  lineIndex: number;
  word: string;
}

export interface TextRevealProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  children: string;
  as?: ElementType;
  progress?: MotionValue<number>;
  decorationProgress?: MotionValue<number>;
  initiallyVisibleWords?: number;
  revealDuration?: number;
  stickyClassName?: string;
  textClassName?: string;
  getWordClassName?: (context: TextRevealWordContext) => string | undefined;
  getRevealedClassName?: (context: TextRevealWordContext) => string | undefined;
}

interface WordProps {
  children: ReactNode;
  className?: string;
  decorationProgress?: MotionValue<number>;
  progress: MotionValue<number>;
  range: [number, number];
  reducedMotion: boolean;
  revealedClassName?: string;
  visible: boolean;
}

function Word({
  children,
  className,
  decorationProgress,
  progress,
  range,
  reducedMotion,
  revealedClassName,
  visible,
}: WordProps) {
  const opacity = useTransform(progress, range, [0, 1]);
  const revealedOpacity = visible || reducedMotion ? 1 : opacity;
  const decorationOpacity = reducedMotion
    ? 1
    : (decorationProgress ?? revealedOpacity);

  return (
    <span className={cn("relative isolate mr-[0.18em] inline-flex", className)}>
      {revealedClassName ? (
        <motion.span
          aria-hidden="true"
          style={{ opacity: decorationOpacity }}
          className={cn("absolute inset-0 -z-10", revealedClassName)}
        />
      ) : null}
      <span aria-hidden="true" className="absolute opacity-30">
        {children}
      </span>
      <motion.span style={{ opacity: revealedOpacity }} className="text-white">
        {children}
      </motion.span>
    </span>
  );
}

export function TextReveal({
  children,
  as: TextElement = "span",
  className,
  progress,
  decorationProgress,
  initiallyVisibleWords = 0,
  revealDuration,
  stickyClassName,
  textClassName,
  getWordClassName,
  getRevealedClassName,
  ...props
}: TextRevealProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef });
  const revealProgress = progress ?? scrollYProgress;

  let wordIndex = 0;
  const lines = children.split("\n").map((line, lineIndex) =>
    line
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((word) => {
        const indexedWord = { index: wordIndex, lineIndex, word };
        wordIndex += 1;

        return indexedWord;
      }),
  );
  const wordCount = wordIndex;
  const animatedWordCount = Math.max(wordCount - initiallyVisibleWords, 1);
  const wordRevealDuration = Math.min(
    revealDuration ?? 1 / animatedWordCount,
    1,
  );
  const revealStartRange = 1 - wordRevealDuration;

  return (
    <div
      ref={sectionRef}
      className={cn("relative z-0 h-[200vh]", className)}
      {...props}
    >
      <div
        className={cn(
          "sticky top-0 mx-auto flex h-[50%] max-w-4xl items-center bg-transparent px-4 py-20",
          stickyClassName,
        )}
      >
        <TextElement
          className={cn(
            "flex flex-wrap p-5 text-2xl font-bold text-white/20 md:p-8 md:text-3xl lg:p-10 lg:text-4xl xl:text-5xl",
            textClassName,
          )}
        >
          {lines.map((line, lineIndex) => (
            <span
              key={`${lineIndex}-${line[0]?.word ?? "empty"}`}
              className="flex basis-full flex-wrap"
            >
              {line.map(({ index, word }) => {
                const visible = index < initiallyVisibleWords;
                const animatedIndex = Math.max(
                  index - initiallyVisibleWords,
                  0,
                );
                const start =
                  animatedWordCount === 1
                    ? 0
                    : (animatedIndex / (animatedWordCount - 1)) *
                      revealStartRange;
                const end = start + wordRevealDuration;
                const wordContext = { index, lineIndex, word };

                return (
                  <Word
                    key={`${index}-${word}`}
                    decorationProgress={decorationProgress}
                    progress={revealProgress}
                    range={[start, end]}
                    reducedMotion={Boolean(reducedMotion)}
                    visible={visible}
                    className={getWordClassName?.(wordContext)}
                    revealedClassName={getRevealedClassName?.(wordContext)}
                  >
                    {word}
                  </Word>
                );
              })}
            </span>
          ))}
        </TextElement>
      </div>
    </div>
  );
}
