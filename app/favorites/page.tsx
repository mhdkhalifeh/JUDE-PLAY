
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

type Game = {
  id: string;
  slug: string;
  title: string;
  image: string | null;
  meta: string | null;
  category: string | null;
  plays: number | null;
};

type RatingStats = {
  game_id: string;
  average_rating: number | string | null;
  total_ratings: number | string;
};

export default function FavoritesPage() {
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);
  const [ratings, setRatings] = useState<
    Record<string, RatingStats>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadFavorites() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!active) return;

      if (authError || !user) {
        window.location.replace("/login");
        return;
      }

      const { data: favorites, error: favoritesError } =
        await supabase
          .from("favorites")
          .select("game_slug")
          .eq("user_id", user.id);

      if (!active) return;

      if (favoritesError) {
        setError("Unable to load your favorites.");
        setLoading(false);
        return;
      }

      const slugs = [
        ...new Set(
          (favorites || [])
            .map((item) => item.game_slug)
            .filter(Boolean)
        ),
      ];

      if (slugs.length === 0) {
        setFavoriteGames([]);
        setLoading(false);
        return;
      }

      const [gamesResult, ratingsResult] =
        await Promise.all([
          supabase
            .from("games")
            .select(
              "id, slug, title, image, meta, category, plays"
            )
            .eq("is_published", true)
            .in("slug", slugs),

          supabase.rpc("get_all_game_rating_stats"),
        ]);

      if (!active) return;

      if (gamesResult.error) {
        setError("Unable to load your favorite games.");
        setLoading(false);
        return;
      }

      const games = (gamesResult.data || []) as Game[];

      // Preserve the order of the saved favorites.
      const gamesBySlug = new Map(
        games.map((game) => [game.slug, game])
      );

      const orderedGames = slugs
        .map((slug) => gamesBySlug.get(slug))
        .filter((game): game is Game => Boolean(game));

      setFavoriteGames(orderedGames);

      if (ratingsResult.error) {
        console.error(
          "Unable to load game ratings:",
          ratingsResult.error.message
        );
      } else {
        const ratingMap: Record<string, RatingStats> = {};

        for (const item of
          (ratingsResult.data || []) as RatingStats[]) {
          ratingMap[item.game_id] = item;
        }

        setRatings(ratingMap);
      }

      setLoading(false);
    }

    loadFavorites();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070914] text-white">
        Loading favorites...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#070914] p-5 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-fuchsia-400">
          JUDE PLAY COLLECTION
        </p>

        <h1 className="mt-4 text-4xl font-black md:text-5xl">
          My Favorites
        </h1>

        <p className="mt-3 text-slate-400">
          Your saved games on JUDE Play.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {!error && favoriteGames.length === 0 && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-slate-950 p-8 text-slate-400">
            <p>No favorite games yet.</p>

            <Link
              href="/"
              className="mt-4 inline-block text-sm font-bold text-fuchsia-400 hover:underline"
            >
              Explore games →
            </Link>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {favoriteGames.map((game) => {
            const stats = ratings[game.id];

            const count = Number(
              stats?.total_ratings || 0
            );

            const average =
              count > 0 && stats?.average_rating != null
                ? Number(stats.average_rating)
                : null;

            return (
              <Link
                key={game.slug}
                href={`/game/${game.slug}`}
                className="block h-full"
              >
                <article className="group h-full overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl transition duration-300 hover:-translate-y-2 hover:border-fuchsia-500/50">
                  {game.image ? (
                    <div className="overflow-hidden">
                      <img
                        loading="lazy"
                        src={game.image}
                        alt={game.title}
                        className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-slate-900 text-slate-500">
                      No Image
                    </div>
                  )}

                  <div className="p-6">
                    <h2 className="line-clamp-2 text-2xl font-black">
                      {game.title}
                    </h2>

                    <p className="mt-3 line-clamp-2 text-sm text-slate-400">
                      {game.meta ||
                        game.category ||
                        "Play this game on JUDE Play."}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-fuchsia-400">
                        ▶{" "}
                        {Number(
                          game.plays || 0
                        ).toLocaleString()}
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
      </div>
    </main>
  );
}
