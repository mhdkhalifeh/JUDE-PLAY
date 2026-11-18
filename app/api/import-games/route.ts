
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const ADMIN_EMAIL = "mhd.khalifeh89@gmail.com";

export async function POST(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const token = authorization.slice(7).trim();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.json(
      { error: "Supabase configuration missing" },
      { status: 500 }
    );
  }

  const supabase = createClient(url, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (
    authError ||
    !user ||
    user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()
  ) {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  let imported = 0;
  let skipped = 0;
  const errors: { title: string; error: string }[] = [];

  try {
    // One feed page per manual import request.
    const page = Math.floor(Math.random() * 50) + 1;

    const response = await fetch(
      `https://gamemonetize.com/feed.php?format=0&num=20&page=${page}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Unable to fetch game feed");
    }

    const feed: unknown = await response.json();

    if (!Array.isArray(feed)) {
      throw new Error("Invalid game feed format");
    }

    for (const item of feed.slice(0, 20)) {
      if (!item || typeof item !== "object") {
        skipped++;
        continue;
      }

      const game = item as Record<string, unknown>;

      const title =
        typeof game.title === "string"
          ? game.title.trim()
          : "";

      const gameUrl =
        typeof game.url === "string"
          ? game.url.trim()
          : "";

      const image =
        typeof game.thumb === "string"
          ? game.thumb.trim()
          : "";

      if (!title || !gameUrl || !image) {
        skipped++;
        continue;
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      if (!slug) {
        skipped++;
        continue;
      }

      const description =
        typeof game.description === "string"
          ? game.description.trim()
          : "";

      const tags =
        typeof game.tags === "string"
          ? game.tags.trim()
          : "";

      const category =
        typeof game.category === "string" &&
        game.category.trim()
          ? game.category.trim()
          : "Arcade";

      const { data, error } = await supabase
        .from("games")
        .upsert(
          {
            title,
            slug,
            description,
            meta: tags || category,
            image,
            game_url: gameUrl,
            category,
            status: "Free",
            plays: 0,
            game_type: "iframe",
            is_published: false,
          },
          {
            onConflict: "slug",
            ignoreDuplicates: true,
          }
        )
        .select("id");

      if (error) {
        errors.push({
          title,
          error: error.message,
        });
      } else if (data && data.length > 0) {
        imported++;
      } else {
        skipped++;
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      page,
      imported,
      skipped,
      errors,
      message:
        `Imported ${imported} draft games. ` +
        `Skipped ${skipped}. Errors ${errors.length}.`,
    });
  } catch (error) {
    console.error("Import failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to complete game import",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
