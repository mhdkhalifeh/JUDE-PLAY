import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cleanCategory = decodeURIComponent(category);

  return {
    title: `${cleanCategory} Games | JUDE Play`,
    description: `Play the best ${cleanCategory} HTML5 games online on JUDE Play.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cleanCategory = decodeURIComponent(category);

  const { data: games } = await supabase
    .from("games")
    .select("*")
    .ilike("category", cleanCategory)
    .order("plays", { ascending: false });

  return (
    <main className="min-h-screen bg-[#070914] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-white/10 bg-slate-950 p-8 shadow-2xl shadow-fuchsia-500/10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-400">
            Category
          </p>

          <h1 className="mt-4 text-5xl font-black">
            {cleanCategory} Games
          </h1>

          <p className="mt-4 text-slate-400">
            Browse {games?.length || 0} games in this category.
          </p>
        </section>

        {games && games.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {games.map((game: any) => (
              <Link key={game.id} href={`/game/${game.slug}`}>
                <div className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(124,58,237,.35)]">
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

                    <div className="absolute right-4 top-4 rounded-full bg-black/60 px-4 py-2 text-sm font-bold text-fuchsia-300 backdrop-blur">
                      🔥 {game.plays || 0}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-black">{game.title}</h3>

                    <p className="mt-3 text-sm text-slate-400">
                      {game.meta || game.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="rounded-full bg-violet-600/20 px-4 py-2 text-sm text-violet-300">
                        {game.category}
                      </span>

                      <span className="text-sm text-yellow-400">
                        ⭐ {game.rating || "5.0"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-3xl border border-white/10 bg-slate-950 p-8 text-slate-400">
            No games found in this category yet.
          </div>
        )}
      </div>
    </main>
  );
}