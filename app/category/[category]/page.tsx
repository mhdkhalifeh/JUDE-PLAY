
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

type Game = {
  id: string;
  slug: string;
  title: string;
  image: string | null;
  meta: string | null;
  description: string | null;
  category: string | null;
  plays: number | null;
};

type RatingStats = {
  game_id: string;
  average_rating: number | string | null;
  total_ratings: number | string;
};

type PageProps = {
  params: Promise<{ category: string }>;
};

function getCategoryName(category: string) {
  try {
    return decodeURIComponent(category);
  } catch {
    return category;
  }
}

export async function generateMetadata({
  params,
}: PageProps) {
  const { category } = await params;
  const cleanCategory = getCategoryName(category);

  return {
    title: `${cleanCategory} Games | JUDE Play`,
    description:
      `Play ${cleanCategory} HTML5 games online for free on JUDE Play.`,
    alternates: {
      canonical:
        `https://www.jude-play.com/category/${encodeURIComponent(cleanCategory)}`,
    },
  };
}

async function getRatingStats() {
  const { data, error } = await supabase.rpc(
    "get_all_game_rating_stats"
  );

  if (error) {
    console.error(
      "Error loading game ratings:",
      error.message
    );

    return new Map<string, RatingStats>();
  }

  return new Map<string, RatingStats>(
    ((data || []) as RatingStats[]).map((item) => [
      item.game_id,
      item,
    ])
  );
}

export default async function CategoryPage({
  params,
}: PageProps) {
  const { category } = await params;
  const cleanCategory = getCategoryName(category);

  const [gamesResult, ratings] = await Promise.all([
    supabase
      .from("games")
      .select(
        "id, slug, title, image, meta, description, category, plays"
      )
      .eq("is_published", true)
      .ilike("category", cleanCategory)
      .order("plays", { ascending: false }),

    getRatingStats(),
  ]);

  if (gamesResult.error) {
    console.error(
      "Error loading category games:",
      gamesResult.error.message
    );
  }

  const games = (gamesResult.data || []) as Game[];

  return (
    <main className="min-h-screen bg-[#070914] p-5 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-fuchsia-500/10 md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-400">
            Category
          </p>

          <h1 className="mt-4 text-4xl font-black md:text-5xl">
            {cleanCategory} Games
          </h1>

          <p className="mt-4 text-slate-400">
            Browse {games.length} games in this category.
          </p>
        </section>

        {games.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {games.map((game) => {
              const stats = ratings.get(game.id);

              const count = Number(
                stats?.total_ratings || 0
              );

              const average =
                count > 0 &&
                stats?.average_rating != null
                  ? Number(stats.average_rating)
                  : null;

              return (
                <Link
                  key={game.id}
                  href={`/game/${game.slug}`}
                  className="block h-full"
                >
                  <article className="group h-full overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(124,58,237,.35)]">
                    <div className="relative h-56 overflow-hidden">
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

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                      <div className="absolute right-4 top-4 rounded-full bg-black/60 px-4 py-2 text-sm font-bold text-fuchsia-300 backdrop-blur">
                        ▶ {Number(game.plays || 0).toLocaleString()}
                      </div>
                    </div>

                    <div className="p-6">
                      <h2 className="line-clamp-2 text-2xl font-black">
                        {game.title}
                      </h2>

                      <p className="mt-3 line-clamp-3 text-sm text-slate-400">
                        {game.meta ||
                          game.description ||
                          `Play ${game.title} on JUDE Play.`}
                      </p>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-full bg-violet-600/20 px-4 py-2 text-sm text-violet-300">
                          {game.category || "Game"}
                        </span>

                        <span className="text-sm font-bold text-yellow-400">
                          {average !== null
                            ? `★ ${average.toFixed(1)} (${count})`
                            : "☆ Not Rated"}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 rounded-3xl border border-white/10 bg-slate-950 p-8 text-slate-400">
            No games found in this category yet.
          </div>
        )}
      </div>
    </main>
  );
}
