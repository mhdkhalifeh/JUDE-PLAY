"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

export default function FavoritesPage() {
  const [favoriteGames, setFavoriteGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: favorites } = await supabase
        .from("favorites")
        .select("game_slug")
        .eq("user_id", user.id);

      const slugs = favorites?.map((item) => item.game_slug) || [];

      if (slugs.length === 0) {
        setFavoriteGames([]);
        setLoading(false);
        return;
      }

      const { data: games } = await supabase
        .from("games")
        .select("*")
        .in("slug", slugs);

      setFavoriteGames(games || []);
      setLoading(false);
    }

    loadFavorites();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070914] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070914] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-5xl font-black">My Favorites</h1>

        <p className="mt-3 text-slate-400">
          Your saved games on JUDE Play.
        </p>

        {favoriteGames.length === 0 && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-slate-950 p-8 text-slate-400">
            No favorite games yet.
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {favoriteGames.map((game) => (
            <Link key={game.slug} href={`/game/${game.slug}`}>
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl transition hover:-translate-y-2">
                {game.image ? (
                  <img
                    src={game.image}
                    alt={game.title}
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-slate-900 text-slate-500">
                    No Image
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-2xl font-black">{game.title}</h3>
                  <p className="mt-3 text-sm text-slate-400">
                    {game.meta || game.category}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}          