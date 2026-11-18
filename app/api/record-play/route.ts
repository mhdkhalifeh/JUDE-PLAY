
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash, randomUUID } from "node:crypto";

export const runtime = "nodejs";

const COOKIE_NAME = "jp_play_visitor";

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");

    if (origin && origin !== new URL(request.url).origin) {
      return NextResponse.json(
        { error: "Invalid origin" },
        { status: 403 }
      );
    }

    const { gameId } = await request.json();

    if (
      typeof gameId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(gameId)
    ) {
      return NextResponse.json(
        { error: "Invalid game ID" },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    const hashSecret =
      process.env.PLAY_COUNT_HASH_SECRET;

    if (!supabaseUrl || !serviceKey || !hashSecret) {
      console.error("Play counter configuration missing");

      return NextResponse.json(
        { error: "Counter unavailable" },
        { status: 503 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      serviceKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const storedVisitor =
      request.cookies.get(COOKIE_NAME)?.value;

    const validVisitor =
      storedVisitor &&
      /^[0-9a-f-]{36}$/i.test(storedVisitor);

    const visitorId = validVisitor
      ? storedVisitor
      : randomUUID();

    const visitorHash = createHash("sha256")
      .update(`${hashSecret}:${visitorId}`)
      .digest("hex");

    const { data, error } = await supabase.rpc(
      "record_game_play",
      {
        p_game_id: gameId,
        p_visitor_hash: visitorHash,
      }
    );

    if (error) {
      console.error("Play counter error:", error.message);

      return NextResponse.json(
        { error: "Unable to record play" },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      counted: data === true,
    });

    if (!validVisitor) {
      response.cookies.set(COOKIE_NAME, visitorId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 90,
      });
    }

    return response;
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
