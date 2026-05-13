"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { games } from "@/app/data/games";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
const [allGames, setAllGames] = useState(games);
const [zipFile, setZipFile] = useState<File | null>(null);

useEffect(() => {
  const savedGames = localStorage.getItem("jude_games");
  if (savedGames) {
    setAllGames(JSON.parse(savedGames));
  }
}, []);
  const categories = [
    "All",
    ...Array.from(new Set(allGames.map((game) => game.category))),
  ];

  const filteredGames = allGames.filter((game) => {
    const matchesSearch = `${game.title} ${game.category} ${game.meta} ${game.description}`
      .toLowerCase()
      .includes(query.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || game.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#070914] text-white">
      <div className="relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1800&auto=format&fit=crop)",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-28">
          <p className="text-fuchsia-400 font-bold tracking-[0.3em] uppercase">
            JUDE PLAY
          </p>

          <h1 className="mt-6 text-6xl font-black leading-tight max-w-3xl">
            The Future Of Browser Gaming
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-slate-300 leading-8">
            Play the best online games instantly. No downloads, no limits,
            just pure gaming experience.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/game/shadow-strike">
              <button className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-4 text-lg font-black shadow-[0_0_30px_rgba(168,85,247,.35)]">
                ▶ Play Now
              </button>
            </Link>

            <a href="#games">
              <button className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-lg hover:bg-white/10">
                Browse Games
              </button>
            </a>
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for games..."
            className="mt-12 w-full max-w-2xl rounded-2xl border border-white/10 bg-black/50 px-6 py-4 text-lg outline-none backdrop-blur focus:border-fuchsia-500"
          />
        </div>
      </div>

      <div id="games" className="max-w-7xl mx-auto px-8 py-16">
        <div className="mb-8">
          <h2 className="text-4xl font-black">
            {query || selectedCategory !== "All"
              ? "Filtered Games"
              : "Trending Games"}
          </h2>

          <p className="mt-3 text-slate-400">
            {query
              ? `Showing results for "${query}"`
              : selectedCategory !== "All"
              ? `Showing ${selectedCategory} games`
              : "Discover the hottest games on JUDE Play"}
          </p>
        </div>

        <div className="mb-10 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-[0_0_24px_rgba(168,85,247,.35)]"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {filteredGames.map((game) => (
            <Link key={game.slug} href={`/game/${game.slug}`}>
              <div className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(124,58,237,.35)]">
                <div className="relative h-56 overflow-hidden">
                  {game.image ? (
  <img
    src={game.image}
    alt={game.title}
    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
  />
) : (
  <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-500">
    No Image
  </div>
)}

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  <div className="absolute top-4 right-4 rounded-full bg-black/60 px-4 py-2 text-sm font-bold text-fuchsia-300 backdrop-blur">
                    🔥 {game.plays}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-black">{game.title}</h3>

                  <p className="mt-3 text-sm text-slate-400">{game.meta}</p>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="rounded-full bg-violet-600/20 px-4 py-2 text-sm text-violet-300">
                      {game.category}
                    </span>

                    <span className="text-sm text-yellow-400">
                      ⭐ {game.rating}
                    </span>
                  </div>
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