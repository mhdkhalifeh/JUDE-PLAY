
import type { MetadataRoute } from "next";
import { supabase } from "@/app/lib/supabase";

export const revalidate = 300;

const siteUrl = "https://www.jude-play.com";

function validDate(value: string | null | undefined) {
  if (!value) return undefined;

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? undefined
    : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("slug, created_at")
    .eq("is_published", true);

  if (gamesError) {
    console.error("Sitemap games error:", gamesError.message);
  }

  const { data: articles, error: articlesError } = await supabase
    .from("articles")
    .select("slug, published_at, updated_at")
    .eq("published", true);

  if (articlesError) {
    console.error(
      "Sitemap articles error:",
      articlesError.message
    );
  }

  const gameUrls: MetadataRoute.Sitemap = (games || [])
    .filter((game) => Boolean(game.slug))
    .map((game) => ({
      url: `${siteUrl}/game/${encodeURIComponent(game.slug)}`,
      lastModified: validDate(game.created_at),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const blogUrls: MetadataRoute.Sitemap = (articles || [])
    .filter((article) => Boolean(article.slug))
    .map((article) => ({
      url: `${siteUrl}/blog/${encodeURIComponent(article.slug)}`,
      lastModified: validDate(
        article.updated_at || article.published_at
      ),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/jude-originals`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      changeFrequency: "weekly",
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

  const allUrls = [
    ...staticUrls,
    ...blogUrls,
    ...gameUrls,
  ];

  return Array.from(
    new Map(allUrls.map((item) => [item.url, item])).values()
  );
}
