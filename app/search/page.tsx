"use client";

import { useState } from "react";
import Link from "next/link";
import { games } from "@/app/data/games";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const filteredGames = games.filter((game) =>
    `${game.title} ${game.category} ${game.meta} ${game.description}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070914] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black">Search Games</h1>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for games..."
          className="mt-8 w-full rounded-2xl border border-white/10 bg-slate-950 px-6 py-4 text-lg outline-none focus:border-fuchsia-500"
        />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {filteredGames.map((game) => (
            <Link key={game.slug} href={`/game/${game.slug}`}>
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl transition hover:-translate-y-2">
                <img
                loading="lazy"
                  src={game.image}
                  alt={game.title}
                  className="h-56 w-full object-cover"
                />

                <div className="p-6">
                  <h3 className="text-2xl font-black">{game.title}</h3>
                  <p className="mt-3 text-sm text-slate-400">{game.meta}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-slate-950 p-8 text-slate-400">
            No games found.
          </div>
        )}
      </div>
    </div>
  );
}