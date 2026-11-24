import Link from "next/link";
import type { Metadata } from "next";
import ArticleBrowser from "./ArticleBrowser";
import { ARTICLE_CARD_FIELDS, articleHref } from "./ArticleCard";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60;

const SITE_URL = "https://www.jude-play.com";

export const metadata: Metadata = {
  title: "Gaming Blog & Guides | JUDE Play",
  description:
    "Explore browser gaming guides, practical play tips, and original games from JUDE Game Studio.",
  alternates: { canonical: `${SITE_URL}/blog` },
};

export default async function BlogPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.from("articles")
    .select(`${ARTICLE_CARD_FIELDS},featured_on_blog`)
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("slug");

  if (error) console.error("Blog articles error:", error.message);
  const articles = data ?? [];
  const featured = articles.find((article) => article.featured_on_blog) ?? articles[0];

  return (
    <main className="min-h-screen bg-[#070914] text-white">
      <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 md:px-8 md:py-14">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Articles</h1>
        {featured && (
          <section aria-label="Featured article" className="mt-6 grid overflow-hidden rounded-3xl border border-white/10 bg-[#13162b] md:grid-cols-[1.6fr_1fr]">
            <div className="aspect-video bg-gradient-to-br from-[#33224f] to-[#11243a] md:aspect-auto">
              {featured.cover_image && (
                <img src={featured.cover_image} alt="" fetchPriority="high" className="h-full w-full object-cover md:aspect-video" />
              )}
            </div>
            <div className="flex flex-col items-start justify-center p-6 sm:p-9">
              <h2 dir="auto" className="text-2xl font-black leading-snug sm:text-4xl">{featured.title}</h2>
              <Link href={articleHref(featured.slug)} className="mt-6 rounded-xl bg-fuchsia-600 px-5 py-3 text-sm font-bold hover:bg-fuchsia-500 focus-visible:outline focus-visible:outline-cyan-300">
                Read article
              </Link>
            </div>
          </section>
        )}
        {error
          ? <p className="mt-8 text-slate-300">Articles are temporarily unavailable.</p>
          : <ArticleBrowser articles={articles} />}
      </div>
    </main>
  );
}
