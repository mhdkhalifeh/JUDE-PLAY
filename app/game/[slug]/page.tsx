"use client";

import { use, useEffect, useState } from "react";
import { games as defaultGames } from "@/app/data/games";

export default function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [game, setGame] = useState<any>(null);

  useEffect(() => {
    const savedGames = localStorage.getItem("jude_games");
    const allGames = savedGames ? JSON.parse(savedGames) : defaultGames;

    const foundGame = allGames.find((g: any) => g.slug === slug);
    setGame(foundGame || null);
  }, [slug]);

  if (!game) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Game not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070914] text-white p-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-5xl font-black">{game.title}</h1>
          <p className="mt-3 text-slate-400">{game.meta}</p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
          <div className="relative h-[80vh] min-h-[650px] overflow-hidden bg-black">
  {game.gameUrl ? (
    <iframe
      src={game.gameUrl}
      className="absolute inset-0 h-full w-full border-0 bg-black"
      allowFullScreen
    />
  ) : (
    <>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${game.image})` }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex h-full items-center justify-center text-center">
        <button className="rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-10 py-5 text-xl font-black">
          ▶ Play Game
        </button>
      </div>
    </>
  )}
</div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-black/30 p-6">
            <div>
              <h2 className="text-2xl font-black">{game.title}</h2>
              <p className="mt-2 text-slate-400">{game.description}</p>
            </div>

            <div className="flex gap-3">
              <button className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 hover:bg-white/10">
                Fullscreen
              </button>
              <button className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 hover:bg-white/10">
                Favorite
              </button>
              <button className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 hover:bg-white/10">
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950 p-6">
          <h2 className="text-2xl font-black">About This Game</h2>
          <p className="mt-4 leading-7 text-slate-300">{game.description}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-sm text-slate-400">Plays</p>
              <p className="mt-2 text-3xl font-black">{game.plays}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-sm text-slate-400">Rating</p>
              <p className="mt-2 text-3xl font-black">{game.rating}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-sm text-slate-400">Status</p>
              <p className="mt-2 text-3xl font-black">{game.status}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}