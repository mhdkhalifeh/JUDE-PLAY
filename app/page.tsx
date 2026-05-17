"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

async function getRecentlyPlayed() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: recent } = await supabase
    .from("recently_played")
    .select("game_slug")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(4);

  const slugs = recent?.map((item) => item.game_slug) || [];

  if (slugs.length === 0) return [];

  const { data: games } = await supabase
    .from("games")
    .select("*")
    .in("slug", slugs);

  return games || [];
}

export default function HomePage() {
  const [games, setGames] = useState<any[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGames() {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setGames(data);
      }

      const recentGames = await getRecentlyPlayed();
      setRecentlyPlayed(recentGames);

      setLoading(false);
    }

    loadGames();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(games.map((game) => game.category).filter(Boolean))),
  ];

  const filteredGames = games.filter((game) => {
    const text = `${game.title || ""} ${game.category || ""} ${
      game.meta || ""
    } ${game.description || ""}`;

    const matchesSearch = text.toLowerCase().includes(query.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || game.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const trendingGames = [...games]
    .sort((a, b) => (b.plays || 0) - (a.plays || 0))
    .slice(0, 4);

  const newGames = [...games]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 4);

  function GameCard({ game }: { game: any }) {
    return (
      <Link key={game.id} href={`/game/${game.slug}`}>
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

            <div className="absolute right-4 top-4 rounded-full bg-black/60 px-4 py-2 text-sm font-bold text-fuchsia-300 backdrop-blur">
              🔥 {game.plays || 0}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-2xl font-black">{game.title}</h3>

            <p className="mt-3 text-sm text-slate-400">
              {game.meta || game.description || ""}
            </p>

            <div className="mt-6 flex items-center justify-between">
              <span className="rounded-full bg-violet-600/20 px-4 py-2 text-sm text-violet-300">
                {game.category}
              </span>

              <span className="text-sm text-yellow-400">
                ⭐ {game.rating || "5.0"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="min-h-screen bg-[#070914] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1800&auto=format&fit=crop)",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-8 py-28">
          <p className="font-bold uppercase tracking-[0.3em] text-fuchsia-400">
            JUDE PLAY
          </p>

          <h1 className="mt-6 max-w-3xl text-6xl font-black leading-tight">
            The Future Of Browser Gaming
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Play the best online games instantly. No downloads, no limits, just
            pure gaming experience.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            {games[0] && (
              <Link href={`/game/${games[0].slug}`}>
                <button className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-4 text-lg font-black shadow-[0_0_30px_rgba(168,85,247,.35)]">
                  ▶ Play Now
                </button>
              </Link>
            )}

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
      </section>

      <section className="mx-auto max-w-7xl px-8 py-16">
        <h2 className="text-4xl font-black">🔥 Most Played</h2>
        <p className="mt-3 text-slate-400">
          The most popular games on JUDE Play.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {trendingGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 pb-16">
        <h2 className="text-4xl font-black">🆕 New Games</h2>
        <p className="mt-3 text-slate-400">Freshly added games.</p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {newGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {recentlyPlayed.length > 0 && (
        <section className="mx-auto max-w-7xl px-8 pb-16">
          <h2 className="text-4xl font-black">🕹 Recently Played</h2>
          <p className="mt-3 text-slate-400">Continue where you left off.</p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {recentlyPlayed.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      <section id="games" className="mx-auto max-w-7xl px-8 py-16">
        <div className="mb-8">
          <h2 className="text-4xl font-black">
            {query || selectedCategory !== "All" ? "Filtered Games" : "All Games"}
          </h2>

          <p className="mt-3 text-slate-400">
            {query
              ? `Showing results for "${query}"`
              : selectedCategory !== "All"
              ? `Showing ${selectedCategory} games`
              : "Discover the hottest games on JUDE Play"}
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border border-white/10 bg-slate-950 p-8 text-slate-400">
            Loading games...
          </div>
        )}

        {!loading && games.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-slate-950 p-8 text-slate-400">
            No games found yet. Add your first game from Admin Dashboard.
          </div>
        )}

        {games.length > 0 && (
          <>
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
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            {filteredGames.length === 0 && (
              <div className="mt-10 rounded-3xl border border-white/10 bg-slate-950 p-8 text-slate-400">
                No games found.
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}