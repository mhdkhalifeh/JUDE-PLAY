
"use client";

import { useRef, useState } from "react";

type GameType = "local" | "iframe" | "external";

type Props = {
  gameId: string;
  gameUrl: string;
  title: string;
  gameType?: GameType;
};

export default function GameFrame({
  gameId,
  gameUrl,
  title,
  gameType = "local",
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasStartedRef = useRef(false);

  const [started, setStarted] = useState(false);

  async function recordPlay() {
    try {
      const response = await fetch("/api/record-play", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId }),
        keepalive: true,
      });

      if (!response.ok) {
        console.error(
          "Unable to record game play:",
          response.status
        );
      }
    } catch (error) {
      console.error("Play tracking failed:", error);
    }
  }

  function startGame() {
    if (hasStartedRef.current) return;

    hasStartedRef.current = true;
    setStarted(true);

    // Game starts even if tracking is unavailable.
    void recordPlay();
  }

  async function enterFullscreen() {
    if (!iframeRef.current) return;

    try {
      await iframeRef.current.requestFullscreen();
    } catch (error) {
      console.error("Fullscreen unavailable:", error);
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
          onClick={startGame}
          className="mt-6 inline-block rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 font-bold text-white"
        >
          ▶ Play Now
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl shadow-fuchsia-500/10">
        {started ? (
          <iframe
            ref={iframeRef}
            src={gameUrl}
            title={title}
            className="h-[70vh] w-full border-0 md:h-[85vh]"
            allowFullScreen
            allow="fullscreen; gamepad; autoplay; clipboard-read; clipboard-write; xr-spatial-tracking; accelerometer; gyroscope"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-downloads"
          />
        ) : (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-6 bg-gradient-to-br from-[#080d23] via-[#120d2a] to-[#080d23] px-6 text-center md:h-[75vh]">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 text-5xl shadow-[0_0_60px_rgba(217,70,239,.2)]">
              🎮
            </div>

            <div>
              <h2 className="text-3xl font-black md:text-4xl">
                {title}
              </h2>

              <p className="mt-3 text-sm text-slate-400">
                Ready to play? Start your game!
              </p>
            </div>

            <button
              type="button"
              onClick={startGame}
              className="rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-500 px-12 py-5 text-lg font-black text-white shadow-[0_15px_45px_rgba(168,85,247,.3)] transition hover:scale-105"
            >
              ▶ PLAY GAME
            </button>
          </div>
        )}
      </div>

      {started && (
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
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
      )}
    </div>
  );
}
