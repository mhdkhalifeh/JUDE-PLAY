"use client";

import { useState } from "react";
import ArticleCard, { categoryLabel, type ArticleCardData } from "./ArticleCard";

function normalize(text: string) {
  return text.normalize("NFKC").toLowerCase().replace(/[\u0640\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآٱ]/g, "ا").replace(/\s+/g, " ").trim();
}

export default function ArticleBrowser({ articles }: { articles: ArticleCardData[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const categories = new Map(articles.map(({ category }) => {
    const label = categoryLabel(category);
    return [normalize(label), label] as const;
  }));
  const terms = normalize(query).split(" ").filter(Boolean);
  const matches = articles.filter((article) => {
    const label = categoryLabel(article.category);
    const text = normalize([article.title, article.excerpt, label].join(" "));
    return (!category || normalize(label) === category) && terms.every((term) => text.includes(term));
  });

  return (
    <section aria-labelledby="all-articles" className="mt-10">
      <h2 id="all-articles" className="text-2xl font-black sm:text-3xl">All articles</h2>
      <div role="search" aria-label="Articles" className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,17rem)]">
        <label className="block text-sm font-semibold text-slate-200">
          Search articles
          <input type="search" dir="auto" value={query} onChange={(event) => setQuery(event.target.value)}
            placeholder="Title or keyword" className="mt-2 block w-full rounded-xl border border-white/15 bg-[#101526] px-4 py-3 text-white" />
        </label>
        <label className="block text-sm font-semibold text-slate-200">
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}
            className="mt-2 block w-full rounded-xl border border-white/15 bg-[#101526] px-4 py-3 text-white">
            <option value="">All categories</option>
            {[...categories].sort(([, a], [, b]) => a.localeCompare(b)).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </label>
      </div>
      <p role="status" className="my-5 text-sm text-slate-400">{matches.length} {matches.length === 1 ? "article" : "articles"}</p>
      {matches.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((article) => <ArticleCard key={article.slug} article={article} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 p-6 text-slate-300">
          {articles.length ? "No articles match your search." : "No articles published yet."}
          {(query || category) && (
            <button type="button" className="ms-3 font-bold text-cyan-300 underline"
              onClick={() => { setQuery(""); setCategory(""); }}>Clear filters</button>
          )}
        </div>
      )}
    </section>
  );
}
