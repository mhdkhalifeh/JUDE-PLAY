
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

type Game = {
  id: string;
  slug: string;
  title: string;
  image: string | null;
  description: string | null;
  meta: string | null;
  category: string | null;
};

type RatingStats = {
  game_id: string;
  average_rating: number | string | null;
  total_ratings: number | string;
};

async function getNewGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from("games")
    .select(
      "id, slug, title, image, description, meta, category"
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error loading new games:", error.message);
    return [];
  }

  return (data || []) as Game[];
}

async function getRatingStats() {
  const { data, error } = await supabase.rpc(
    "get_all_game_rating_stats"
  );

  if (error) {
    console.error("Error loading ratings:", error.message);
    return new Map<string, RatingStats>();
  }

  return new Map<string, RatingStats>(
    ((data || []) as RatingStats[]).map((item) => [
      item.game_id,
      item,
    ])
  );
}

export const metadata = {
  title: "New Browser Games | JUDE Play",
  description:
    "Play the newest free browser games on JUDE Play. Discover fresh HTML5 games across action, puzzle, racing, arcade and more.",
  alternates: {
    canonical: "https://www.jude-play.com/new-games",
  },
};

export default async function NewGamesPage() {
  const [games, ratings] = await Promise.all([
    getNewGames(),
    getRatingStats(),
  ]);

  return (
    <main className="min-h-screen bg-[#070914] text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <p className="font-bold uppercase tracking-[0.3em] text-fuchsia-400">
          NEW GAMES
        </p>

        <h1 className="mt-4 text-4xl font-black md:text-5xl">
          New Browser Games
        </h1>

        <p className="mt-4 max-w-4xl leading-7 text-slate-400">
          Discover the latest games added to JUDE Play.
          Play new action, puzzle, racing, arcade, adventure
          and casual browser games instantly without downloads.
        </p>

        <p className="mt-3 text-sm text-slate-500">
          Sorted by newest additions. Ratings are based on real player votes.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {games.map((game) => {
            const stats = ratings.get(game.id);

            const count = Number(stats?.total_ratings || 0);

            const average =
              count > 0 && stats?.average_rating != null
                ? Number(stats.average_rating)
                : null;

            return (
              <Link
                key={game.id}
                href={`/game/${game.slug}`}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-950 transition hover:-translate-y-1 hover:border-fuchsia-500"
              >
                {game.image ? (
                  <div className="overflow-hidden">
                    <img
                      loading="lazy"
                      src={game.image}
                      alt={game.title}
                      className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex h-52 items-center justify-center bg-slate-900 text-slate-500">
                    No Image
                  </div>
                )}

                <div className="p-5">
                  <h2 className="line-clamp-1 text-xl font-black">
                    {game.title}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm text-slate-400">
                    {game.description ||
                      game.meta ||
                      `Play ${game.title} online for free on JUDE Play.`}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-violet-600/20 px-4 py-2 text-sm text-violet-300">
                      {game.category || "Game"}
                    </span>

                    <span className="shrink-0 text-sm font-bold text-yellow-400">
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
