"use client";

import { useEffect, useMemo, useState } from "react";
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

  if (!games) return [];

  // Keep the same order as recently_played
  return slugs
    .map((slug) => games.find((game) => game.slug === slug))
    .filter(Boolean);
}

export default function HomeClient({
  initialGames,
}: {
  initialGames: any[];
}) {
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

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(games.map((game) => game.category).filter(Boolean)),
      ),
    ],
    [games],
  );

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
    currentPage * gamesPerPage,
  );

  const trendingGames = [...games]
    .sort((a, b) => Number(b.plays || 0) - Number(a.plays || 0))
    .slice(0, 8);

  function isSpaceShooter(game: any) {
    const text = `${game.slug || ""} ${game.title || ""}`.toLowerCase();

    return (
      text.includes("jude-space-shooter") ||
      text.includes("jude space shooter") ||
      text.includes("space shooter")
    );
  }

  function isLahza(game: any) {
    const text = `${game.slug || ""} ${game.title || ""}`.toLowerCase();

    return text.includes("lahza") || text.includes("لحظة");
  }

  const spaceShooter = games.find(isSpaceShooter);
  const lahza = games.find(isLahza);

  const judeOriginalGames = [spaceShooter, lahza].filter(Boolean);

  const heroGame = spaceShooter || lahza || games[0];

  const totalPlays = games.reduce(
    (sum, game) => sum + Number(game.plays || 0),
    0,
  );

  function GameCard({ game }: { game: any }) {
    const isFav = favorites.includes(game.slug);

    return (
      <Link href={`/game/${game.slug}`} className="block h-full">
        <article className="group h-full overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0b0e19] transition duration-300 hover:-translate-y-1.5 hover:border-fuchsia-500/30 hover:shadow-[0_22px_60px_rgba(0,0,0,.35)]">
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(game.slug);
              }}
              className={`absolute left-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-sm backdrop-blur-md transition hover:scale-110 ${
                isFav
                  ? "bg-red-500 text-white"
                  : "bg-black/55 text-white hover:bg-red-500"
              }`}
            >
              ♥
            </button>

            {game.image ? (
              <img
                loading="lazy"
                src={game.image}
                alt={game.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-600">
                No Image
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#080a12] via-transparent to-transparent" />

            <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
              ▶ {Number(game.plays || 0).toLocaleString()}
            </div>
          </div>

          <div className="p-4">
            <h3 className="line-clamp-1 text-lg font-black tracking-tight text-white">
              {game.title}
            </h3>

            <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-400">
              {game.meta || game.description || "Play instantly on JUDE Play."}
            </p>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="rounded-full border border-violet-400/15 bg-violet-500/10 px-3 py-1.5 text-xs font-bold text-violet-300">
                {game.category || "Arcade"}
              </span>

              <span className="text-xs font-bold text-yellow-300">
                ★ {game.rating || "5.0"}
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] text-white">
      {/* ================= HERO ================= */}
      <section className="relative min-h-[560px] overflow-hidden border-b border-white/[0.07] lg:min-h-[620px]">
        {heroGame?.image && (
          <img
            src={heroGame.image}
            alt=""
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-55"
          />
        )}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(89,38,255,.12),transparent_38%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04060c] via-[#04060c]/95 to-[#04060c]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-black/20" />

        <div className="relative z-10 mx-auto grid min-h-[560px] max-w-7xl items-center gap-12 px-6 py-16 md:px-8 lg:min-h-[620px] lg:grid-cols-[1.05fr_.95fr]">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-12 bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
              <span className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">
                JUDE GAME STUDIO
              </span>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-fuchsia-200">
                JUDE ORIGINAL
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-bold text-slate-300">
                PLAY FREE
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-bold text-slate-300">
                NO DOWNLOAD
              </span>
            </div>

            <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-fuchsia-400">
              FEATURED GAME
            </p>

            <h1 className="max-w-xl text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              {spaceShooter ? (
                <>
                  JUDE
                  <span className="block bg-gradient-to-r from-cyan-300 via-white to-fuchsia-400 bg-clip-text text-transparent">
                    SPACE SHOOTER
                  </span>
                </>
              ) : (
                heroGame?.title || "JUDE PLAY"
              )}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
              {heroGame?.description ||
                heroGame?.meta ||
                "Enter the battle, survive enemy waves and experience an original JUDE Game Studio adventure."}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {heroGame && (
                <Link
                  href={`/game/${heroGame.slug}`}
                  className="group inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-black transition hover:scale-[1.03]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-xs text-white">
                    ▶
                  </span>
                  PLAY NOW
                  <span className="transition group-hover:translate-x-1">→</span>
                </Link>
              )}

              <a
                href="#games"
                className="inline-flex items-center rounded-xl border border-white/15 bg-white/[0.06] px-6 py-4 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                Browse Games
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-7 border-t border-white/10 pt-6">
              <div>
                <p className="text-2xl font-black">
                  {games.length.toLocaleString()}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">
                  Games
                </p>
              </div>

              <div>
                <p className="text-2xl font-black">
                  {totalPlays.toLocaleString()}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">
                  Plays
                </p>
              </div>

              <div>
                <p className="text-2xl font-black">
                  {categories.length - 1}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">
                  Categories
                </p>
              </div>
            </div>
          </div>

          {/* Hero game visual */}
          {heroGame && (
            <Link
              href={`/game/${heroGame.slug}`}
              className="group relative hidden lg:block"
            >
              <div className="absolute -inset-10 rounded-full bg-fuchsia-600/15 blur-[90px]" />

              <div className="relative ml-auto w-full max-w-[520px] rotate-[1deg] overflow-hidden rounded-[30px] border border-white/15 bg-black shadow-[0_40px_100px_rgba(0,0,0,.65)] transition duration-500 group-hover:rotate-0 group-hover:scale-[1.015]">
                <div className="relative aspect-[16/10] overflow-hidden">
                  {heroGame.image && (
                    <img
                      src={heroGame.image}
                      alt={heroGame.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                  <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] backdrop-blur">
                    JUDE ORIGINAL
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                        NOW PLAYING
                      </p>

                      <h2 className="mt-1 text-2xl font-black">
                        {heroGame.title}
                      </h2>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-xl">
                      ▶
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* ================= SEARCH ================= */}
      <section className="relative z-20 mx-auto -mt-7 max-w-5xl px-6 md:px-8">
        <div className="rounded-2xl border border-white/10 bg-[#0b0e17]/95 p-2 shadow-[0_20px_70px_rgba(0,0,0,.45)] backdrop-blur-xl">
          <div className="flex items-center gap-3 rounded-xl bg-black/30 px-5">
            <span className="text-slate-500">⌕</span>

            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  document.getElementById("games")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }
              }}
              placeholder="Search 300+ games..."
              className="h-14 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        {/* ================= JUDE ORIGINALS ================= */}
        {judeOriginalGames.length > 0 &&
          query.trim() === "" &&
          selectedCategory === "All" && (
            <section className="mb-20">
              <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="h-px w-10 bg-cyan-400" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
                      JUDE ORIGINALS
                    </span>
                  </div>

                  <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                    Made by JUDE Game Studio
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm text-slate-400">
                    Original games created exclusively for JUDE Play.
                  </p>
                </div>

                <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-bold text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />
                  EXCLUSIVE ON JUDE PLAY
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {judeOriginalGames.map((game) => {
                  const shooter = isSpaceShooter(game);
                  const lahzaGame = isLahza(game);

                  return (
                    <Link
                      key={game.id}
                      href={`/game/${game.slug}`}
                      className={`group relative min-h-[430px] overflow-hidden rounded-[28px] border transition duration-500 hover:-translate-y-1.5 ${
                        shooter
                          ? "border-fuchsia-400/25 hover:border-fuchsia-400/60 hover:shadow-[0_30px_80px_rgba(168,85,247,.13)]"
                          : "border-cyan-400/25 hover:border-cyan-400/60 hover:shadow-[0_30px_80px_rgba(34,211,238,.13)]"
                      }`}
                    >
                      {game.image && (
                        <img
                          src={game.image}
                          alt={game.title}
                          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                        />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/30 to-black/5" />

                      <div className="absolute left-5 right-5 top-5 flex items-start justify-between">
                        <span className="rounded-full border border-white/15 bg-black/55 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
                          JUDE ORIGINAL
                        </span>

                        {lahzaGame && (
                          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200 backdrop-blur-md">
                            NEW
                          </span>
                        )}

                        {shooter && (
                          <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-500/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-200 backdrop-blur-md">
                            FEATURED
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                        <div className="mb-3 flex flex-wrap gap-2">
                          <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-bold text-slate-300 backdrop-blur">
                            {game.category || "Arcade"}
                          </span>

                          <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-bold text-slate-300 backdrop-blur">
                            ▶ {Number(game.plays || 0).toLocaleString()} Plays
                          </span>

                          <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-bold text-yellow-300 backdrop-blur">
                            ★ {game.rating || "5.0"}
                          </span>
                        </div>

                        <h3 className="text-3xl font-black tracking-tight sm:text-4xl">
                          {game.title}
                        </h3>

                        <p className="mt-3 line-clamp-2 max-w-lg text-sm leading-6 text-slate-300">
                          {game.description ||
                            game.meta ||
                            "An original JUDE Game Studio experience."}
                        </p>

                        <div className="mt-5">
                          <span
                            className={`inline-flex items-center gap-3 rounded-xl px-5 py-3 text-xs font-black text-black ${
                              shooter
                                ? "bg-gradient-to-r from-fuchsia-300 to-violet-300"
                                : "bg-gradient-to-r from-cyan-300 to-emerald-300"
                            }`}
                          >
                            PLAY NOW <span>→</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

        {/* ================= TRENDING ================= */}
        <section className="mb-20">
          <div className="mb-7">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-fuchsia-400">
              TRENDING
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
              Trending Now
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trendingGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* ================= ALL GAMES ================= */}
        <section id="games" className="scroll-mt-24">
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">
              DISCOVER
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
              {query || selectedCategory !== "All"
                ? "Search Results"
                : "Explore Games"}
            </h2>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`rounded-full px-4 py-2.5 text-xs font-bold transition ${
                  selectedCategory === category
                    ? "bg-white text-black"
                    : "border border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {paginatedGames.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-20 text-center">
              <p className="text-2xl font-black">No games found</p>
              <p className="mt-2 text-sm text-slate-500">
                Try another game or category.
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((prev) => prev - 1);
                  document
                    .getElementById("games")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm disabled:opacity-30"
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(
                  Math.max(currentPage - 3, 0),
                  Math.min(currentPage + 2, totalPages),
                )
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      document
                        .getElementById("games")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`min-w-10 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                      currentPage === page
                        ? "bg-white text-black"
                        : "border border-white/10 bg-white/[0.04] text-slate-400"
                    }`}
                  >
                    {page}
                  </button>
                ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((prev) => prev + 1);
                  document
                    .getElementById("games")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          )}
        </section>
      </div>

      {/* ================= RECENT ================= */}
      {recentlyPlayed.length > 0 && (
        <section className="border-t border-white/[0.06] bg-[#070911]">
          <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-400">
              CONTINUE PLAYING
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight">
              Recently Played
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {recentlyPlayed.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= ABOUT ================= */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
          <div className="grid gap-8 rounded-[28px] border border-white/[0.07] bg-[#090c14] p-7 md:grid-cols-[.8fr_1.2fr] md:p-10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-fuchsia-400">
                JUDE PLAY
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                Play instantly.
                <br />
                Play anywhere.
              </h2>
            </div>

            <div className="space-y-4 text-sm leading-7 text-slate-400 md:text-base">
              <p>
                JUDE Play is a free online gaming platform with hundreds of
                browser-based games across action, arcade, racing, puzzle,
                adventure, sports and more.
              </p>

              <p>
                Play directly from your browser with no downloads or
                installations. JUDE Play works across desktop, tablet and mobile
                devices.
              </p>

              <p>
                Discover new releases, trending titles and original games
                created by JUDE Game Studio.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}