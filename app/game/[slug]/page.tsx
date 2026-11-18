import GameRating from "@/app/components/GameRating";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import FavoriteButton from "@/app/components/FavoriteButton";
import GameFrame from "@/app/components/GameFrame";
import AchievementTracker from "@/app/components/AchievementTracker";
import GameActivityTracker from "@/app/components/GameActivityTracker";

const SITE_URL = "https://www.jude-play.com";

async function getGame(slug: string) {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) return null;
  return data;
}

async function getRelatedGames(category: string, slug: string) {
  const { data } = await supabase
    .from("games")
    .select(
      "id, title, slug, description, image, category"
    )
    .eq("category", category)
    .eq("is_published", true)
    .neq("slug", slug)
    .limit(4);

  return data || [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGame(slug);

  if (!game) {
    return {
      title: "Game Not Found | JUDE Play",
      robots: { index: false, follow: false },
    };
  }

  const description =
    game.description?.trim() ||
    `Play ${game.title} online on JUDE Play. Explore more browser games and discover new challenges.`;

  const canonical = `${SITE_URL}/game/${encodeURIComponent(
    game.slug
  )}`;

  const image = game.image || `${SITE_URL}/og-image.jpg`;

  return {
    title: `${game.title} | Play Online | JUDE Play`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${game.title} | JUDE Play`,
      description,
      url: canonical,
      siteName: "JUDE Play",
      type: "website",
      images: [
        {
          url: image,
          alt: game.title,
        },
      ],
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

  if (!game) notFound();


  const description =
    game.description?.trim() || "";

  const relatedGames = await getRelatedGames(
    game.category,
    game.slug
  );

  const gameUrl = `${SITE_URL}/game/${encodeURIComponent(
    game.slug
  )}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    ...(description ? { description } : {}),
    ...(game.image ? { image: game.image } : {}),
    url: gameUrl,
    genre: game.category,
    applicationCategory: "Game",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const safeJsonLd = JSON.stringify(jsonLd).replace(
    /</g,
    "\\u003c"
  );

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <AchievementTracker />
      <GameActivityTracker slug={game.slug} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd }}
      />

      <div className="mx-auto max-w-7xl p-6 md:p-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-7 text-sm text-slate-400"
        >
          <Link
            href="/"
            className="transition hover:text-fuchsia-400"
          >
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/categories"
            className="transition hover:text-fuchsia-400"
          >
            Games
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-200">
            {game.title}
          </span>
        </nav>

        <header className="mb-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-400">
            {game.category}
          </p>

          <h1 className="text-4xl font-black md:text-5xl">
            {game.title}
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Play directly in your browser on JUDE Play.
          </p>
        </header>

        <GameFrame
  gameId={game.id}
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

        <section className="mt-10 rounded-3xl border border-white/10 bg-slate-950 p-6 md:p-8">
          <h2 className="text-2xl font-black">
            About {game.title}
          </h2>

          {description ? (
            <p className="mt-4 whitespace-pre-line leading-8 text-slate-300">
              {description}
            </p>
          ) : (
            <p className="mt-4 leading-8 text-slate-400">
              Game details are not available yet.
            </p>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-sm text-slate-400">
                Plays
              </p>
              <p className="mt-2 text-3xl font-black">
                {Number(game.plays || 0).toLocaleString()}
              </p>
            </div>

            <GameRating gameId={game.id} />

            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-sm text-slate-400">
                Category
              </p>
              <p className="mt-2 text-2xl font-black">
                {game.category}
              </p>
            </div>
          </div>
        </section>


{[
  {
    title: "How to Play",
    content: game.how_to_play,
  },
  {
    title: "Game Controls",
    content: game.controls,
  },
  {
    title: "Tips & Strategy",
    content: game.tips,
  },
]
  .filter(
    (section) =>
      typeof section.content === "string" &&
      section.content.trim().length > 0
  )
  .map((section) => (
    <section
      key={section.title}
      className="mt-6 rounded-3xl border border-white/10 bg-slate-950 p-6 md:p-8"
    >
      <h2 className="text-2xl font-black text-white">
        {section.title}
      </h2>

      <div className="mt-4 whitespace-pre-line text-sm leading-8 text-slate-300 md:text-base">
        {section.content}
      </div>
    </section>
  ))}


        {relatedGames.length > 0 && (
          <section className="mt-12">
            <div className="mb-6">
              <h2 className="text-3xl font-black">
                More {game.category} Games
              </h2>
              <p className="mt-2 text-slate-400">
                Discover more games in the same category.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedGames.map((relatedGame) => (
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
                    <h3 className="line-clamp-2 text-xl font-black">
                      {relatedGame.title}
                    </h3>

                    {relatedGame.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                        {relatedGame.description}
                      </p>
                    )}

                    <span className="mt-4 inline-block text-sm font-bold text-fuchsia-400">
                      Play Game →
                    </span>
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
