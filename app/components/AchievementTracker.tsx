"use client";

import { useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

export default function AchievementTracker() {
  useEffect(() => {
    async function unlockFirstGame() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: existing } = await supabase
        .from("achievements")
        .select("id")
        .eq("user_id", user.id)
        .eq("title", "First Game")
        .maybeSingle();

      if (existing) return;

      await supabase.from("achievements").insert({
        user_id: user.id,
        title: "First Game",
        description: "Played your first game on JUDE Play",
      });
    }

    unlockFirstGame();
  }, []);

  return null;
}