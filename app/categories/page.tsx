import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

async function getCategories() {
  const { data } = await supabase
    .from("games")
    .select("category");

  if (!data) return [];

  const categories = [
    ...new Set(
      data
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  return categories.sort();
}

export const metadata = {
  title: "Game Categories | JUDE Play",
  description:
    "Browse all game categories on JUDE Play including action, racing, puzzle, adventure, arcade, sports and more.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-[#070914] text-white">
      <div className="mx-auto max-w-7xl px-8 py-12">
        <p className="font-bold uppercase tracking-[0.3em] text-fuchsia-400">
          CATEGORIES
        </p>

        <h1 className="mt-4 text-5xl font-black">
          Browse Game Categories
        </h1>

        <p className="mt-4 max-w-4xl text-slate-400">
          Explore all game categories available on JUDE Play. Discover action,
          arcade, puzzle, racing, sports, adventure and many more free browser
          games.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category: string) => (
            <Link
              key={category}
              href={`/category/${encodeURIComponent(category)}`}
              className="rounded-3xl border border-white/10 bg-slate-950 p-8 text-center transition hover:-translate-y-1 hover:border-fuchsia-500"
            >
              <h2 className="text-2xl font-black">
                {category}
              </h2>

              <p className="mt-3 text-sm text-slate-400">
                Explore {category} games
              </p>
            </Link>
          ))}
        </div>

        <section className="mt-16 rounded-3xl border border-white/10 bg-slate-950 p-8">
          <h2 className="text-3xl font-black">
            About Our Categories
          </h2>

          <div className="mt-6 space-y-5 leading-8 text-slate-300">
            <p>
              JUDE Play offers a wide variety of browser games designed for
              players of all ages. Our collection includes action games,
              puzzle games, racing games, arcade games, sports games and many
              other genres.
            </p>

            <p>
              Every category contains carefully selected HTML5 games that can
              be played instantly without downloads or installations. Whether
              you prefer quick casual games or longer gaming sessions, you will
              find something enjoyable in our growing library.
            </p>

            <p>
              New games and categories are added regularly to ensure fresh
              content and a better gaming experience for our visitors.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}