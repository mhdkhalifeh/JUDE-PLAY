import Link from "next/link";
import { notFound } from "next/navigation";
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
    .eq("is_published", true)
    .single();

  return data;
}

async function getRelatedGames(category: string, slug: string) {
  const { data } = await supabase
    .from("games")
    .select("*")
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

  if (!game) notFound();

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