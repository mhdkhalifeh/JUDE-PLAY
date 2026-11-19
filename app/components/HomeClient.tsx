"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight, ChevronRight, Clock3, Flame, Gamepad2,
  Grid2X2, Heart, Menu, Sparkles, Trophy, X, Zap,
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";

const SPACE_SHOOTER_URL = "https://jude-space-shooter.vercel.app/";
const SPACE_SHOOTER_IMAGE = "/images/jude-space-shooter.webp";

type Game = {
  id: string;
  slug: string;
  title: string;
  image?: string | null;
  category?: string | null;
  meta?: string | null;
  description?: string | null;
  plays?: number | null;
  created_at?: string | null;
};
type Rating = { average: number; count: number };

type Props = { initialGames: Game[] };

function shortNumber(n: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export default function HomeClient({ initialGames }: Props) {
  const games = initialGames;
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Game[]>([]);
  const [ratingStats, setRatingStats] = useState<Record<string, Rating>>({});
  const [ratingsReady, setRatingsReady] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 30;

  useEffect(() => {
    let active = true;
    async function loadPersonal() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!active || !user) return;
      const [favsResult, recentsResult] = await Promise.all([
        supabase.from("favorites").select("game_slug").eq("user_id", user.id),
        supabase.from("recently_played").select("game_slug")
          .eq("user_id", user.id).order("created_at", { ascending: false }).limit(16),
      ]);
      if (!active) return;
      setFavorites((favsResult.data || []).map((item) => item.game_slug));
      const slugs = (recentsResult.data || []).map((item) => item.game_slug);
      const bySlug = new Map(games.map((game) => [game.slug, game]));
      setRecentlyPlayed(slugs.map((slug) => bySlug.get(slug)).filter((g): g is Game => Boolean(g)));
    }
    void loadPersonal();
    return () => { active = false; };
  }, [games]);

  useEffect(() => {
    let active = true;
    async function loadRatings() {
      const { data, error } = await supabase.rpc("get_all_game_rating_stats");
      if (!active) return;
      if (error) {
        console.error("Ratings could not be loaded:", error.message);
      } else {
        const entries: Record<string, Rating> = {};
        for (const item of data || []) {
          entries[item.game_id] = {
            average: Number(item.average_rating),
            count: Number(item.total_ratings),
          };
        }
        setRatingStats(entries);
      }
      setRatingsReady(true);
    }
    void loadRatings();
    return () => { active = false; };
  }, []);

  async function toggleFavorite(slug: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in to save your favorite games.");
      return;
    }
    const wasFavorite = favorites.includes(slug);
    const result = wasFavorite
      ? await supabase.from("favorites").delete().eq("user_id", user.id).eq("game_slug", slug)
      : await supabase.from("favorites").insert({ user_id: user.id, game_slug: slug });
    if (result.error) {
      alert("Unable to save favorite: " + result.error.message);
      return;
    }
    setFavorites((prev) => wasFavorite ? prev.filter((value) => value !== slug) : [...prev, slug]);
  }

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    games.forEach((game) => {
      if (game.category) counts.set(game.category, (counts.get(game.category) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
  }, [games]);

  const popular = useMemo(() => [...games].sort((a, b) => Number(b.plays || 0) - Number(a.plays || 0)), [games]);
  const latest = games; // app/page.tsx already sorts by created_at descending
  const lahza = games.find((game) => /lahza|لحظة/i.test(`${game.slug} ${game.title}`));
  const judoku = games.find((game) => game.slug === "judoku");
  const topPicks = popular.slice(0, 10);
  const featured = popular.slice(10, 26);
  const filtered = useMemo(() => games.filter((game) => {
    const matchesCategory = category === "All" || game.category === category;
    if (!matchesCategory) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${game.title} ${game.category || ""} ${game.meta || ""} ${game.description || ""}`.toLowerCase().includes(q);
  }), [games, category, query]);
  const maxPage = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageGames = filtered.slice((page - 1) * pageSize, page * pageSize);

  function pickCategory(value: string) {
    setCategory(value);
    setQuery("");
    setPage(1);
    setMenuOpen(false);
    document.getElementById("game-library")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function scrollToLibrary() {
    document.getElementById("game-library")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function RatingLabel({ game }: { game: Game }) {
    const stats = ratingStats[game.id];
    return <span className="text-[11px] font-bold text-amber-300">
      {!ratingsReady ? "☆ ..." : stats?.count > 0 ? `★ ${stats.average.toFixed(1)} (${stats.count})` : "☆ Not Rated"}
    </span>;
  }

  function FavoriteControl({ game }: { game: Game }) {
    const selected = favorites.includes(game.slug);
    return <button
      type="button"
      title={selected ? "Remove favorite" : "Add to favorites"}
      aria-label={selected ? `Remove ${game.title} from favorites` : `Add ${game.title} to favorites`}
      aria-pressed={selected}
      onClick={() => void toggleFavorite(game.slug)}
      className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 backdrop-blur-md transition hover:scale-110 ${selected ? "bg-fuchsia-600 text-white" : "bg-black/55 text-white hover:bg-fuchsia-600"}`}
    >
      <Heart size={15} fill={selected ? "currentColor" : "none"}/>
    </button>;
  }

  function GameTile({ game, large = false, showDetails = false }: { game: Game; large?: boolean; showDetails?: boolean }) {
    return <div className="group relative min-w-0">
      <Link
        href={`/game/${game.slug}`}
        title={game.title}
        className={`relative block overflow-hidden rounded-2xl border border-white/[0.09] bg-[#171b2b] transition duration-200 hover:-translate-y-0.5 hover:border-fuchsia-400/60 hover:shadow-[0_12px_32px_rgba(0,0,0,.4)] ${large ? "aspect-[16/10]" : "aspect-[16/10]"}`}
      >
        {game.image ? <img src={game.image} alt={game.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.055]"/> : <div className="flex h-full items-center justify-center text-slate-500"><Gamepad2 size={34}/></div>}
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent px-3 pb-3 pt-10 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="line-clamp-2 text-xs font-extrabold text-white">{game.title}</span>
        </span>
      </Link>
      <FavoriteControl game={game}/>
      {showDetails && <div className="px-1 pt-2">
        <Link href={`/game/${game.slug}`} className="block truncate text-[12px] font-bold text-white hover:text-fuchsia-300">{game.title}</Link>
        <div className="mt-1 flex items-center justify-between gap-1 text-[11px] text-slate-400">
          <span className="truncate">{game.category || "Arcade"}</span>
          <span className="shrink-0 text-fuchsia-300">▶ {shortNumber(Number(game.plays || 0))}</span>
        </div>
        <div className="mt-1"><RatingLabel game={game}/></div>
      </div>}
    </div>;
  }

  function RowSection({ title, subtitle, items, href, icon }: { title: string; subtitle?: string; items: Game[]; href?: string; icon?: React.ReactNode }) {
    if (!items.length) return null;
    return <section className="mb-8 min-w-0">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-white sm:text-xl">{icon}{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        {href && <Link href={href} className="flex shrink-0 items-center gap-1 text-xs font-bold text-violet-300 hover:text-white">View all <ChevronRight size={15}/></Link>}
      </div>
      <div className="flex snap-x gap-3 overflow-x-auto pb-3 [scrollbar-width:thin] [scrollbar-color:#41415e_transparent]">
        {items.map((game) => <div key={game.id} className="w-[178px] shrink-0 snap-start sm:w-[205px] lg:w-[218px]"><GameTile game={game}/></div>)}
      </div>
    </section>;
  }

  return <main className="min-h-screen bg-[#0d0e16] text-white">
    {/* This sidebar is scoped to Home: the existing site navbar stays unchanged. */}
    <div className="mx-auto flex max-w-[1920px]">
      <aside className={`fixed bottom-0 left-0 top-[68px] z-40 w-[216px] overflow-y-auto border-r border-white/[0.08] bg-[#14151e] px-3 pb-8 pt-4 transition-transform lg:sticky lg:top-[68px] lg:h-[calc(100vh-68px)] lg:shrink-0 lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-5 flex items-center justify-between px-2 lg:hidden"><strong>Explore</strong><button aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={20}/></button></div>
        <nav aria-label="Home game navigation" className="space-y-1">
          <button onClick={() => { setCategory("All"); setQuery(""); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex w-full items-center gap-3 rounded-xl bg-white/[0.08] px-3 py-2.5 text-left text-sm font-bold"><Gamepad2 size={17} className="text-lime-400"/> Home</button>
          {recentlyPlayed.length > 0 && <button onClick={() => { setMenuOpen(false); document.getElementById("continue-playing")?.scrollIntoView({ behavior: "smooth" }); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-200 hover:bg-white/[0.06]"><Clock3 size={17} className="text-violet-400"/> Recently played</button>}
          <Link href="/new-games" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-200 hover:bg-white/[0.06]"><Sparkles size={17} className="text-violet-400"/> New games</Link>
          <Link href="/top-games" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-200 hover:bg-white/[0.06]"><Flame size={17} className="text-violet-400"/> Popular games</Link>
          <Link href="/jude-originals" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-200 hover:bg-white/[0.06]"><Zap size={17} className="text-violet-400"/> JUDE Originals</Link>
          <Link href="/favorites" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-200 hover:bg-white/[0.06]"><Heart size={17} className="text-violet-400"/> My favorites</Link>
          <Link href="/categories" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-200 hover:bg-white/[0.06]"><Grid2X2 size={17} className="text-violet-400"/> All categories</Link>
        </nav>
        <div className="my-5 h-px bg-white/10"/>
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.15em] text-slate-500">Categories</p>
        <nav aria-label="Game categories" className="space-y-0.5">
          {categories.map((name) => <button key={name} onClick={() => pickCategory(name)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] transition ${category === name ? "bg-violet-500/20 text-fuchsia-200" : "text-slate-300 hover:bg-white/[0.06] hover:text-white"}`}><span className="text-violet-400">✦</span><span className="truncate">{name}</span></button>)}
        </nav>
      </aside>
      {menuOpen && <button className="fixed inset-0 z-30 bg-black/70 lg:hidden" aria-label="Close sidebar" onClick={() => setMenuOpen(false)}/>}

      <div className="min-w-0 flex-1">
        {/* Mobile sidebar toggle; main search lives in Navbar */}
        <div className="border-b border-white/[0.07] bg-[#11121c] px-4 py-2 lg:hidden">
          <button
            type="button"
            aria-label="Open game categories"
            onClick={() => setMenuOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-bold text-violet-200"
          >
            <Menu size={18} /> Browse categories
          </button>
        </div>

        <div className="min-w-0 px-4 pb-16 pt-5 sm:px-6 lg:px-7">
          {!query.trim() && category === "All" && <>
            {recentlyPlayed.length > 0 && <section id="continue-playing" className="mb-7">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold sm:text-xl"><Clock3 size={19} className="text-violet-400"/> Continue playing</h2>
              <div className="flex snap-x gap-2.5 overflow-x-auto pb-3 [scrollbar-width:thin] [scrollbar-color:#41415e_transparent]">
                {recentlyPlayed.map((game) => <div className="w-[94px] shrink-0 snap-start sm:w-[112px]" key={game.id}><GameTile game={game}/></div>)}
              </div>
            </section>}

            <section className="mb-8">
              <div className="mb-3 flex items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-lg font-extrabold sm:text-xl"><Trophy size={19} className="text-amber-400"/> Top picks for you</h2><Link href="/top-games" className="text-xs font-bold text-violet-300 hover:text-white">View more ›</Link></div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8">
                {/* JUDE original prominently positioned, like the reference mosaic */}
                <a href={SPACE_SHOOTER_URL} target="_blank" rel="noopener noreferrer" className="group relative col-span-2 row-span-2 min-h-[220px] overflow-hidden rounded-2xl border border-cyan-500/25 bg-[#101526] sm:min-h-0">
                  <img src={SPACE_SHOOTER_IMAGE} alt="JUDE Space Shooter" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"/>
                  <span className="absolute left-3 top-3 rounded-full bg-black/65 px-2 py-1 text-[10px] font-bold tracking-wider text-cyan-300">JUDE ORIGINAL</span>
                  <div className="absolute bottom-4 left-4 right-4"><p className="text-lg font-black sm:text-2xl">JUDE Space Shooter</p><p className="mt-1 text-xs text-slate-300">Play original space combat <ArrowUpRight size={13} className="inline"/></p></div>
                </a>
                {lahza && <div className="col-span-2 row-span-2"><GameTile game={lahza} large/></div>}
                {topPicks.filter((g) => g.id !== lahza?.id).slice(0, 8).map((game) => <GameTile key={game.id} game={game}/>)}
              </div>
            </section>

            <RowSection title="Featured games" items={featured} href="/top-games" icon={<Sparkles size={19} className="text-fuchsia-400"/>}/>
            <RowSection title="New games" items={latest.slice(0, 18)} href="/new-games" icon={<Clock3 size={19} className="text-cyan-400"/>}/>
            <RowSection title="Popular games" items={popular.slice(0, 18)} href="/top-games" icon={<Flame size={19} className="text-orange-400"/>}/>

            <section id="jude-originals" className="mb-9">
              <div className="mb-3 flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-lg font-extrabold sm:text-xl"><Zap size={19} className="text-cyan-300"/> JUDE Game Studio Originals</h2><Link href="/jude-originals" className="shrink-0 text-xs font-bold text-violet-300 hover:text-white">View all <ChevronRight size={15} className="inline"/></Link></div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <a href={SPACE_SHOOTER_URL} target="_blank" rel="noopener noreferrer" className="group relative aspect-[16/8] overflow-hidden rounded-2xl border border-violet-400/25 bg-[#111526]">
                  <img src={SPACE_SHOOTER_IMAGE} alt="JUDE Space Shooter" loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"/>
                  <div className="absolute bottom-4 left-4"><span className="text-[10px] font-bold text-cyan-300">JUDE ORIGINAL</span><h3 className="text-xl font-extrabold">Space Shooter</h3></div>
                </a>
                {lahza && <Link href={`/game/${lahza.slug}`} className="group relative aspect-[16/8] overflow-hidden rounded-2xl border border-cyan-400/25 bg-[#111526]">
                  {lahza.image && <img src={lahza.image} alt={lahza.title} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105"/>}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"/>
                  <div className="absolute bottom-4 left-4"><span className="text-[10px] font-bold text-cyan-300">JUDE ORIGINAL</span><h3 className="text-xl font-extrabold">LAHZA</h3></div>
                </Link>}
                {judoku && (
  <Link
    href={`/game/${judoku.slug}`}
    className="group relative aspect-[16/8] overflow-hidden rounded-2xl border border-amber-400/25 bg-[#111526]"
  >
    {judoku.image && (
      <img
        src={judoku.image}
        alt="JUDOKU"
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    )}

    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

    <div className="absolute bottom-4 left-4">
      <span className="text-[10px] font-bold text-cyan-300">
        JUDE ORIGINAL
      </span>
      <h3 className="text-xl font-extrabold">JUDOKU</h3>
    </div>
  </Link>
)}
              </div>
            </section>
          </>}

          <section id="game-library" className="scroll-mt-36">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="text-xl font-extrabold sm:text-2xl">{query.trim() ? "Search results" : category !== "All" ? `${category} games` : "Explore all games"}</h2><p className="mt-1 text-xs text-slate-400">{filtered.length} games available</p></div>
              {(category !== "All" || query.trim()) && <button onClick={() => {setCategory("All");setQuery("");setPage(1);}} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:text-white">Clear filters</button>}
            </div>
            <div className="mb-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
              {["All", ...categories].map((name) => <button key={name} onClick={() => {setCategory(name);setPage(1);}} className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition ${category === name ? "bg-violet-600 text-white" : "border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.09]"}`}>{name}</button>)}
            </div>
            {pageGames.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {pageGames.map((game) => <GameTile key={game.id} game={game} showDetails/>)}
            </div> : <div className="rounded-xl border border-white/10 bg-white/[0.03] p-10 text-center text-slate-400">No games found. Try another search or category.</div>}
            {maxPage > 1 && <div className="mt-9 flex flex-wrap items-center justify-center gap-2">
              <button disabled={page <= 1} onClick={() => {setPage((p) => Math.max(1, p - 1));scrollToLibrary();}} className="rounded-lg border border-white/10 px-4 py-2 text-sm disabled:opacity-30">← Prev</button>
              <span className="px-3 text-sm text-slate-400">Page {page} / {maxPage}</span>
              <button disabled={page >= maxPage} onClick={() => {setPage((p) => Math.min(maxPage, p + 1));scrollToLibrary();}} className="rounded-lg border border-white/10 px-4 py-2 text-sm disabled:opacity-30">Next →</button>
            </div>}
          </section>
          <footer className="mt-14 border-t border-white/10 pt-6 text-xs leading-6 text-slate-500">JUDE PLAY — Free browser games, curated collections and original games by JUDE Game Studio.</footer>
        </div>
      </div>
    </div>
  </main>;
}
