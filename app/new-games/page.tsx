import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

async function getNewGames() {
  const { data } = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return data || [];
}

export const metadata = {
  title: "New Browser Games | JUDE Play",
  description:
    "Play the newest free browser games on JUDE Play. Discover fresh HTML5 games added recently across action, puzzle, racing, arcade and more.",
};

export default async function NewGamesPage() {
  const games = await getNewGames();

  return (
    <main className="min-h-screen bg-[#070914] text-white">
      <div className="mx-auto max-w-7xl px-8 py-12">
        <p className="font-bold uppercase tracking-[0.3em] text-fuchsia-400">
          NEW GAMES
        </p>

        <h1 className="mt-4 text-5xl font-black">
          New Browser Games
        </h1>

        <p className="mt-4 max-w-4xl text-slate-400">
          Discover the latest games added to JUDE Play. Play new action,
          puzzle, racing, arcade, adventure and casual browser games instantly
          without downloads.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {games.map((game: any) => (
            <Link
              key={game.id}
              href={`/game/${game.slug}`}
              className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 transition hover:-translate-y-1 hover:border-fuchsia-500"
            >
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
                <h2 className="line-clamp-1 text-xl font-black">
                  {game.title}
                </h2>

                <p className="mt-2 line-clamp-3 text-sm text-slate-400">
                  {game.description ||
                    game.meta ||
                    `Play ${game.title} online for free on JUDE Play.`}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="rounded-full bg-violet-600/20 px-4 py-2 text-sm text-violet-300">
                    {game.category || "Game"}
                  </span>

                  <span className="text-sm text-yellow-400">
                    ⭐ {game.rating || "5.0"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}