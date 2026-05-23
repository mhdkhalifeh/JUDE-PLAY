"use client";

import { useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

export default function GameActivityTracker({ slug }: { slug: string }) {
  useEffect(() => {
    async function track() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await supabase
        .from("recently_played")
        .delete()
        .eq("user_id", user.id)
        .eq("game_slug", slug);

      await supabase.from("recently_played").insert({
        user_id: user.id,
        game_slug: slug,
      });
    }

    track();
  }, [slug]);

  return null;
}