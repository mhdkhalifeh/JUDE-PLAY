"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import ArticleCard, { ARTICLE_CARD_FIELDS, type ArticleCardData } from "./ArticleCard";

export default function LatestArticles() {
  const [articles, setArticles] = useState<ArticleCardData[]>([]);

  useEffect(() => {
    let active = true;
    async function loadArticles() {
      const { data, error } = await supabase.from("articles")
        .select(ARTICLE_CARD_FIELDS)
        .eq("published", true)
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("slug")
        .limit(3);
      if (active && !error) setArticles(data ?? []);
    }
    void loadArticles();
    return () => { active = false; };
  }, []);

  if (!articles.length) return null;

  return (
    <section className="mb-16" aria-labelledby="home-articles">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="home-articles" className="text-3xl font-black">Latest articles</h2>
        <Link href="/blog" className="font-bold text-cyan-300 hover:underline">All articles</Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => <ArticleCard key={article.slug} article={article} />)}
      </div>
    </section>
  );
}
