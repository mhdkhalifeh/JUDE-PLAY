
import type { MetadataRoute } from "next";
import { supabase } from "@/app/lib/supabase";

export const revalidate = 300;

const siteUrl = "https://www.jude-play.com";

// Existing articles written directly in the code
const legacyArticleSlugs = [
  "best-browser-games",
  "why-html5-games-are-popular",
  "top-puzzle-games",
  "free-online-games",
  "best-game-categories",
  "multiplayer-browser-games",
  "browser-games-mobile",
  "future-of-browser-gaming",
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
];

function validDate(value: string | null | undefined) {
  if (!value) return undefined;

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? undefined
    : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Load published games
  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("slug, created_at")
    .eq("is_published", true);

  if (gamesError) {
    console.error("Sitemap games error:", gamesError.message);
  }

  // Load published articles from Supabase
  const { data: articles, error: articlesError } = await supabase
    .from("articles")
    .select("slug, published_at, updated_at")
    .eq("published", true);

  if (articlesError) {
    console.error("Sitemap articles error:", articlesError.message);
  }

  const gameUrls: MetadataRoute.Sitemap =
    (games || [])
      .filter((game) => Boolean(game.slug))
      .map((game) => ({
        url: `${siteUrl}/game/${encodeURIComponent(game.slug)}`,
        lastModified: validDate(game.created_at),
        changeFrequency: "weekly",
        priority: 0.8,
      }));

  // Published articles take priority over legacy versions
  const publishedSlugs = new Set(
    (articles || []).map((article) => article.slug)
  );

  const legacyBlogUrls: MetadataRoute.Sitemap =
    legacyArticleSlugs
      .filter((slug) => !publishedSlugs.has(slug))
      .map((slug) => ({
        url: `${siteUrl}/blog/${slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
      }));

  const newBlogUrls: MetadataRoute.Sitemap =
    (articles || [])
      .filter((article) => Boolean(article.slug))
      .map((article) => ({
        url: `${siteUrl}/blog/${encodeURIComponent(article.slug)}`,
        lastModified: validDate(
          article.updated_at || article.published_at
        ),
        changeFrequency: "monthly",
        priority: 0.7,
      }));

  // Main public pages
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blog`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/faq`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/categories`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/top-games`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/new-games`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/stats`,
      changeFrequency: "weekly",
      priority: 0.4,
    },
  ];

  // Remove duplicate URLs
  const allUrls = [
    ...staticUrls,
    ...legacyBlogUrls,
    ...newBlogUrls,
    ...gameUrls,
  ];

  return Array.from(
    new Map(allUrls.map((item) => [item.url, item])).values()
  );
}
