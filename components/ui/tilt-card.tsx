"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { type ReactNode, type PointerEvent as ReactPointerEvent, useRef } from "react";
import { cn } from "@/lib/utils";

const spring = { damping: 22, mass: 0.7, stiffness: 180 };
const maxTilt = 5;

interface TiltCardProps {
  ariaLabelledby: string;
  children: ReactNode;
  className?: string;
}

export function TiltCard({ ariaLabelledby, children, className }: TiltCardProps) {
  const boundsRef = useRef<DOMRect | null>(null);
  const reducedMotion = useReducedMotion();
  const rotateXSource = useMotionValue(0);
  const rotateYSource = useMotionValue(0);
  const rotateX = useSpring(rotateXSource, spring);
  const rotateY = useSpring(rotateYSource, spring);

  const resetTilt = () => {
    boundsRef.current = null;
    rotateXSource.set(0);
    rotateYSource.set(0);
  };

  const handlePointerEnter = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || reducedMotion) return;

    boundsRef.current = event.currentTarget.getBoundingClientRect();
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || reducedMotion) return;

    const bounds = boundsRef.current ?? event.currentTarget.getBoundingClientRect();
    const horizontalPosition = (event.clientX - bounds.left) / bounds.width;
    const verticalPosition = (event.clientY - bounds.top) / bounds.height;

    rotateXSource.set((0.5 - verticalPosition) * maxTilt * 2);
    rotateYSource.set((horizontalPosition - 0.5) * maxTilt * 2);
  };

  return (
    <motion.article
      aria-labelledby={ariaLabelledby}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      style={{
        rotateX: reducedMotion ? 0 : rotateX,
        rotateY: reducedMotion ? 0 : rotateY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className={cn("transform-gpu will-change-transform", className)}
    >
      {children}
    </motion.article>
  );
}
