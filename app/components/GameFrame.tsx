"use client";

import { useRef } from "react";

export default function GameFrame({
  gameUrl,
  title,
  gameType = "local",
}: {
  gameUrl: string;
  title: string;
  gameType?: "local" | "iframe" | "external";
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  async function enterFullscreen() {
    if (!iframeRef.current) return;

    if (iframeRef.current.requestFullscreen) {
      await iframeRef.current.requestFullscreen();
    }
  }

  if (!gameUrl) {
    return (
      <div className="flex h-[60vh] items-center justify-center rounded-3xl border border-white/10 bg-slate-950 text-slate-400">
        No game URL added yet.
      </div>
    );
  }

  if (gameType === "external") {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-950 p-8 text-center">
        <h2 className="text-3xl font-black">{title}</h2>
        <p className="mt-3 text-slate-400">
          This game opens in a new tab.
        </p>

        <a
          href={gameUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 font-bold"
        >
          Play Now
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl shadow-fuchsia-500/10">
        <iframe
          ref={iframeRef}
          src={gameUrl}
          title={title}
          className="h-[70vh] w-full border-0 md:h-[85vh]"
          allowFullScreen
          allow="fullscreen; gamepad; autoplay; clipboard-read; clipboard-write; xr-spatial-tracking; accelerometer; gyroscope"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-downloads"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={enterFullscreen}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-3 font-bold transition hover:scale-105"
        >
          🎮 Fullscreen
        </button>

        <a
          href={gameUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold transition hover:bg-white/10"
        >
          Open New Tab
        </a>
      </div>
    </div>
  );
}