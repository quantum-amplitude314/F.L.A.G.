"use client";

import { Radio } from "lucide-react";
import { lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { joinFlagCopy } from "@/lib/join-flag-copy";

const { trigger, title, description } = joinFlagCopy;

const loadJoinFlagForm = () => import("@/components/join-flag-form");

const JoinFlagForm = lazy(() =>
  loadJoinFlagForm().then(({ JoinFlagForm: form }) => ({ default: form })),
);

export function JoinFlagDialog() {
  return (
    <Dialog>
      <DialogTrigger
        onPointerEnter={loadJoinFlagForm}
        onFocus={loadJoinFlagForm}
        render={
          <Button
            size="lg"
            className="h-14 rounded-full px-8 font-mono text-base uppercase tracking-[0.14em] shadow-[0_0_30px_-10px_var(--primary)] [&_svg:not([class*='size-'])]:size-5"
          />
        }
      >
        <Radio />
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100svh-2rem)] gap-7 overflow-y-auto p-6 sm:max-w-[46rem] sm:p-10">
        <DialogHeader className="gap-3">
          <DialogTitle className="text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
            {title}
          </DialogTitle>
          <DialogDescription className="text-base leading-7">{description}</DialogDescription>
        </DialogHeader>
        <Suspense>
          <JoinFlagForm />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
