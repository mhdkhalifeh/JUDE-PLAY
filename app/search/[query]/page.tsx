
import Link from "next/link";
import type { Metadata } from "next";
import { supabase } from "@/app/lib/supabase";

type PageProps = {
  params: Promise<{ query: string }>;
};

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

function getSearchTerm(query: string) {
  try {
    return decodeURIComponent(query).trim();
  } catch {
    return query.trim();
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { query } = await params;
  const cleanQuery = getSearchTerm(query);

  return {
    title: `Search ${cleanQuery} Games | JUDE Play`,
    description:
      `Find and play ${cleanQuery} HTML5 browser games on JUDE Play.`,
    robots: {
      index: false,
      follow: true,
    },
  };
}

async function getRatingStats() {
  const { data, error } = await supabase.rpc(
    "get_all_game_rating_stats"
  );

  if (error) {
    console.error(
      "Unable to load ratings:",
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

export default async function SearchPage({
  params,
}: PageProps) {
  const { query } = await params;
  const cleanQuery = getSearchTerm(query);

  let games: Game[] = [];
  let searchError = false;

  const ratingsPromise = getRatingStats();

  if (cleanQuery) {
    // Escape characters used by PostgREST filter syntax.
    const safeQuery = cleanQuery
      .slice(0, 100)
      .replace(/[%,().*\\"]/g, " ")
      .trim();

    if (safeQuery) {
      const { data, error } = await supabase
        .from("games")
        .select(
          "id, slug, title, image, meta, description, category, plays"
        )
        .eq("is_published", true)
        .or(
          `title.ilike.%${safeQuery}%,category.ilike.%${safeQuery}%,meta.ilike.%${safeQuery}%,description.ilike.%${safeQuery}%`
        )
        .order("plays", { ascending: false });

      if (error) {
        console.error("Search error:", error.message);
        searchError = true;
      } else {
        games = (data || []) as Game[];
      }
    }
  }

  const ratings = await ratingsPromise;

  return (
    <main className="min-h-screen bg-[#070914] p-5 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-white/10 bg-slate-950 p-6 md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-400">
            Search Results
          </p>

          <h1 className="mt-4 break-words text-4xl font-black md:text-5xl">
            {cleanQuery
              ? `${cleanQuery} Games`
              : "Search Games"}
          </h1>

          <p className="mt-4 text-slate-400">
            Found {games.length} games matching your search.
          </p>
        </section>

        {searchError && (
          <div
            role="alert"
            className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300"
          >
            Unable to load search results. Please try again.
          </div>
        )}

        {!searchError && games.length > 0 ? (
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
                    </div>

                    <div className="p-6">
                      <h2 className="line-clamp-2 text-2xl font-black">
                        {game.title}
                      </h2>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
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
        ) : !searchError ? (
          <div className="mt-12 rounded-3xl border border-white/10 bg-slate-950 p-8 text-slate-400">
            No games found for this search.
          </div>
        ) : null}
      </div>
    </main>
  );
}
