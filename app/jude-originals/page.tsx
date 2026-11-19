import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

export const metadata: Metadata = {
  title: "JUDE Originals | Games by JUDE Game Studio | JUDE Play",
  description:
    "Discover original browser games from JUDE Game Studio: JUDE Space Shooter, LAHZA timing challenge, and JUDOKU logic puzzles.",
  alternates: { canonical: "https://www.jude-play.com/jude-originals" },
};

const SHOOTER_URL = "https://jude-space-shooter.vercel.app/";
const SHOOTER_IMAGE = "/images/jude-space-shooter.webp";

type OriginalGame = {
  slug: string;
  title: string;
  image: string | null;
  description: string | null;
};

async function getOriginalGames(): Promise<OriginalGame[]> {
  const { data, error } = await supabase
    .from("games")
    .select("slug,title,image,description")
    .eq("is_published", true)
    .in("slug", ["lahza", "judoku"]);

  if (error) {
    console.error("Could not load JUDE originals:", error.message);
    return [];
  }
  return data ?? [];
}

const featured = [
  {
    name: "JUDE Space Shooter",
    label: "Arcade space combat",
    description:
      "Pilot a spacecraft through enemy waves, survive boss encounters, and collect upgrades across increasingly demanding stages.",
    features: ["Enemy waves and bosses", "Weapon upgrades", "Survival challenges"],
  },
  {
    name: "LAHZA",
    label: "Precision timing challenge",
    description:
      "Try to stop a timer at the exact target. Choose whether to see the clock or rely on your sense of time, then tackle more precise targets.",
    features: ["Visible and hidden timer modes", "Increasing difficulty", "Precision targets"],
  },
  {
    name: "JUDOKU",
    label: "Logic puzzles",
    description:
      "Solve grid puzzles by deciding where each child belongs. Mark impossible cells, avoid costly mistakes, and advance through new challenges.",
    features: ["Logic-based grids", "Three-heart challenge", "Hints and daily puzzles"],
  },
] as const;

export default async function JudeOriginalsPage() {
  const games = await getOriginalGames();
  const lahza = games.find((game) => game.slug === "lahza");
  const judoku = games.find((game) => game.slug === "judoku");

  const cards = [
    {
      ...featured[0],
      href: SHOOTER_URL,
      image: SHOOTER_IMAGE,
      external: true,
    },
    {
      ...featured[1],
      href: lahza ? `/game/${lahza.slug}` : null,
      image: lahza?.image ?? null,
      external: false,
    },
    {
      ...featured[2],
      href: judoku ? `/game/${judoku.slug}` : null,
      image: judoku?.image ?? null,
      external: false,
    },
  ];

  return (
    <main className="min-h-screen bg-[#0d0e16] px-4 pb-20 pt-9 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="mb-7 text-sm text-slate-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-violet-300">JUDE Originals</span>
        </nav>

        <header className="relative mb-9 overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-[#1f163b] via-[#11162a] to-[#071725] px-6 py-10 sm:px-10 sm:py-14">
          <div className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full bg-fuchsia-600/15 blur-3xl" />
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-300">Made by JUDE Game Studio</p>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">JUDE Originals</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Explore games created by JUDE Game Studio, from space combat and precision timing to thoughtful logic puzzles. Each original brings a different kind of challenge to JUDE Play.
          </p>
          <p className="mt-4 text-sm text-slate-400">Play in your browser. No downloads required.</p>
        </header>

        <section aria-labelledby="original-games-title">
          <div className="mb-5">
            <h2 id="original-games-title" className="text-2xl font-black sm:text-3xl">Explore our games</h2>
            <p className="mt-2 text-sm text-slate-400">Three original experiences. Choose your next challenge.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((game) => (
              <article key={game.name} className="flex overflow-hidden rounded-3xl border border-white/10 bg-[#151725] shadow-xl shadow-black/15 flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0b1020]">
                  {game.image ? (
                    <img src={game.image} alt={`${game.name} game cover`} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl">🎮</div>
                  )}
                  <span className="absolute left-4 top-4 rounded-full border border-cyan-300/20 bg-black/70 px-3 py-1 text-[11px] font-extrabold tracking-wider text-cyan-300">JUDE ORIGINAL</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-violet-300">{game.label}</p>
                  <h3 className="mt-2 text-2xl font-black">{game.name}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-300">{game.description}</p>
                  <ul className="mt-5 space-y-2 text-sm text-slate-400">
                    {game.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2"><span className="text-cyan-400" aria-hidden="true">✦</span>{feature}</li>
                    ))}
                  </ul>
                  {game.href ? (
                    game.external ? (
                      <a href={game.href} target="_blank" rel="noopener noreferrer" className="mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-3 text-center text-sm font-extrabold text-white transition hover:brightness-110">
                        Play {game.name} ↗
                      </a>
                    ) : (
                      <Link href={game.href} className="mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-3 text-center text-sm font-extrabold text-white transition hover:brightness-110">
                        Play {game.name} →
                      </Link>
                    )
                  ) : (
                    <p className="mt-6 rounded-xl border border-white/10 px-5 py-3 text-center text-sm text-slate-400">Not currently available</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-[#151725] p-6 sm:p-9">
          <h2 className="text-2xl font-black">Why JUDE Originals?</h2>
          <p className="mt-4 max-w-4xl text-sm leading-8 text-slate-300 sm:text-base">
            JUDE Game Studio develops its own browser game experiences with different goals and mechanics. You can test reaction and movement in Space Shooter, challenge your sense of timing in LAHZA, or practice deduction in JUDOKU. These titles are distinct from third-party games available elsewhere in our catalog.
          </p>
          <Link href="/" className="mt-6 inline-flex rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">Browse all games →</Link>
        </section>
      </div>
    </main>
  );
}
