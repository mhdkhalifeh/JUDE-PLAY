"use client";

import { useRef } from "react";

export default function GameFrame({
  gameUrl,
  title,
}: {
  gameUrl: string;
  title: string;
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

  return (
    <div>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl shadow-fuchsia-500/10">
        <iframe
          ref={iframeRef}
          src={gameUrl}
          title={title}
          className="h-[70vh] w-full border-0 md:h-[80vh]"
          allowFullScreen
          allow="fullscreen; gamepad; autoplay"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
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