import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60;

const SITE_URL = "https://www.jude-play.com";

export const metadata: Metadata = {
  title: "Gaming Blog & Guides | JUDE Play",
  description:
    "Explore browser gaming guides, practical play tips, and original games from JUDE Game Studio.",
  alternates: { canonical: `${SITE_URL}/blog` },
};

type Post = {
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
};

// These remain links to the site's existing legacy blog routes.
// A card summary does not replace the article content at /blog/[slug].
const legacyPosts: Post[] = [
  { title: "Best Browser Games to Play Online", slug: "best-browser-games", excerpt: "A guide to exploring browser games and finding the genres that match the way you like to play.", cover_image: null, published_at: null },
  { title: "Why HTML5 Games Are Popular", slug: "why-html5-games-are-popular", excerpt: "Learn what makes HTML5 useful for games that run directly in a modern web browser.", cover_image: null, published_at: null },
  { title: "Top Puzzle Games for Quick Fun", slug: "top-puzzle-games", excerpt: "Explore puzzle-game styles and what makes a short logic challenge satisfying.", cover_image: null, published_at: null },
  { title: "Free Online Games Without Downloads", slug: "free-online-games", excerpt: "What to expect from games that launch in your browser without a separate installation.", cover_image: null, published_at: null },
  { title: "Best Game Categories on JUDE Play", slug: "best-game-categories", excerpt: "A tour of game categories on JUDE Play to help you discover something different.", cover_image: null, published_at: null },
  { title: "The Rise of Multiplayer Browser Games", slug: "multiplayer-browser-games", excerpt: "Explore how browser-based multiplayer gaming connects players and changes online play.", cover_image: null, published_at: null },
  { title: "Why Browser Games Work Great on Mobile Devices", slug: "browser-games-mobile", excerpt: "A closer look at mobile browser play, touch controls, and screen-size considerations.", cover_image: null, published_at: null },
  { title: "The Future of Browser Gaming", slug: "future-of-browser-gaming", excerpt: "Explore the technologies and design trends shaping the next generation of browser games.", cover_image: null, published_at: null },
  { title: "Best Racing Games You Can Play in Your Browser", slug: "best-racing-games-browser", excerpt: "Discover browser racing formats, from quick arcade runs to more challenging driving games.", cover_image: null, published_at: null },
  { title: "Top Action Games for Fast-Paced Fun", slug: "top-action-games-online", excerpt: "Explore the reflexes, timing, and challenges common to fast-paced browser action games.", cover_image: null, published_at: null },
  { title: "Best Arcade Games to Play for Free", slug: "best-arcade-games", excerpt: "Learn why quick rounds, simple goals, and replayable challenges define arcade gaming.", cover_image: null, published_at: null },
  { title: "How Browser Games Have Changed Over the Years", slug: "history-of-browser-games", excerpt: "Follow the evolution of browser-based games and the technologies behind them.", cover_image: null, published_at: null },
  { title: "Best Games to Play During Short Breaks", slug: "games-for-short-breaks", excerpt: "Ideas for picking games with quick sessions when you only have a few minutes.", cover_image: null, published_at: null },
  { title: "Best Free HTML5 Games in 2026", slug: "best-free-html5-games-2026", excerpt: "Explore HTML5 game categories and consider what makes a browser game worth revisiting.", cover_image: null, published_at: null },
  { title: "Why Browser Games Are Better Than Downloads", slug: "browser-games-vs-download-games", excerpt: "Compare the convenience and trade-offs of playing in a browser versus installing a game.", cover_image: null, published_at: null },
  { title: "Most Popular Arcade Games Online", slug: "popular-arcade-games-online", excerpt: "Explore the familiar styles and mechanics found in popular online arcade games.", cover_image: null, published_at: null },
  { title: "Browser Games for Kids", slug: "browser-games-for-kids", excerpt: "Consider game suitability, ease of use, and supervision when choosing browser games for children.", cover_image: null, published_at: null },
  { title: "How Browser Games Keep Improving", slug: "how-browser-games-keep-improving", excerpt: "A look at improvements in performance, device support, and browser-game design.", cover_image: null, published_at: null },
];

function prettyDate(date: string | null) {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric", month: "short", day: "numeric", timeZone: "UTC",
  }).format(parsed);
}

export default async function BlogPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("articles")
    .select("title, slug, excerpt, cover_image, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) console.error("Blog articles error:", error.message);

  const databasePosts = (data ?? []) as Post[];
  const existingSlugs = new Set(databasePosts.map((post) => post.slug));
  const posts = [
    ...databasePosts,
    ...legacyPosts.filter((post) => !existingSlugs.has(post.slug)),
  ];

  return (
    <main className="min-h-screen bg-[#070914] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-8 md:py-14">
        <header className="max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-fuchsia-400">
            JUDE PLAY JOURNAL
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Browser Gaming Blog
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">
            Guides to browser gaming, puzzle-solving ideas, and the games we're creating
            at JUDE Game Studio. Find a topic to explore, then jump into a game.
          </p>
        </header>

        <section
          aria-labelledby="originals-heading"
          className="mt-9 overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-[#15213b] via-[#15142c] to-[#24132f] p-6 sm:p-8"
        >
          <p className="text-xs font-extrabold uppercase tracking-widest text-cyan-300">Made by JUDE</p>
          <h2 id="originals-heading" className="mt-2 text-2xl font-black sm:text-3xl">
            Discover JUDE Originals
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-300">
            Explore the games developed by our studio: JUDE Space Shooter, LAHZA,
            and JUDOKU. Visit their pages to learn the rules and play.
          </p>
          <Link
            href="/jude-originals"
            className="mt-6 inline-flex items-center rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/20"
          >
            Explore JUDE Originals →
          </Link>
        </section>

        <section aria-labelledby="articles-heading" className="mt-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="articles-heading" className="text-2xl font-black sm:text-3xl">Articles & guides</h2>
              <p className="mt-2 text-sm text-slate-400">Read gaming topics from the JUDE Play collection.</p>
            </div>
            <span className="text-sm text-slate-400">{posts.length} articles</span>
          </div>

          {posts.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#101526] transition hover:border-fuchsia-500/60"
                >
                  {post.cover_image ? (
                    <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                      <img src={post.cover_image} alt="" loading="lazy" className="h-48 w-full object-cover" />
                    </Link>
                  ) : (
                    <div aria-hidden="true" className="flex h-28 items-center bg-gradient-to-r from-fuchsia-700/20 via-indigo-700/20 to-cyan-700/20 px-7 text-3xl text-white/40">
                      ◈
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {prettyDate(post.published_at) && (
                      <p className="mb-2 text-xs text-slate-500">{prettyDate(post.published_at)}</p>
                    )}
                    <h3 className="text-xl font-extrabold leading-snug">
                      <Link href={`/blog/${post.slug}`} className="hover:text-fuchsia-300">
                        {post.title}
                      </Link>
                    </h3>
                    {post.excerpt?.trim() && (
                      <p className="mt-3 flex-1 text-sm leading-7 text-slate-300">
                        {post.excerpt.trim()}
                      </p>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-6 inline-flex w-fit items-center text-sm font-bold text-fuchsia-300 hover:text-fuchsia-200"
                    >
                      Read article →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
              No published articles available yet.
            </p>
          )}
        </section>

        <div className="mt-12 border-t border-white/10 pt-7 text-sm text-slate-400">
          Ready to play? <Link href="/" className="font-semibold text-fuchsia-300 hover:text-fuchsia-200">Browse games on JUDE Play →</Link>
        </div>
      </div>
    </main>
  );
}
