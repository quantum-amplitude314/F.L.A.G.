"use client";

import { Radio, Send } from "lucide-react";
import Script from "next/script";
import { useActionState, useCallback, useId, useState } from "react";
import { submitJoinFlag } from "@/app/actions/join-flag";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  turnstileScriptUrl,
  turnstileSiteKey,
  useTurnstile,
} from "@/hooks/use-turnstile";
import {
  initialJoinFlagState,
  type JoinFlagField,
  type JoinFlagState,
} from "@/lib/join-flag";
import { joinFlagCopy } from "@/lib/join-flag-copy";

const {
  fields,
  trigger,
  title,
  description,
  submit,
  submitting,
  failed,
  sent,
} = joinFlagCopy;

const readValues = (state: JoinFlagState) =>
  "values" in state ? state.values : undefined;

const readErrors = (state: JoinFlagState) =>
  state.status === "invalid" ? state.errors : undefined;

const JoinFlagFormField = ({
  field,
  state,
  multiline = false,
}: {
  field: JoinFlagField;
  state: JoinFlagState;
  multiline?: boolean;
}) => {
  const id = useId();
  const errorId = `${id}-error`;
  const error = readErrors(state)?.[field];
  const defaultValue = readValues(state)?.[field];
  const control = multiline ? (
    <Textarea
      id={id}
      name={field}
      rows={7}
      className="max-h-[32vh] min-h-44 text-base"
      defaultValue={defaultValue}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
    />
  ) : (
    <Input
      id={id}
      name={field}
      type={field === "email" ? "email" : "text"}
      autoComplete={field}
      className="h-13 px-4 text-base"
      defaultValue={defaultValue}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
    />
  );

  return (
    <div className="grid gap-2">
      <Label
        htmlFor={id}
        className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground"
      >
        {fields[field].label}
      </Label>
      {control}
      {error ? (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
};

const JoinFlagForm = () => {
  // Turnstile hands the token to a callback; only its presence matters here (Transmit button).
  const [hasToken, setHasToken] = useState(false);
  const onToken = useCallback(() => setHasToken(true), []);
  const onExpire = useCallback(() => setHasToken(false), []);
  const {
    containerRef: challengeRef,
    mount: mountChallenge,
    reset: resetChallenge,
  } = useTurnstile({ onToken, onExpire });
  const [state, formAction, pending] = useActionState(
    async (previous: JoinFlagState, formData: FormData) => {
      const next = await submitJoinFlag(previous, formData);
      // A token is single-use: after a failed attempt the visitor must pass the challenge again.
      if (next.status === "failed" || readErrors(next)?.verification) {
        resetChallenge();
      }

      return next;
    },
    initialJoinFlagState,
  );

  if (state.status === "sent") {
    return (
      <p className="rounded-xl border border-primary/30 bg-primary/10 p-5 text-base leading-7">
        {sent(state.name)}
      </p>
    );
  }

  const values = readValues(state);
  const formKey = values ? Object.values(values).join("\u0000") : "";
  const verificationError = readErrors(state)?.verification;

  return (
    <form key={formKey} action={formAction} noValidate className="grid gap-6">
      <JoinFlagFormField field="name" state={state} />
      <JoinFlagFormField field="email" state={state} />
      <JoinFlagFormField field="message" state={state} multiline />
      {turnstileSiteKey ? (
        <div className="grid gap-2">
          <div ref={challengeRef} className="min-h-16" />
          <Script src={turnstileScriptUrl} onReady={mountChallenge} />
          {verificationError ? (
            <p role="alert" className="text-xs text-destructive">
              {verificationError}
            </p>
          ) : null}
        </div>
      ) : null}
      {state.status === "failed" ? (
        <p role="alert" className="text-xs text-destructive">
          {failed}
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={pending || (turnstileSiteKey ? !hasToken : false)}
        className="h-13 rounded-full font-mono text-base uppercase tracking-[0.14em] shadow-[0_0_30px_-10px_var(--primary)]"
      >
        <Send />
        {pending ? submitting : submit}
      </Button>
    </form>
  );
};

export function JoinFlagDialog() {
  return (
    <Dialog>
      <DialogTrigger
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
          <DialogDescription className="text-base leading-7">
            {description}
          </DialogDescription>
        </DialogHeader>
        <JoinFlagForm />
      </DialogContent>
    </Dialog>
  );
}
