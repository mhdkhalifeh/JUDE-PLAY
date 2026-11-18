
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

type Game = {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  description: string | null;
  meta: string | null;
  category: string | null;
  plays: number | null;
};

type RatingStats = {
  game_id: string;
  average_rating: number | string | null;
  total_ratings: number | string;
};

async function getGames() {
  const { data, error } = await supabase
    .from("games")
    .select(
      "id, title, slug, image, description, meta, category, plays"
    )
    .eq("is_published", true)
    .order("plays", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Unable to load top games:", error.message);
    return [];
  }

  return (data || []) as Game[];
}

async function getRatingStats() {
  const { data, error } = await supabase.rpc(
    "get_all_game_rating_stats"
  );

  if (error) {
    console.error("Unable to load ratings:", error.message);
    return new Map<string, RatingStats>();
  }

  return new Map<string, RatingStats>(
    ((data || []) as RatingStats[]).map((rating) => [
      rating.game_id,
      rating,
    ])
  );
}

export const metadata = {
  title: "Top 50 Browser Games | JUDE Play",
  description:
    "Explore the most played browser games on JUDE Play, including action, puzzle, racing and arcade games with real player ratings.",
  alternates: {
    canonical: "https://www.jude-play.com/top-games",
  },
};

export default async function TopGamesPage() {
  const [games, ratings] = await Promise.all([
    getGames(),
    getRatingStats(),
  ]);

  return (
    <main className="min-h-screen bg-[#070914] text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-fuchsia-400">
          JUDE PLAY RANKINGS
        </p>

        <h1 className="mt-4 text-4xl font-black md:text-5xl">
          Top 50 Browser Games
        </h1>

        <p className="mt-4 max-w-4xl leading-7 text-slate-400">
          Discover the most played games on JUDE Play.
          Explore action, puzzle, racing and arcade games,
          compare real player ratings, and find your next
          favorite game.
        </p>

        <p className="mt-3 text-sm text-slate-500">
          Ranked by total plays. Ratings are based on player votes.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {games.map((game, index) => {
            const stats = ratings.get(game.id);

            const count = Number(
              stats?.total_ratings || 0
            );

            const average =
              count > 0 && stats?.average_rating != null
                ? Number(stats.average_rating)
                : null;

            return (
              <Link
                key={game.id}
                href={`/game/${game.slug}`}
                className="group flex overflow-hidden rounded-2xl border border-white/10 bg-slate-950 transition hover:-translate-y-1 hover:border-fuchsia-500/60"
              >
                <div className="relative w-28 shrink-0 bg-slate-900 sm:w-40">
                  {game.image ? (
                    <img
                      src={game.image}
                      alt={game.title}
                      loading="lazy"
                      className="h-full min-h-44 w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full min-h-44 items-center justify-center text-xs text-slate-500">
                      No Image
                    </div>
                  )}

                  <span className="absolute left-2 top-2 rounded-lg bg-black/80 px-3 py-1 text-sm font-black text-white">
                    #{index + 1}
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between p-4 sm:p-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-fuchsia-400">
                      {game.category || "Gaming"}
                    </p>

                    <h2 className="mt-2 line-clamp-2 text-lg font-black transition group-hover:text-fuchsia-300 sm:text-xl">
                      {game.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                      {game.description ||
                        game.meta ||
                        "Explore this game on JUDE Play."}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="font-semibold text-fuchsia-400">
                      ▶ {Number(game.plays || 0).toLocaleString()} plays
                    </span>

                    <span className="font-bold text-amber-400">
                      {average !== null
                        ? `★ ${average.toFixed(1)} (${count})`
                        : "☆ Not Rated"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {games.length === 0 && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-slate-950 p-10 text-center">
            <p className="text-slate-400">
              No games available yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
