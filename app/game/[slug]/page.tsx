import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import FavoriteButton from "@/app/components/FavoriteButton";
import GameFrame from "@/app/components/GameFrame";
import AchievementTracker from "@/app/components/AchievementTracker";
import GameActivityTracker from "@/app/components/GameActivityTracker";

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
  const game = await getGame(slug);

  if (!game) {
    return {
      title: "Game Not Found | JUDE Play",
      description: "This game does not exist on JUDE Play.",
    };
  }

  const description =
    game.description ||
    game.meta ||
    `Play ${game.title} online for free on JUDE Play.`;

  const image = game.image || "/logo.png";

  return {
    title: `${game.title} | Play Online Free | JUDE Play`,
    description,
    keywords: [
      game.title,
      game.category,
      game.meta,
      "HTML5 Games",
      "WebGL Games",
      "Browser Games",
      "Online Games",
      "Free Games",
      "Play Online",
      "JUDE Play",
    ].filter(Boolean),

    openGraph: {
      title: `${game.title} | JUDE Play`,
      description,
      url: `https://jude-play.com/game/${game.slug}`,
      siteName: "JUDE Play",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: game.title,
        },
      ],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: `${game.title} | JUDE Play`,
      description,
      images: [image],
    },
  };
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
      <main className="min-h-screen bg-[#050816] text-white">
        <div className="mx-auto max-w-7xl p-8">
          <div className="rounded-3xl border border-white/10 bg-slate-950 p-8">
            <h1 className="text-4xl font-black">Game Not Found</h1>
            <p className="mt-4 text-slate-400">This game does not exist.</p>

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

  await supabase
    .from("games")
    .update({ plays: (game.plays || 0) + 1 })
    .eq("id", game.id);

 

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.description || game.meta,
    image: game.image,
    url: `https://jude-play.com/game/${game.slug}`,
    genre: game.category,
    applicationCategory: "Game",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const relatedGames = await getRelatedGames(game.category, game.slug);

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <AchievementTracker />
      <GameActivityTracker slug={game.slug} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl p-6 md:p-8">
        <div className="mb-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-400">
            {game.category}
          </p>

          <h1 className="text-4xl font-black md:text-5xl">{game.title}</h1>

          <p className="mt-4 max-w-3xl text-slate-300">
            {game.description || game.meta}
          </p>
        </div>

        <GameFrame
          gameUrl={game.game_url}
          title={game.title}
          gameType={game.game_type || "local"}
        />

        <div className="mt-5 flex flex-wrap gap-3">
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
            <h2 className="mb-6 text-3xl font-black">Related Games</h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedGames.map((relatedGame: any) => (
                <Link
                  key={relatedGame.id}
                  href={`/game/${relatedGame.slug}`}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 transition hover:-translate-y-1 hover:border-fuchsia-500"
                >
                  {relatedGame.image ? (
                    <img
                      loading="lazy"
                      src={relatedGame.image}
                      alt={relatedGame.title}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-slate-900 text-slate-500">
                      No Image
                    </div>
                  )}

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