"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function FavoriteButton({ gameSlug }: { gameSlug: string }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorite() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .eq("game_slug", gameSlug)
        .maybeSingle();

      setIsFavorite(!!data);
      setLoading(false);
    }

    loadFavorite();
  }, [gameSlug]);

  async function toggleFavorite() {
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);

    if (isFavorite) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("game_slug", gameSlug);

      setIsFavorite(false);
    } else {
      await supabase.from("favorites").insert({
        user_id: userId,
        game_slug: gameSlug,
      });

      setIsFavorite(true);
    }

    setLoading(false);
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`rounded-xl px-5 py-3 font-bold transition ${
        isFavorite
          ? "bg-fuchsia-600 text-white hover:bg-fuchsia-500"
          : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
      }`}
    >
      {loading ? "..." : isFavorite ? "♥ Favorited" : "♡ Favorite"}
    </button>
  );
}