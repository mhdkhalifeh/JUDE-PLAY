import Link from "next/link";

export type ArticleCardData = {
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  cover_image: string | null;
};

export const ARTICLE_CARD_FIELDS = "title,slug,excerpt,category,cover_image";

export function articleHref(slug: string) {
  return `/blog/${encodeURIComponent(slug)}`;
}

export function categoryLabel(category: string | null) {
  return category?.trim() || "Gaming";
}

export default function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <article className="h-full">
      <Link href={articleHref(article.slug)} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#101526] transition hover:border-fuchsia-400/50 focus-visible:outline focus-visible:outline-cyan-300">
        <div className="aspect-video overflow-hidden bg-gradient-to-br from-[#29214b] to-[#10253c]">
          {article.cover_image && (
            <img src={article.cover_image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-300 motion-safe:group-hover:scale-105" />
          )}
        </div>
        <div className="p-5">
          <p dir="auto" className="text-xs font-bold text-cyan-300">{categoryLabel(article.category)}</p>
          <h3 dir="auto" className="mt-2 text-lg font-extrabold leading-snug text-white group-hover:text-fuchsia-200">{article.title}</h3>
          {article.excerpt?.trim() && <p dir="auto" className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">{article.excerpt.trim()}</p>}
        </div>
      </Link>
    </article>
  );
}
