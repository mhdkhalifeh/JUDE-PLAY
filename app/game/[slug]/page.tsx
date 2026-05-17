import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import FavoriteButton from "@/app/components/FavoriteButton";
async function getGame(slug: string) {
  const { data } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .single();

  return data;
}

async function getRelatedGames(category: string, slug: string) {
  const { data } = await supabase
    .from("games")
    .select("*")
    .eq("category", category)
    .neq("slug", slug)
    .limit(4);

  return data || [];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!game) {
    return {
      title: "Game Not Found | JUDE Play",
    };
  }

  return {
    title: `${game.title} | JUDE Play`,
    description:
      game.description ||
      "Play the best HTML5 games instantly on JUDE Play.",

    openGraph: {
      title: `${game.title} | JUDE Play`,
      description: game.description,
      images: [game.image],
    },
  };
}
async function saveRecentlyPlayed(slug: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("recently_played").delete()
    .eq("user_id", user.id)
    .eq("game_slug", slug);

  await supabase.from("recently_played").insert({
    user_id: user.id,
    game_slug: slug,
  });
}
export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const game = await getGame(slug);

  if (!game) {
  return (
    ...
  );
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: game.title,
  description: game.description || game.meta,
  image: game.image,
  url: `https://jude-play.vercel.app/game/${game.slug}`,
  genre: game.category,
  applicationCategory: "Game",
  operatingSystem: "Web Browser",
};

const relatedGames = await getRelatedGames(game.category, game.slug);
      <main className="min-h-screen bg-[#050816] text-white">
       <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>

        <div className="mx-auto max-w-7xl p-8">
          <div className="rounded-3xl border border-white/10 bg-slate-950 p-8">
            <h1 className="text-4xl font-black">Game Not Found</h1>
            <p className="mt-4 text-slate-400">
              This game does not exist.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-fuchsia-600 px-5 py-3 font-bold"
            >
              Back Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const relatedGames = await getRelatedGames(game.category, game.slug);

  await supabase
    .from("games")
    .update({
      plays: (game.plays || 0) + 1,
    })
    .eq("slug", game.slug);

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      <div className="mx-auto max-w-7xl p-6 md:p-8">
        <div className="mb-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-400">
            {game.category}
          </p>

          <h1 className="text-4xl font-black md:text-5xl">
            {game.title}
          </h1>

          <p className="mt-4 max-w-3xl text-slate-300">
            {game.description}
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl shadow-fuchsia-500/10">
          {game.game_url ? (
            <iframe
              src={game.game_url}
              title={game.title}
              className="h-[80vh] w-full border-0"
              allowFullScreen
            />
          ) : (
            <div className="flex h-[70vh] items-center justify-center bg-slate-950 text-slate-400">
              No game URL added yet.
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={game.game_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-3 font-bold transition hover:scale-105"
          >
            🎮 Fullscreen
          </a>

          <FavoriteButton gameSlug={game.slug} />

          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold transition hover:bg-white/10"
          >
            ← Back Home
          </Link>
        </div>

        <section className="mt-10 rounded-3xl border border-white/10 bg-slate-950 p-6">
          <h2 className="text-2xl font-black">About This Game</h2>

          <p className="mt-4 leading-8 text-slate-300">
            {game.description || "No description available."}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-sm text-slate-400">Plays</p>
              <p className="mt-2 text-3xl font-black">
                {(game.plays || 0) + 1}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-sm text-slate-400">Rating</p>
              <p className="mt-2 text-3xl font-black">
                {game.rating || "5.0"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-sm text-slate-400">Status</p>
              <p className="mt-2 text-3xl font-black">
                {game.status || "Free"}
              </p>
            </div>
          </div>
        </section>

        {relatedGames.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-6 text-3xl font-black">
              Related Games
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedGames.map((relatedGame: any) => (
                <Link
                  key={relatedGame.id}
                  href={`/game/${relatedGame.slug}`}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 transition hover:-translate-y-1 hover:border-fuchsia-500"
                >
                  <img
                    src={relatedGame.image}
                    alt={relatedGame.title}
                    className="h-52 w-full object-cover"
                  />

                  <div className="p-4">
                    <h3 className="line-clamp-1 text-xl font-black">
                      {relatedGame.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                      {relatedGame.description}
                    </p>
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