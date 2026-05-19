"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [recentCount, setRecentCount] = useState(0);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [recentGames, setRecentGames] = useState<any[]>([]);
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

      const { data: achievementData } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const { data: recent } = await supabase
        .from("recently_played")
        .select("game_slug")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4);

      const slugs = recent?.map((item) => item.game_slug) || [];

      if (slugs.length > 0) {
        const { data: games } = await supabase
          .from("games")
          .select("*")
          .in("slug", slugs);

        setRecentGames(games || []);
      }

      setFavoritesCount(favCount || 0);
      setRecentCount(playedCount || 0);
      setAchievements(achievementData || []);
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
        <div className="rounded-3xl border border-white/10 bg-slate-950 p-8 shadow-2xl shadow-fuchsia-500/10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-400">
                Player Profile
              </p>

              <h1 className="mt-4 text-4xl font-black">{user?.email}</h1>

              <p className="mt-3 text-slate-400">
                Welcome to your JUDE Play profile.
              </p>
            </div>

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-4xl font-black shadow-[0_0_35px_rgba(168,85,247,.45)]">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-4">
            <div className="rounded-2xl bg-white/5 p-6">
              <p className="text-sm text-slate-400">Favorite Games</p>
              <p className="mt-3 text-4xl font-black">{favoritesCount}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6">
              <p className="text-sm text-slate-400">Recently Played</p>
              <p className="mt-3 text-4xl font-black">{recentCount}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6">
              <p className="text-sm text-slate-400">Achievements</p>
              <p className="mt-3 text-4xl font-black">
                {achievements.length}
              </p>
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

        <section className="mt-10">
          <h2 className="text-3xl font-black">🏆 Achievements</h2>

          {achievements.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950 p-8 text-slate-400">
              No achievements yet. Play your first game to unlock one.
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-xl"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-2xl">
                    🏆
                  </div>

                  <h3 className="text-xl font-black">
                    {achievement.title}
                  </h3>

                  <p className="mt-3 text-sm text-slate-400">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {recentGames.length > 0 && (
          <section className="mt-10">
            <h2 className="text-3xl font-black">🕹 Recently Played</h2>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {recentGames.map((game) => (
                <Link key={game.id} href={`/game/${game.slug}`}>
                  <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 transition hover:-translate-y-2">
                    {game.image ? (
                      <img
                      loading="lazy"
                        src={game.image}
                        alt={game.title}
                        className="h-52 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-52 items-center justify-center bg-slate-900 text-slate-500">
                        No Image
                      </div>
                    )}

                    <div className="p-5">
                      <h3 className="text-xl font-black">{game.title}</h3>
                      <p className="mt-2 text-sm text-slate-400">
                        {game.meta || game.category}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}