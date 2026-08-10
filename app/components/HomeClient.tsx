"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

const SPACE_SHOOTER_URL = "https://jude-space-shooter.vercel.app/";

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

  if (!slugs.length) return [];

  const { data: games } = await supabase
    .from("games")
    .select("*")
    .in("slug", slugs);

  if (!games) return [];

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

      if (!user) return;

      const { data: favs } = await supabase
        .from("favorites")
        .select("game_slug")
        .eq("user_id", user.id);

      setFavorites(favs?.map((f) => f.game_slug) || []);
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

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(games.map((game) => game.category).filter(Boolean)),
      ),
    ];
  }, [games]);

  const filteredGames = games.filter((game) => {
    const text = `${game.title || ""} ${game.category || ""} ${
      game.meta || ""
    } ${game.description || ""}`.toLowerCase();

    return (
      text.includes(query.toLowerCase()) &&
      (selectedCategory === "All" || game.category === selectedCategory)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredGames.length / gamesPerPage),
  );

  const paginatedGames = filteredGames.slice(
    (currentPage - 1) * gamesPerPage,
    currentPage * gamesPerPage,
  );

  const trendingGames = [...games]
    .sort((a, b) => Number(b.plays || 0) - Number(a.plays || 0))
    .slice(0, 6);

  const lahza = games.find((game) => {
    const text = `${game.slug || ""} ${game.title || ""}`.toLowerCase();

    return text.includes("lahza") || text.includes("لحظة");
  });

  const totalPlays = games.reduce(
    (sum, game) => sum + Number(game.plays || 0),
    0,
  );

  function scrollToGames() {
    document.getElementById("games")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  function GameCard({ game }: { game: any }) {
    const isFav = favorites.includes(game.slug);

    return (
      <Link href={`/game/${game.slug}`} className="block h-full">
        <article className="group h-full overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#0a0e19] transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/30 hover:shadow-[0_20px_50px_rgba(0,0,0,.45)]">
          <div className="relative aspect-[16/10] overflow-hidden bg-[#101522]">
            {game.image ? (
              <img
                src={game.image}
                alt={game.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-600">
                No Image
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#090d17] via-transparent to-transparent" />

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(game.slug);
              }}
              className={`absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 backdrop-blur-md transition ${
                isFav
                  ? "bg-pink-500 text-white"
                  : "bg-black/50 text-white hover:bg-pink-500"
              }`}
            >
              ♥
            </button>
          </div>

          <div className="p-4">
            <h3 className="truncate text-[15px] font-extrabold text-white">
              {game.title}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {game.category || "Arcade"}
            </p>

            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="font-semibold text-fuchsia-400">
                ▶ {Number(game.plays || 0).toLocaleString()}
              </span>

              <span className="font-bold text-yellow-400">
                ★ {game.rating || "5.0"}
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <main className="min-h-screen bg-[#040711] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/[0.07]">
        <div className="absolute inset-0 bg-[#050815]" />

        <div className="absolute right-[-10%] top-[-35%] h-[800px] w-[800px] rounded-full bg-violet-700/20 blur-[130px]" />
        <div className="absolute right-[20%] top-[15%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute left-[-20%] bottom-[-60%] h-[700px] w-[700px] rounded-full bg-fuchsia-700/10 blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
            maskImage: "linear-gradient(to right, black, transparent 70%)",
          }}
        />

        <div className="relative z-10 mx-auto grid min-h-[620px] w-full max-w-[1450px] items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:px-12">
          {/* LEFT */}
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-400">
              JUDE GAME STUDIO
            </p>

            <div className="mt-7 flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-fuchsia-400">
                FEATURED GAME
              </span>

              <span className="text-yellow-400">★</span>
            </div>

            <h1 className="mt-4 max-w-[650px] text-[48px] font-black uppercase leading-[0.88] tracking-[-0.05em] sm:text-[64px] lg:text-[78px]">
              <span className="block text-white">JUDE</span>

              <span className="block bg-gradient-to-r from-cyan-300 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">
                SPACE
              </span>

              <span className="block bg-gradient-to-r from-fuchsia-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                SHOOTER
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-300">
              The ultimate space battle begins now. Fight enemy waves, upgrade
              your ship and survive the Nova Legion.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={SPACE_SHOOTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-[175px] items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-400 px-7 py-4 text-sm font-black text-white shadow-[0_12px_40px_rgba(168,85,247,.30)] transition hover:scale-[1.03]"
              >
                PLAY NOW
                <span>▶</span>
              </a>

              <button
                onClick={scrollToGames}
                className="min-w-[155px] rounded-xl border border-white/20 bg-black/20 px-7 py-4 text-sm font-bold backdrop-blur transition hover:bg-white/10"
              >
                Browse Games
              </button>
            </div>

            <div className="mt-8 grid max-w-[510px] grid-cols-3 gap-3">
              <div className="rounded-xl border border-purple-400/25 bg-black/20 p-4 backdrop-blur">
                <p className="text-xl font-black">{games.length}</p>
                <p className="mt-1 text-[11px] text-slate-500">Games</p>
              </div>

              <div className="rounded-xl border border-purple-400/25 bg-black/20 p-4 backdrop-blur">
                <p className="text-xl font-black">
                  {totalPlays.toLocaleString()}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">Plays</p>
              </div>

              <div className="rounded-xl border border-purple-400/25 bg-black/20 p-4 backdrop-blur">
                <p className="text-xl font-black">
                  {Math.max(categories.length - 1, 0)}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">Categories</p>
              </div>
            </div>
          </div>

          {/* RIGHT - SPACE SHOOTER VISUAL */}
          <div className="relative hidden min-h-[520px] lg:block">
            <div className="absolute left-[45%] top-[50%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />
            <div className="absolute right-[0%] top-[12%] h-[420px] w-[420px] rounded-full bg-fuchsia-600/10 blur-[130px]" />

            <a
              href={SPACE_SHOOTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group absolute inset-0 flex items-center justify-center"
            >
              <div className="relative w-full max-w-[760px] overflow-hidden rounded-[30px] border border-white/10 bg-black/30 shadow-[0_40px_100px_rgba(0,0,0,.55)] transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-[1.01] group-hover:border-cyan-400/30">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src="/images/jude-space-shooter.webp"
                    alt="JUDE Space Shooter"
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#040711] via-transparent to-black/15" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />

                  <div className="absolute left-5 top-5">
                    <span className="rounded-full border border-cyan-400/20 bg-black/45 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300 backdrop-blur-md">
                      JUDE ORIGINAL
                    </span>
                  </div>

                  <div className="absolute right-5 top-5 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                    SPACE COMBAT
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-end justify-between gap-6">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                          NOW PLAYING
                        </p>

                        <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
                          JUDE Space Shooter
                        </h2>

                        <p className="mt-2 max-w-md text-sm text-slate-300">
                          Enter the battle and survive the Nova Legion.
                        </p>
                      </div>

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-lg font-black text-white shadow-[0_10px_30px_rgba(34,211,238,.25)] transition group-hover:scale-110">
                        ▶
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <div className="relative z-20 mx-auto -mt-7 w-full max-w-[1180px] px-5 sm:px-8">
        <div className="rounded-2xl border border-white/10 bg-[#0a0e19]/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,.45)] backdrop-blur-xl">
          <div className="flex h-14 items-center gap-3 rounded-xl bg-black/30 px-5">
            <span className="text-lg text-slate-600">⌕</span>

            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  scrollToGames();
                }
              }}
              placeholder="Search for games..."
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-slate-600"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1450px] px-5 py-16 sm:px-8 lg:px-12">
        {/* JUDE ORIGINALS */}
        {query.trim() === "" && selectedCategory === "All" && (
          <section className="mb-16">
            <div className="rounded-[26px] border border-white/[0.08] bg-gradient-to-br from-[#080c17] via-[#080b15] to-[#090815] p-5 sm:p-7">
              <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">
                    JUDE ORIGINALS
                  </p>

                  <h2 className="mt-2 text-3xl font-black md:text-4xl">
                    Made by JUDE Game Studio
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Original games built exclusively for JUDE Play.
                  </p>
                </div>

                <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[10px] font-bold text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                  EXCLUSIVE ON JUDE PLAY
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {/* SPACE SHOOTER CARD */}
                <a
                  href={SPACE_SHOOTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative min-h-[430px] overflow-hidden rounded-[22px] border border-purple-400/20 bg-[#060915] transition duration-300 hover:-translate-y-1 hover:border-purple-400/50"
                >
                  <img
                    src="/images/jude-space-shooter.webp"
                    alt="JUDE Space Shooter"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#050812] via-[#050812]/50 to-black/10" />

                  <div className="absolute left-5 top-5">
                    <span className="rounded-full border border-cyan-400/20 bg-black/45 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300 backdrop-blur">
                      JUDE ORIGINAL
                    </span>
                  </div>

                  <div className="absolute right-5 top-5">
                    <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-200 backdrop-blur">
                      FEATURED
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050812] via-[#050812]/95 to-transparent p-6 pt-28">
                    <h3 className="max-w-md text-4xl font-black uppercase leading-[0.9] tracking-[-0.04em]">
                      <span className="block text-white">JUDE</span>

                      <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
                        SPACE SHOOTER
                      </span>
                    </h3>

                    <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
                      Fight enemies, upgrade your ship and survive the ultimate
                      JUDE space battle.
                    </p>

                    <div className="mt-5">
                      <span className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-cyan-400 px-5 py-3 text-xs font-black text-white">
                        PLAY NOW
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                </a>

                {/* LAHZA */}
                {lahza ? (
                  <Link
                    href={`/game/${lahza.slug}`}
                    className="group relative min-h-[430px] overflow-hidden rounded-[22px] border border-cyan-400/20 bg-[#061014] transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50"
                  >
                    {lahza.image && (
                      <img
                        src={lahza.image}
                        alt={lahza.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#041012] via-black/25 to-black/10" />

                    <div className="absolute left-5 top-5">
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300 backdrop-blur">
                        JUDE ORIGINAL
                      </span>
                    </div>

                    <div className="absolute right-5 top-5">
                      <span className="rounded-full bg-emerald-400 px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-black">
                        NEW
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#041012] via-[#041012]/95 to-transparent p-6 pt-28">
                      <h3 className="text-3xl font-black md:text-4xl">
                        {lahza.title}
                      </h3>

                      <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
                        {lahza.description ||
                          lahza.meta ||
                          "Test your timing and reflexes in this addictive challenge."}
                      </p>

                      <div className="mt-5">
                        <span className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-400 px-5 py-3 text-xs font-black text-black">
                          PLAY NOW
                          <span>→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="flex min-h-[430px] items-center justify-center rounded-[22px] border border-white/10 bg-[#080c14]">
                    <p className="text-slate-500">LAHZA will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* TRENDING */}
        <section className="mb-16">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-fuchsia-400">
              TRENDING NOW
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Popular games right now
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {trendingGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* BROWSE */}
        <section
          id="games"
          className="scroll-mt-24 rounded-[26px] border border-white/[0.08] bg-[#080c16] p-5 sm:p-7"
        >
          <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">
            BROWSE BY CATEGORY
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`rounded-full px-5 py-2.5 text-xs font-bold transition ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-[0_8px_25px_rgba(168,85,247,.25)]"
                    : "border border-white/10 bg-[#0c111d] text-slate-400 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="my-8 h-px bg-white/[0.07]" />

          <div className="mb-7">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-violet-400">
              EXPLORE GAMES
            </p>

            <h2 className="mt-2 text-3xl font-black">
              {query || selectedCategory !== "All"
                ? "Search Results"
                : "Discover more amazing games"}
            </h2>
          </div>

          {paginatedGames.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {paginatedGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-xl font-black">No games found</p>
              <p className="mt-2 text-sm text-slate-500">
                Try another search or category.
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((prev) => prev - 1);
                  scrollToGames();
                }}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm disabled:opacity-30"
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
                      scrollToGames();
                    }}
                    className={`min-w-10 rounded-xl px-3 py-2 text-sm font-bold ${
                      currentPage === page
                        ? "bg-purple-600 text-white"
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
                  scrollToGames();
                }}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          )}
        </section>
      </div>

      {/* RECENTLY PLAYED */}
      {recentlyPlayed.length > 0 && (
        <section className="border-t border-white/[0.06] bg-[#060913]">
          <div className="mx-auto w-full max-w-[1450px] px-5 py-14 sm:px-8 lg:px-12">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">
              CONTINUE PLAYING
            </p>

            <h2 className="mt-2 text-3xl font-black">Recently Played</h2>

            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {recentlyPlayed.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ABOUT */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto w-full max-w-[1450px] px-5 py-14 sm:px-8 lg:px-12">
          <div className="grid gap-8 rounded-[24px] border border-white/[0.07] bg-[#080c15] p-7 md:grid-cols-[0.7fr_1.3fr] md:p-9">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-fuchsia-400">
                JUDE PLAY
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Play instantly.
                <br />
                Play anywhere.
              </h2>
            </div>

            <div className="space-y-4 text-sm leading-7 text-slate-400">
              <p>
                JUDE Play is a free online gaming platform with hundreds of
                browser games across action, puzzle, racing, arcade, adventure
                and more.
              </p>

              <p>
                Play directly from your browser with no downloads or
                installations on desktop, tablet and mobile.
              </p>

              <p>
                Discover trending games and original experiences created by
                JUDE Game Studio.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}