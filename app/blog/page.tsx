
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const oldPosts = [
  ["Best Browser Games to Play Online", "best-browser-games"],
  ["Why HTML5 Games Are Popular", "why-html5-games-are-popular"],
  ["Top Puzzle Games for Quick Fun", "top-puzzle-games"],
  ["Free Online Games Without Downloads", "free-online-games"],
  ["Best Game Categories on JUDE Play", "best-game-categories"],
  ["The Rise of Multiplayer Browser Games", "multiplayer-browser-games"],
  ["Why Browser Games Work Great on Mobile Devices", "browser-games-mobile"],
  ["The Future of Browser Gaming", "future-of-browser-gaming"],
  ["Best Racing Games You Can Play in Your Browser", "best-racing-games-browser"],
  ["Top Action Games for Fast-Paced Fun", "top-action-games-online"],
  ["Best Arcade Games to Play for Free", "best-arcade-games"],
  ["How Browser Games Have Changed Over the Years", "history-of-browser-games"],
  ["Best Games to Play During Short Breaks", "games-for-short-breaks"],
  ["Best Free HTML5 Games in 2026", "best-free-html5-games-2026"],
  ["Why Browser Games Are Better Than Downloads", "browser-games-vs-download-games"],
  ["Most Popular Arcade Games Online", "popular-arcade-games-online"],
  ["Browser Games for Kids", "browser-games-for-kids"],
  ["How Browser Games Keep Improving", "how-browser-games-keep-improving"],
];

export const metadata = {
  title: "Gaming Blog | JUDE Play",
  description:
    "Explore gaming guides, HTML5 browser games and online gaming articles on JUDE Play.",
  alternates: {
    canonical: "https://jude-play.com/blog",
  },
};

export default async function BlogPage() {
  const { data, error } = await supabase
    .from("articles")
    .select("title, slug, excerpt, cover_image, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Blog articles error:", error.message);
  }

  const newPosts = data || [];
  const newSlugs = new Set(newPosts.map((post) => post.slug));

  const legacyPosts = oldPosts
    .filter((post) => !newSlugs.has(post[1]))
    .map(([title, slug]) => ({
      title,
      slug,
      excerpt: "Explore this gaming guide on JUDE Play.",
      cover_image: null as string | null,
      published_at: null as string | null,
    }));

  const posts = [...newPosts, ...legacyPosts];

  return (
    <main className="min-h-screen bg-[#070914] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8">
        <p className="font-bold uppercase tracking-[0.3em] text-fuchsia-400">
          JUDE PLAY BLOG
        </p>

        <h1 className="mt-4 text-5xl font-black">
          Gaming Blog
        </h1>

        <p className="mt-4 max-w-4xl leading-8 text-slate-400">
          Discover gaming guides, browser game tips, HTML5 games
          and the latest articles from JUDE Play.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 transition hover:-translate-y-1 hover:border-fuchsia-500"
            >
              {post.cover_image && (
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="h-56 w-full object-cover"
                />
              )}

              <div className="p-8">
                <h2 className="text-2xl font-black">
                  {post.title}
                </h2>

                <p className="mt-4 leading-7 text-slate-400">
                  {post.excerpt}
                </p>

                <span className="mt-6 inline-block font-bold text-fuchsia-400">
                  Read Article →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
