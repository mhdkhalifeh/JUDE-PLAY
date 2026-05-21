import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function GET() {
  let imported = 0;
  let skipped = 0;
  const errors: any[] = [];

  try {
    const page = Math.floor(Math.random() * 50) + 1;

    const res = await fetch(
      `https://gamemonetize.com/feed.php?format=0&num=20&page=${page}`
    );

    const games = await res.json();

    for (const game of games) {
      if (!game.title || !game.url || !game.thumb) {
        skipped++;
        continue;
      }

      const slug = game.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const { error } = await supabase.from("games").upsert(
        {
          title: game.title,
          slug,
          description: game.description || "HTML5 Game",
          meta: game.tags || game.category || "HTML5 Game",
          image: game.thumb,
          game_url: game.url,
          category: game.category || "Arcade",
          rating: "5.0",
          status: "Free",
          plays: 0,
          game_type: "iframe",
        },
        { onConflict: "slug" }
      );

      if (error) {
        errors.push({ title: game.title, error: error.message });
      } else {
        imported++;
      }
    }

    return NextResponse.json({
      success: true,
      page,
      imported,
      skipped,
      errors,
      message: `Imported: ${imported}, Skipped: ${skipped}, Errors: ${errors.length}`,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Import failed",
    });
  }
}