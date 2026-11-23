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

  const posts = (data ?? []) as Post[];

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
