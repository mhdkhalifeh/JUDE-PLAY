import { supabase } from "@/app/lib/supabase";
import HomeClient from "@/app/components/HomeClient";

export default async function HomePage() {
  const { data: games } = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: false });

  return <HomeClient initialGames={games || []} />;
}