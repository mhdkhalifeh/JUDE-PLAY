import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

async function getGames() {
  const { data } = await supabase
    .from("games")
    .select("*")
    .order("plays", { ascending: false })
    .limit(50);

  return data || [];
}

export const metadata = {
  title: "Top 50 Browser Games | JUDE Play",
  description:
    "Discover the most popular browser games on JUDE Play. Play the best action, racing, puzzle and arcade games online for free.",
};

export default async function TopGamesPage() {
  const games = await getGames();

  return (
    <main className="min-h-screen bg-[#070914] text-white">
      <div className="mx-auto max-w-7xl px-8 py-12">
        <h1 className="text-5xl font-black">
          Top 50 Browser Games
        </h1>

        <p className="mt-4 max-w-4xl text-slate-400">
          Explore the most played games on JUDE Play. This list includes
          action games, puzzle games, racing games, sports games and many
          other exciting browser titles.
        </p>

        <div className="mt-10 space-y-4">
          {games.map((game, index) => (
            <Link
              key={game.id}
              href={`/game/${game.slug}`}
              className="block rounded-2xl border border-white/10 bg-slate-950 p-5 hover:border-fuchsia-500"
            >
              <h2 className="text-2xl font-bold">
                #{index + 1} {game.title}
              </h2>

              <p className="mt-2 text-slate-400">
                {game.description ||
                  game.meta ||
                  `Play ${game.title} online for free on JUDE Play.`}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}