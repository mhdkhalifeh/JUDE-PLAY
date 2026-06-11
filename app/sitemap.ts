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

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/favorites`,
      lastModified: new Date(),
    },
    ...gameUrls,
  ];
}