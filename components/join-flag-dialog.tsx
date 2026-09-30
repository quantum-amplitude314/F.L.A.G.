"use client";

import { Radio, Send } from "lucide-react";
import Script from "next/script";
import {
  type FormEvent,
  useCallback,
  useId,
  useRef,
  useState,
  useTransition,
} from "react";
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
import { turnstileScriptUrl, useTurnstile } from "@/hooks/use-turnstile";
import {
  initialJoinFlagState,
  type JoinFlagField,
  type JoinFlagState,
  parseJoinFlag,
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

type FieldControl = HTMLInputElement | HTMLTextAreaElement;

type FieldControls = Record<JoinFlagField, FieldControl | null>;

const readErrors = (state: JoinFlagState) =>
  state.status === "invalid" ? state.errors : undefined;

function JoinFlagFormField({
  field,
  error,
  controls,
  onInput,
  multiline = false,
}: {
  field: JoinFlagField;
  error?: string;
  controls: React.RefObject<FieldControls>;
  onInput: () => void;
  multiline?: boolean;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const attach = (node: FieldControl | null) => {
    controls.current[field] = node;
  };
  const control = multiline ? (
    <Textarea
      ref={attach}
      id={id}
      name={field}
      rows={7}
      className="max-h-[32vh] min-h-44 text-base"
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      onInput={onInput}
    />
  ) : (
    <Input
      ref={attach}
      id={id}
      name={field}
      type={field === "email" ? "email" : "text"}
      autoComplete={field}
      className="h-13 px-4 text-base"
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      onInput={onInput}
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
}

function JoinFlagForm() {
  const controls = useRef<FieldControls>({
    name: null,
    email: null,
    message: null,
  });
  const [state, setState] = useState(initialJoinFlagState);
  const [pending, startTransition] = useTransition();
  // Turnstile hands the token to a callback; it gates the Transmit button and travels with the submit.
  const [token, setToken] = useState<string | null>(null);
  const onExpire = useCallback(() => setToken(null), []);
  const {
    containerRef: challengeRef,
    mount: mountChallenge,
    reset: resetChallenge,
  } = useTurnstile({ onToken: setToken, onExpire });
  const errors = readErrors(state);

  const clearError = (field: JoinFlagField) => {
    if (!errors?.[field]) return;
    const { [field]: _cleared, ...rest } = errors;
    setState({ status: "invalid", errors: rest });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { name, email, message } = controls.current;
    const values = {
      name: name?.value ?? "",
      email: email?.value ?? "",
      message: message?.value ?? "",
    };
    const parsed = parseJoinFlag(values);
    if (!parsed.success) {
      const [firstInvalid] = Object.keys(parsed.errors) as JoinFlagField[];
      setState({ status: "invalid", errors: parsed.errors });
      controls.current[firstInvalid]?.focus();

      return;
    }

    startTransition(async () => {
      const next = await submitJoinFlag({ values, token });
      // A token is single-use: after a consumed attempt the visitor must pass the challenge again.
      if (next.status === "failed" || readErrors(next)?.verification) {
        resetChallenge();
      }
      setState(next);
    });
  };

  if (state.status === "sent") {
    return (
      <p className="rounded-xl border border-primary/30 bg-primary/10 p-5 text-base leading-7">
        {sent(state.name)}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-6">
      <JoinFlagFormField
        field="name"
        controls={controls}
        error={errors?.name}
        onInput={() => clearError("name")}
      />
      <JoinFlagFormField
        field="email"
        controls={controls}
        error={errors?.email}
        onInput={() => clearError("email")}
      />
      <JoinFlagFormField
        field="message"
        controls={controls}
        error={errors?.message}
        onInput={() => clearError("message")}
        multiline
      />
      <div className="grid gap-2">
        <div ref={challengeRef} className="min-h-16" />
        <Script src={turnstileScriptUrl} onReady={mountChallenge} />
        {errors?.verification ? (
          <p role="alert" className="text-xs text-destructive">
            {errors.verification}
          </p>
        ) : null}
      </div>
      {state.status === "failed" ? (
        <p role="alert" className="text-xs text-destructive">
          {failed}
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={pending || !token}
        className="h-13 rounded-full font-mono text-base uppercase tracking-[0.14em] shadow-[0_0_30px_-10px_var(--primary)]"
      >
        <Send />
        {pending ? submitting : submit}
      </Button>
    </form>
  );
}

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
