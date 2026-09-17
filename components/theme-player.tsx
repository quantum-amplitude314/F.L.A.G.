"use client";

import { type RefObject, useEffect, useRef } from "react";

const videoId = "lxhWxv_5bQ0";
const iframeApiUrl = "https://www.youtube.com/iframe_api";
const embedUrl =
  `https://www.youtube-nocookie.com/embed/${videoId}` +
  `?enablejsapi=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`;

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
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function ThemePlayer({
  playerRef,
}: {
  playerRef: RefObject<YouTubePlayer | null>;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let mounted = true;

    function initializePlayer() {
      if (!mounted || !iframeRef.current || !window.YT?.Player) return;

      // Looping is handled by loop=1&playlist= in the embed URL.
      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: ({ target }) => {
            if (mounted) target.setVolume(60);
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
  }, [playerRef]);

  return (
    <section className="p-4 sm:p-5">
      <p className="text-center text-sm font-semibold text-foreground uppercase tracking-[0.14em]">
        Original theme
      </p>

      <div className="relative mx-auto mt-4 aspect-square w-40 max-w-full overflow-hidden rounded-xl border border-border bg-black shadow-[0_20px_65px_-28px_rgba(34,211,238,0.8)] xl:w-[12.5rem]">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title="Knight Rider theme song"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="block size-full border-0"
        />
      </div>
    </section>
  );
}
