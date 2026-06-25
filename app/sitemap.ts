import { supabase } from "@/app/lib/supabase";

export default async function sitemap() {
  const siteUrl = "https://jude-play.com";

  const { data: games } = await supabase
    .from("games")
    .select("slug, created_at");

  const gameUrls =
    games?.map((game) => ({
      url: `${siteUrl}/game/${game.slug}`,
      lastModified: game.created_at,
    })) || [];

  const blogUrls = [
    "best-browser-games",
    "why-html5-games-are-popular",
    "top-puzzle-games",
    "free-online-games",
    "best-game-categories",
    "multiplayer-browser-games",
    "browser-games-mobile",
    "future-of-browser-gaming",

    // New Articles
    "best-racing-games-browser",
    "top-action-games-online",
    "best-arcade-games",
    "history-of-browser-games",
    "games-for-short-breaks",
    "best-free-html5-games-2026",
    "browser-games-vs-download-games",
    "popular-arcade-games-online",
    "browser-games-for-kids",
    "how-browser-games-keep-improving",
  ].map((slug) => ({
    url: `${siteUrl}/blog/${slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
    },

    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
    },

    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
    },

    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
    },

    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
    },

    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
    },

    {
      url: `${siteUrl}/faq`,
      lastModified: new Date(),
    },

    {
      url: `${siteUrl}/categories`,
      lastModified: new Date(),
    },

    {
      url: `${siteUrl}/top-games`,
      lastModified: new Date(),
    },

    {
      url: `${siteUrl}/new-games`,
      lastModified: new Date(),
    },

    {
      url: `${siteUrl}/stats`,
      lastModified: new Date(),
    },

    ...blogUrls,
    ...gameUrls,
  ];
}