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

  return (
    <div>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl shadow-fuchsia-500/10">
        <iframe
          ref={iframeRef}
          src={gameUrl}
          title={title}
          className="h-[80vh] w-full border-0"
          allowFullScreen
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={enterFullscreen}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-3 font-bold transition hover:scale-105"
        >
          🎮 Fullscreen
        </button>
      </div>
    </div>
  );
}