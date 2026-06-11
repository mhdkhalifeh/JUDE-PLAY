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

export default function HomeClient({ initialGames }: { initialGames: any[] }) {
  const [games] = useState<any[]>(initialGames);
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const gamesPerPage = 24;

  useEffect(() => {
    async function loadUserData() {
      const recentGames = await getRecentlyPlayed();
      setRecentlyPlayed(recentGames);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: favs } = await supabase
          .from("favorites")
          .select("game_slug")
          .eq("user_id", user.id);

        setFavorites(favs?.map((f) => f.game_slug) || []);
      }
    }

    loadUserData();
  }, []);

  async function toggleFavorite(gameSlug: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      return;
    }

    const isFav = favorites.includes(gameSlug);

    if (isFav) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("game_slug", gameSlug);

      setFavorites((prev) => prev.filter((slug) => slug !== gameSlug));
    } else {
      await supabase.from("favorites").insert({
        user_id: user.id,
        game_slug: gameSlug,
      });

      setFavorites((prev) => [...prev, gameSlug]);
    }
  }

  const categories = [
    "All",
    ...Array.from(new Set(games.map((game) => game.category).filter(Boolean))),
  ];

  const filteredGames = games.filter((game) => {
    const text = `${game.title || ""} ${game.category || ""} ${
      game.meta || ""
    } ${game.description || ""}`;

    return (
      text.toLowerCase().includes(query.toLowerCase()) &&
      (selectedCategory === "All" || game.category === selectedCategory)
    );
  });

  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

  const paginatedGames = filteredGames.slice(
    (currentPage - 1) * gamesPerPage,
    currentPage * gamesPerPage
  );

  const trendingGames = [...games]
    .sort((a, b) => (b.plays || 0) - (a.plays || 0))
    .slice(0, 8);

  const featuredGames = trendingGames.slice(0, 3);

  const totalPlays = games.reduce((sum, game) => sum + (game.plays || 0), 0);

  function GameCard({ game }: { game: any }) {
    const isFav = favorites.includes(game.slug);

    return (
      <Link href={`/game/${game.slug}`}>
        <div className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(124,58,237,.35)]">
          <div className="relative h-56 overflow-hidden">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(game.slug);
              }}
              className={`absolute left-4 top-4 z-20 rounded-full p-3 text-white backdrop-blur transition hover:scale-110 ${
                isFav ? "bg-red-500" : "bg-black/60 hover:bg-red-500"
              }`}
            >
              ❤️
            </button>

            {game.image ? (
              <img
                loading="lazy"
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

          <div className="p-5">
            <h3 className="line-clamp-1 text-xl font-black">{game.title}</h3>

            <p className="mt-2 line-clamp-2 text-sm text-slate-400">
              {game.meta || game.description || ""}
            </p>

            <div className="mt-5 flex items-center justify-between">
              <span className="rounded-full bg-violet-600/20 px-4 py-2 text-sm text-violet-300">
                {game.category || "Arcade"}
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
              "url(https://images.template.net/376680/Neon-Gaming-Background-edit-online-1.jpg)",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-8 py-12">
          <p className="font-bold uppercase tracking-[0.3em] text-fuchsia-400">
            JUDE PLAY
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            The Future Of Browser Gaming
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Play instantly. No downloads. Just games.
          </p>

          <div className="mt-7 flex flex-wrap gap-4">
            {games[0] && (
              <Link href={`/game/${games[0].slug}`}>
                <button className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-7 py-3 text-base font-black shadow-[0_0_30px_rgba(168,85,247,.35)]">
                  ▶ Play Now
                </button>
              </Link>
            )}

            <a href="#games">
              <button className="rounded-2xl border border-white/10 bg-white/5 px-7 py-3 text-base hover:bg-white/10">
                Browse Games
              </button>
            </a>
          </div>

          <div className="mt-7 grid max-w-2xl grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur">
              <p className="text-xs text-slate-400">Games</p>
              <p className="mt-1 text-2xl font-black">{games.length}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur">
              <p className="text-xs text-slate-400">Plays</p>
              <p className="mt-1 text-2xl font-black">{totalPlays}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur">
              <p className="text-xs text-slate-400">Categories</p>
              <p className="mt-1 text-2xl font-black">
                {categories.length - 1}
              </p>
            </div>
          </div>

          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search for games..."
            className="mt-6 w-full max-w-2xl rounded-2xl border border-white/10 bg-black/50 px-6 py-4 text-base outline-none backdrop-blur focus:border-fuchsia-500"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 py-10">
        {featuredGames.length > 0 && (
          <section className="mb-14">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="font-bold uppercase tracking-[0.3em] text-fuchsia-400">
                  FEATURED
                </p>
                <h2 className="mt-2 text-4xl font-black">Featured Games</h2>
              </div>

              <Link
                href="/top-games"
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-300 hover:bg-white/10"
              >
                View Top Games →
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {featuredGames.map((game) => (
                <Link
                  key={game.id}
                  href={`/game/${game.slug}`}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-950 transition hover:-translate-y-1 hover:border-fuchsia-500"
                >
                  <div className="relative h-72 overflow-hidden">
                    {game.image ? (
                      <img
                        loading="lazy"
                        src={game.image}
                        alt={game.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-slate-900 text-slate-500">
                        No Image
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    <div className="absolute bottom-5 left-5 right-5">
                      <h3 className="text-2xl font-black">{game.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-300">
                        {game.description || game.meta}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="rounded-full bg-fuchsia-600/30 px-4 py-2 text-sm text-fuchsia-200">
                          {game.category || "Game"}
                        </span>

                        <span className="rounded-full bg-black/50 px-4 py-2 text-sm text-yellow-400">
                          🔥 {game.plays || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-14">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="font-bold uppercase tracking-[0.3em] text-fuchsia-400">
                TRENDING
              </p>
              <h2 className="mt-2 text-4xl font-black">Trending Now</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {trendingGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        <div id="games">
          <div className="mb-8">
            <p className="font-bold uppercase tracking-[0.3em] text-fuchsia-400">
              BROWSE
            </p>
            <h2 className="mt-2 text-4xl font-black">
              {query || selectedCategory !== "All"
                ? "Filtered Games"
                : "All Games"}
            </h2>
          </div>

          <div className="mb-10 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
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
            {paginatedGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 disabled:opacity-40"
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(
                  Math.max(currentPage - 3, 0),
                  Math.min(currentPage + 2, totalPages)
                )
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-xl px-4 py-2 font-bold transition ${
                      currentPage === page
                        ? "bg-fuchsia-600 text-white"
                        : "border border-white/10 bg-white/5"
                    }`}
                  >
                    {page}
                  </button>
                ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>

      {recentlyPlayed.length > 0 && (
        <section className="mx-auto max-w-7xl px-8 pb-16">
          <h2 className="text-4xl font-black">🕹 Recently Played</h2>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {recentlyPlayed.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-8 pb-20">
        <div className="rounded-3xl border border-white/10 bg-slate-950 p-8">
          <h2 className="mb-6 text-4xl font-black">About JUDE Play</h2>

          <div className="space-y-6 leading-8 text-slate-300">
            <p>
              JUDE Play is a free online gaming platform that offers hundreds of
              browser-based HTML5 games across multiple categories including
              action, puzzle, racing, adventure, arcade, sports and multiplayer
              games.
            </p>

            <p>
              Our mission is to make gaming accessible to everyone without the
              need for downloads, installations or expensive hardware. Every
              game can be played instantly from your browser on desktop, tablet
              or mobile devices.
            </p>

            <p>
              Whether you enjoy fast-paced action games, relaxing puzzle games,
              exciting racing experiences or competitive multiplayer challenges,
              JUDE Play provides a growing library of games for players of all
              ages.
            </p>

            <p>
              New games are added regularly to ensure fresh content and a better
              gaming experience for our community. Explore categories, discover
              trending titles and enjoy unlimited gaming completely free.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}