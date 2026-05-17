"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [recentCount, setRecentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUser(user);

      const { count: favCount } = await supabase
        .from("favorites")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { count: playedCount } = await supabase
        .from("recently_played")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      setFavoritesCount(favCount || 0);
      setRecentCount(playedCount || 0);
      setLoading(false);
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070914] text-white">
        Loading Profile...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#070914] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-white/10 bg-slate-950 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-400">
                Player Profile
              </p>

              <h1 className="mt-4 text-4xl font-black">
                {user?.email}
              </h1>

              <p className="mt-3 text-slate-400">
                Welcome to your JUDE Play profile.
              </p>
            </div>

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-4xl font-black">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white/5 p-6">
              <p className="text-sm text-slate-400">Favorite Games</p>
              <p className="mt-3 text-4xl font-black">{favoritesCount}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6">
              <p className="text-sm text-slate-400">Recently Played</p>
              <p className="mt-3 text-4xl font-black">{recentCount}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6">
              <p className="text-sm text-slate-400">Account Status</p>
              <p className="mt-3 text-4xl font-black text-green-400">
                Active
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/favorites"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 font-bold"
            >
              View Favorites
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-bold hover:bg-white/10"
            >
              Browse Games
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}