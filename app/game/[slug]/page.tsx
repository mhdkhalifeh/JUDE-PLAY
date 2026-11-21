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

type PageProps = {
  params: Promise<{ slug: string }>;
};

type Game = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  image: string | null;
  description: string | null;
  how_to_play: string | null;
  controls: string | null;
  tips: string | null;
  plays: number | null;
  game_url: string | null;
  game_type: string | null;
};

type RelatedGame = Pick<Game, "id" | "title" | "slug" | "image" | "category" | "description">;

function nonempty(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function toAbsoluteImageUrl(url: string | null | undefined): string {
  const value = nonempty(url);
  if (!value) return `${SITE_URL}/og-image.jpg`;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}/${value.replace(/^\/+/, "")}`;
}

function metadataDescription(value: string): string {
  // Avoid exporting multi-paragraph game descriptions as oversized SEO metadata.
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 160) return cleaned;
  return `${cleaned.slice(0, 157).replace(/\s+\S*$/, "")}…`;
}

async function getGame(slug: string): Promise<Game | null> {
  const { data, error } = await supabase
    .from("games")
    .select("id, title, slug, category, image, description, how_to_play, controls, tips, plays, game_url, game_type")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Unable to load game:", error.message);
    return null;
  }
  return data as Game | null;
}

async function getRelatedGames(category: string | null, slug: string): Promise<RelatedGame[]> {
  if (!category) return [];
  const { data, error } = await supabase
    .from("games")
    .select("id, title, slug, image, category, description")
    .eq("category", category)
    .eq("is_published", true)
    .neq("slug", slug)
    .limit(4);

  if (error) {
    console.error("Unable to load related games:", error.message);
    return [];
  }
  return (data || []) as RelatedGame[];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGame(slug);

  if (!game) {
    return {
      title: "Game Not Found | JUDE Play",
      robots: { index: false, follow: false },
    };
  }

  const description = metadataDescription(
    nonempty(game.description) ||
      `Play ${game.title} online on JUDE Play. Discover more free browser games.`
  );
  const canonical = `${SITE_URL}/game/${encodeURIComponent(game.slug)}`;
  const image = toAbsoluteImageUrl(game.image);

  return {
    title: `${game.title} | Play Online | JUDE Play`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${game.title} | JUDE Play`,
      description,
      url: canonical,
      siteName: "JUDE Play",
      type: "website",
      images: [{ url: image, alt: game.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.title} | JUDE Play`,
      description,
      images: [image],
    },
  };
}

function ContentSection({
  heading,
  content,
  id,
}: {
  heading: string;
  content: string;
  id: string;
}) {
  return (
    <section id={id} className="scroll-mt-28 rounded-3xl border border-white/10 bg-[#101525] p-5 sm:p-7">
      <h2 className="text-xl font-extrabold text-white sm:text-2xl">{heading}</h2>
      <div className="mt-4 space-y-4 text-sm leading-8 text-slate-300 sm:text-base">
        {content.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => (
          <p key={index} className="whitespace-pre-line break-words">{paragraph.trim()}</p>
        ))}
      </div>
    </section>
  );
}

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) notFound();

  const description = nonempty(game.description);
  const howToPlay = nonempty(game.how_to_play);
  const controls = nonempty(game.controls);
  const tips = nonempty(game.tips);
  const relatedGames = await getRelatedGames(game.category, game.slug);
  const gameUrl = `${SITE_URL}/game/${encodeURIComponent(game.slug)}`;
  const sections = [
    { heading: "How to Play", content: howToPlay, id: "how-to-play" },
    { heading: "Game Controls", content: controls, id: "controls" },
    { heading: "Tips & Strategy", content: tips, id: "tips" },
  ].filter((section) => Boolean(section.content));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    url: gameUrl,
    ...(description ? { description } : {}),
    ...(game.image ? { image: toAbsoluteImageUrl(game.image) } : {}),
    ...(game.category ? { genre: game.category } : {}),
    applicationCategory: "Game",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  const safeJsonLd = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <main className="min-h-screen bg-[#0d0e16] text-white">
      <AchievementTracker />
      <GameActivityTracker slug={game.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd }} />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-fuchsia-300">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/categories" className="hover:text-fuchsia-300">Games</Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-200" aria-current="page">{game.title}</span>
        </nav>

        <header className="mb-6">
          {game.category && (
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-fuchsia-300">
              {game.category}
            </p>
          )}
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">{game.title}</h1>
          <p className="mt-2 text-sm text-slate-400">Play free in your browser on JUDE Play.</p>
        </header>

        <GameFrame
          gameId={game.id}
          gameUrl={game.game_url || ""}
          title={game.title}
          gameType={game.game_type as "local" | "iframe" | undefined}
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <FavoriteButton gameSlug={game.slug} />
          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold transition hover:bg-white/10"
          >
            ← Back Home
          </Link>
          {sections.length > 0 && (
            <a
              href={`#${sections[0].id}`}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold transition hover:bg-white/10"
            >
              Game guide ↓
            </a>
          )}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <div className="min-w-0 space-y-6">
            <section className="rounded-3xl border border-white/10 bg-[#101525] p-5 sm:p-7">
              <h2 className="text-xl font-extrabold sm:text-2xl">About {game.title}</h2>
              {description ? (
                <div className="mt-4 space-y-4 text-sm leading-8 text-slate-300 sm:text-base">
                  {description.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => (
                    <p key={index} className="whitespace-pre-line break-words">{paragraph.trim()}</p>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Explore the game above and discover more titles from this collection.
                </p>
              )}
            </section>

            {sections.map((section) => (
              <ContentSection key={section.id} {...section} />
            ))}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24" aria-label="Game details">
            <div className="rounded-3xl border border-white/10 bg-[#101525] p-5">
              <h2 className="mb-4 text-base font-extrabold">Game information</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs text-slate-400">Plays</dt>
                  <dd className="mt-1 text-2xl font-black">{Number(game.plays || 0).toLocaleString("en-US")}</dd>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <dt className="text-xs text-slate-400">Category</dt>
                  <dd className="mt-1 font-bold">{game.category || "Browser Game"}</dd>
                </div>
              </dl>
            </div>
            <GameRating gameId={game.id} />
            {sections.length > 0 && (
              <nav aria-label="On this page" className="rounded-3xl border border-white/10 bg-[#101525] p-5">
                <h2 className="mb-3 text-sm font-extrabold">On this page</h2>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`} className="text-sm text-violet-300 hover:text-white">
                        {section.heading} →
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </aside>
        </div>

        {relatedGames.length > 0 && (
          <section className="mt-12" aria-labelledby="related-title">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="related-title" className="text-2xl font-black sm:text-3xl">
                  More {game.category} Games
                </h2>
                <p className="mt-1 text-sm text-slate-400">Explore other games in this category.</p>
              </div>
              <Link href="/categories" className="text-sm font-bold text-violet-300 hover:text-white">
                Browse categories →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {relatedGames.map((relatedGame) => (
                <Link
                  key={relatedGame.id}
                  href={`/game/${relatedGame.slug}`}
                  className="group min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#101525] transition hover:-translate-y-1 hover:border-fuchsia-400/60"
                >
                  {relatedGame.image ? (
                    <img
                      loading="lazy"
                      src={relatedGame.image}
                      alt={relatedGame.title}
                      className="aspect-[16/10] w-full object-cover transition group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex aspect-[16/10] items-center justify-center bg-slate-900 text-sm text-slate-500">
                      No Image
                    </div>
                  )}
                  <div className="p-3 sm:p-4">
                    <h3 className="line-clamp-2 text-sm font-extrabold sm:text-base">{relatedGame.title}</h3>
                    {nonempty(relatedGame.description) && (
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400 sm:text-sm">
                        {relatedGame.description}
                      </p>
                    )}
                    <span className="mt-3 inline-block text-xs font-bold text-fuchsia-300 sm:text-sm">Play Game →</span>
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
