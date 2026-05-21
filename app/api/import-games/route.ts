import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function GET() {
  try {
    const res = await fetch(
      "https://gamemonetize.com/feed.php?format=0&num=20&page=1"
    );

    const games = await res.json();

    for (const game of games) {
      await supabase.from("games").upsert(
  {
    title: game.title,
    slug: game.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    description: game.description,
    meta: game.instructions || game.category || "HTML5 Game",
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
    }

    return NextResponse.json({
      success: true,
      message: "Games imported successfully 🔥",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Import failed",
    });
  }
}