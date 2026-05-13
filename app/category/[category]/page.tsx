import Link from "next/link";
import { games } from "@/app/data/games";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const filteredGames = games.filter(
    (game) => game.category.toLowerCase() === category.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#070914] text-white p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-black">
          {category} Games
        </h1>

        <p className="mt-3 text-slate-400">
          Browse all {category} games on JUDE Play.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {filteredGames.map((game) => (
            <Link key={game.slug} href={`/game/${game.slug}`}>
              <div className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(124,58,237,.35)]">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-black">{game.title}</h3>
                  <p className="mt-3 text-sm text-slate-400">{game.meta}</p>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="rounded-full bg-violet-600/20 px-4 py-2 text-sm text-violet-300">
                      {game.category}
                    </span>
                    <span className="text-sm text-yellow-400">
                      ⭐ {game.rating}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="mt-12 rounded-3xl border border-white/10 bg-slate-950 p-8 text-slate-400">
            No games found in this category yet.
          </div>
        )}

      </div>
    </div>
  );
}