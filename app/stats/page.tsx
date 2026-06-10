import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

async function getStats() {
  const { data: games } = await supabase.from("games").select("*");

  const totalGames = games?.length || 0;

  const totalPlays =
    games?.reduce((sum, game: any) => sum + (game.plays || 0), 0) || 0;

  const categories = [
    ...new Set(games?.map((game: any) => game.category).filter(Boolean)),
  ];

  const sortedGames = [...(games || [])].sort(
    (a: any, b: any) => (b.plays || 0) - (a.plays || 0)
  );

  const mostPlayed = sortedGames[0];
  const topGames = sortedGames.slice(0, 10);

  return {
    totalGames,
    totalPlays,
    totalCategories: categories.length,
    mostPlayed,
    topGames,
  };
}

export const metadata = {
  title: "JUDE Play Stats | Free Browser Games",
  description:
    "View JUDE Play gaming statistics including total games, total plays, categories, top games and the most popular browser games.",
};

export default async function StatsPage() {
  const stats = await getStats();

  return (
    <main className="min-h-screen bg-[#070914] text-white">
      <div className="mx-auto max-w-7xl px-8 py-12">
        <p className="font-bold uppercase tracking-[0.3em] text-fuchsia-400">
          JUDE PLAY STATS
        </p>

        <h1 className="mt-4 text-5xl font-black">Platform Statistics</h1>

        <p className="mt-4 max-w-4xl text-slate-400">
          Explore JUDE Play statistics, including the number of available
          games, total plays, categories and the most popular games on the
          platform.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-slate-950 p-8">
            <p className="text-slate-400">Total Games</p>
            <h2 className="mt-3 text-5xl font-black">{stats.totalGames}</h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950 p-8">
            <p className="text-slate-400">Total Plays</p>
            <h2 className="mt-3 text-5xl font-black">{stats.totalPlays}</h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950 p-8">
            <p className="text-slate-400">Categories</p>
            <h2 className="mt-3 text-5xl font-black">
              {stats.totalCategories}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950 p-8">
            <p className="text-slate-400">Most Played</p>
            <h2 className="mt-3 line-clamp-2 text-2xl font-black">
              {stats.mostPlayed?.title || "No games yet"}
            </h2>
          </div>
        </div>

        {stats.mostPlayed && (
          <section className="mt-12 rounded-3xl border border-white/10 bg-slate-950 p-8">
            <h2 className="text-3xl font-black">Most Popular Game</h2>

            <p className="mt-4 text-slate-300">
              The current most played game on JUDE Play is{" "}
              <strong>{stats.mostPlayed.title}</strong>, with{" "}
              <strong>{stats.mostPlayed.plays || 0}</strong> plays.
            </p>

            <Link
              href={`/game/${stats.mostPlayed.slug}`}
              className="mt-6 inline-block rounded-xl bg-fuchsia-600 px-5 py-3 font-bold transition hover:bg-fuchsia-500"
            >
              Play {stats.mostPlayed.title}
            </Link>
          </section>
        )}

        <section className="mt-12 rounded-3xl border border-white/10 bg-slate-950 p-8">
          <h2 className="text-3xl font-black">Top 10 Games</h2>

          <div className="mt-8 grid gap-4">
            {stats.topGames.map((game: any, index: number) => (
              <Link
                key={game.id}
                href={`/game/${game.slug}`}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-fuchsia-500 hover:bg-white/10"
              >
                <div>
                  <h3 className="text-xl font-black">
                    #{index + 1} {game.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                    {game.description ||
                      game.meta ||
                      `Play ${game.title} online for free on JUDE Play.`}
                  </p>
                </div>

                <div className="ml-6 shrink-0 rounded-xl bg-fuchsia-600/20 px-4 py-2 text-fuchsia-300">
                  🔥 {game.plays || 0}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-slate-950 p-8">
          <h2 className="text-3xl font-black">About JUDE Play Growth</h2>

          <div className="mt-6 space-y-5 leading-8 text-slate-300">
            <p>
              JUDE Play is continuously growing with new HTML5 browser games
              added across multiple categories. Our goal is to provide a fast,
              simple and enjoyable gaming experience for players worldwide.
            </p>

            <p>
              These statistics help players discover popular games and
              understand how the JUDE Play library is expanding over time.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}