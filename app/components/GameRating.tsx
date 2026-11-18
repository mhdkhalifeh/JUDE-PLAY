
"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";

type Props = {
  gameId: string;
};

export default function GameRating({ gameId }: Props) {
  const [userId, setUserId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [average, setAverage] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStats() {
      const { data, error } = await supabase.rpc(
        "get_game_rating_stats",
        { p_game_id: gameId }
      );

      if (!active) return;

      if (error) {
        setMessage("Unable to load ratings.");
        return;
      }

      const stats = data?.[0];

      setAverage(
        stats?.average_rating == null
          ? null
          : Number(stats.average_rating)
      );

      setCount(Number(stats?.total_ratings || 0));
    }

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      setUserId(user?.id || null);

      if (user) {
        const { data } = await supabase
          .from("game_ratings")
          .select("rating")
          .eq("game_id", gameId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (active) {
          setRating(data?.rating || 0);
        }
      } else {
        setRating(0);
      }

      if (active) setLoading(false);
    }

    async function initialize() {
      await Promise.all([loadStats(), loadUser()]);
    }

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [gameId]);

  async function submitRating(value: number) {
    if (!userId || saving) return;

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("game_ratings")
      .upsert(
        {
          game_id: gameId,
          user_id: userId,
          rating: value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "game_id,user_id" }
      );

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setRating(value);
    setMessage("Your rating has been saved!");

    const { data, error: statsError } = await supabase.rpc(
      "get_game_rating_stats",
      { p_game_id: gameId }
    );

    if (!statsError) {
      const stats = data?.[0];
      setAverage(
        stats?.average_rating == null
          ? null
          : Number(stats.average_rating)
      );
      setCount(Number(stats?.total_ratings || 0));
    }

    setSaving(false);
  }

  return (
    <div className="rounded-2xl bg-white/5 p-5">
      <p className="text-sm text-slate-400">
        Player Rating
      </p>

      <div className="mt-3 flex items-center gap-2">
        <Star
          size={25}
          className="fill-amber-400 text-amber-400"
        />

        <span className="text-3xl font-black">
          {count > 0 && average !== null
            ? average.toFixed(1)
            : "Not Rated"}
        </span>
      </div>

      <p className="mt-2 text-xs text-slate-400">
        {count} {count === 1 ? "rating" : "ratings"}
      </p>

      {!loading && userId && (
        <div className="mt-5">
          <p className="mb-2 text-xs text-slate-400">
            {rating
              ? "Your rating — click to change"
              : "Rate this game"}
          </p>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                disabled={saving}
                onClick={() => submitRating(star)}
                aria-label={`Rate ${star} stars`}
                className="transition hover:scale-110 disabled:opacity-50"
              >
                <Star
                  size={25}
                  className={
                    star <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-500 hover:text-amber-300"
                  }
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && !userId && (
        <p className="mt-4 text-xs text-slate-400">
          <Link
            href="/login"
            className="font-bold text-fuchsia-400 hover:underline"
          >
            Log in
          </Link>{" "}
          to rate this game.
        </p>
      )}

      {loading && (
        <p className="mt-4 text-xs text-slate-500">
          Loading ratings...
        </p>
      )}

      {message && (
        <p
          role="status"
          className="mt-3 text-xs text-cyan-300"
        >
          {message}
        </p>
      )}
    </div>
  );
}
