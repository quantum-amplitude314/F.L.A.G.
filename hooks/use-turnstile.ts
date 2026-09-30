"use client";

import { useCallback, useRef } from "react";
import { publicEnv } from "@/lib/public-env";

/** Explicit-render API of https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit */
type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

type TurnstileRenderOptions = {
  sitekey: string;
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "flexible" | "compact";
  appearance?: "always" | "execute" | "interaction-only";
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export const turnstileScriptUrl =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

const { NEXT_PUBLIC_TURNSTILE_SITE_KEY: siteKey } = publicEnv;

export const useTurnstile = ({
  onToken,
  onExpire,
}: {
  onToken: (token: string) => void;
  onExpire: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>(null);

  const attachContainer = useCallback((node: HTMLDivElement) => {
    containerRef.current = node;

    return () => {
      const { current: widgetId } = widgetIdRef;
      if (widgetId) window.turnstile?.remove(widgetId);
      widgetIdRef.current = null;
      containerRef.current = null;
    };
  }, []);

  const mount = useCallback(() => {
    const container = containerRef.current;
    const turnstile = window.turnstile;
    if (!container || !turnstile || widgetIdRef.current) return;

    widgetIdRef.current = turnstile.render(container, {
      sitekey: siteKey,
      theme: "dark",
      size: "flexible",
      callback: onToken,
      "expired-callback": onExpire,
      "error-callback": onExpire,
    });
  }, [onToken, onExpire]);

  const reset = useCallback(() => {
    const { current: widgetId } = widgetIdRef;
    if (widgetId) window.turnstile?.reset(widgetId);
    onExpire();
  }, [onExpire]);

  return { containerRef: attachContainer, mount, reset };
};
