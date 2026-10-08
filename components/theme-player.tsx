"use client";

import { Play } from "lucide-react";
import { type RefObject, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const videoId = "lxhWxv_5bQ0";
const iframeApiUrl = "https://www.youtube.com/iframe_api";
const embedUrl =
  `https://www.youtube-nocookie.com/embed/${videoId}` +
  `?enablejsapi=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`;
const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

export type YouTubePlayer = {
  destroy: () => void;
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (volume: number) => void;
};

type YouTubePlayerEvent = {
  target: YouTubePlayer;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLIFrameElement,
        options: {
          events: {
            onReady: (event: YouTubePlayerEvent) => void;
          };
        },
      ) => YouTubePlayer;
    };
    onYouTubeIframeAPIReady?: (() => void) | undefined;
  }
}

export function ThemePlayer({
  playerRef,
  active,
  playWhenReadyRef,
  volumeRef,
  onPlay,
}: {
  playerRef: RefObject<YouTubePlayer | null>;
  active: boolean;
  playWhenReadyRef: RefObject<boolean>;
  volumeRef: RefObject<number>;
  onPlay: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!active) return;
    let mounted = true;

    function initializePlayer() {
      if (!mounted || !iframeRef.current || !window.YT?.Player) return;

      // Looping is handled by loop=1&playlist= in the embed URL.
      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: ({ target }) => {
            if (!mounted) return;
            target.setVolume(volumeRef.current);
            if (playWhenReadyRef.current) target.playVideo();
          },
        },
      });
    }

    const previousReadyHandler = window.onYouTubeIframeAPIReady;
    const apiReadyHandler = () => {
      previousReadyHandler?.();
      initializePlayer();
    };

    if (window.YT?.Player) {
      initializePlayer();
    } else {
      window.onYouTubeIframeAPIReady = apiReadyHandler;

      if (!document.querySelector(`script[src="${iframeApiUrl}"]`)) {
        const script = document.createElement("script");
        script.src = iframeApiUrl;
        script.async = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      mounted = false;
      playerRef.current?.destroy();
      playerRef.current = null;

      if (window.onYouTubeIframeAPIReady === apiReadyHandler) {
        window.onYouTubeIframeAPIReady = previousReadyHandler;
      }
    };
  }, [playerRef, active, playWhenReadyRef, volumeRef]);

  return (
    <section className="flex items-center justify-center border-t border-border p-2 min-[900px]:mt-auto min-[900px]:block">
      <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-black shadow-[0_20px_65px_-28px_rgba(34,211,238,0.8)] min-[900px]:mx-auto min-[900px]:mt-2 min-[900px]:w-40 xl:w-[12.5rem]">
        {active ? (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title="Knight Rider theme song"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="block size-full border-0"
          />
        ) : (
          <>
            <img
              src={thumbnailUrl}
              alt="Knight Rider soundtrack cover"
              width={480}
              height={360}
              loading="lazy"
              decoding="async"
              className="block size-full scale-[1.3334] object-cover"
            />
            <Button
              variant="outline"
              size="icon-lg"
              onClick={onPlay}
              aria-label="Play the Knight Rider theme song"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-white/20 bg-black/40 text-white backdrop-blur hover:bg-black/70"
            >
              <Play />
            </Button>
            <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 to-transparent px-2 pt-6 pb-2 text-center text-[0.625rem] font-semibold tracking-[0.14em] text-foreground uppercase min-[900px]:text-xs">
              Original theme
            </span>
          </>
        )}
      </div>
    </section>
  );
}
