import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import sanitizeHtml from "sanitize-html";
import ArticleEngagement from "./ArticleEngagement";

export const revalidate = 60;

const SITE_URL = "https://www.jude-play.com";
const FALLBACK_IMAGE = `${SITE_URL}/og-image.jpg`;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  discussion_question: string | null;
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getArticle(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from("articles")
    .select(
      "id,title,slug,excerpt,content,cover_image,category,seo_title,seo_description,published_at,discussion_question"
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("Article loading error:", error.message);
    return null;
  }

  return (data as Article | null) ?? null;
}

function articleUrl(slug: string) {
  return `${SITE_URL}/blog/${encodeURIComponent(slug)}`;
}

function absoluteHttpUrl(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim(), SITE_URL);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function textForMeta(value: string | null | undefined): string {
  return (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderSafeArticleHtml(content: string): string {
  const isHtml = /^\s*<(?:p|h[1-6]|div|ul|ol|blockquote|pre|figure|article|section|strong|em|a|img|br)\b/i.test(content);
  const rawHtml = isHtml
    ? content
    : content
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
        .join("\n");

  return sanitizeHtml(rawHtml, {
    allowedTags: [
      "p", "br", "h2", "h3", "h4", "strong", "b", "em", "i",
      "u", "s", "ul", "ol", "li", "blockquote", "a", "code", "pre",
    ],
    allowedAttributes: {
      a: ["href", "title"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href || "";
        const isExternal = /^https?:\/\//i.test(href) && (() => {
          try {
            return new URL(href).hostname !== "jude-play.com" &&
              new URL(href).hostname !== "www.jude-play.com";
          } catch {
            return false;
          }
        })();
        return {
          tagName,
          attribs: {
            ...(href ? { href } : {}),
            ...(attribs.title ? { title: attribs.title } : {}),
            ...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {}),
          },
        };
      },
    },
  });
}

function formattedDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: "Article Not Found | JUDE Play", robots: { index: false, follow: false } };
  }

  const title = textForMeta(article.seo_title) || article.title;
  const description =
    textForMeta(article.seo_description) ||
    textForMeta(article.excerpt) ||
    `Read ${article.title} on JUDE Play.`;
  const canonical = articleUrl(article.slug);
  const image = absoluteHttpUrl(article.cover_image) || FALLBACK_IMAGE;

  return {
    title: `${title} | JUDE Play`,
    description: description.slice(0, 160),
    alternates: { canonical },
    openGraph: {
      title,
      description: description.slice(0, 200),
      url: canonical,
      siteName: "JUDE Play",
      type: "article",
      ...(article.published_at && !Number.isNaN(Date.parse(article.published_at))
        ? { publishedTime: new Date(article.published_at).toISOString() }
        : {}),
      images: [{ url: image, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description.slice(0, 200),
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  const safeHtml = renderSafeArticleHtml(article.content || "");
  const defaultQuestion = /\p{Script=Arabic}/u.test(article.title)
    ? `شو بتحب تضيف على مقال «${article.title}»؟`
    : `What would you add to “${article.title}”?`;
  const dateLabel = formattedDate(article.published_at);
  const cover = absoluteHttpUrl(article.cover_image);
  const canonical = articleUrl(article.slug);
  const description =
    textForMeta(article.seo_description) ||
    textForMeta(article.excerpt) ||
    textForMeta(article.content).slice(0, 160);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    url: canonical,
    ...(cover ? { image: cover } : {}),
    ...(article.published_at && !Number.isNaN(Date.parse(article.published_at))
      ? { datePublished: new Date(article.published_at).toISOString() }
      : {}),
    publisher: { "@type": "Organization", name: "JUDE Play", url: SITE_URL },
  };

  return (
    <main className="min-h-screen bg-[#070914] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-fuchsia-300">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog" className="hover:text-fuchsia-300">Blog</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-slate-200">{article.title}</span>
        </nav>

        <article className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#0d1020] sm:mt-10">
          <div className="px-5 py-8 sm:px-9 sm:py-10 md:px-12">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-fuchsia-300">
                {article.category?.trim() || "Gaming"}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">JUDE PLAY BLOG</span>
            </div>

            <h1 className="mt-6 text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {article.title}
            </h1>

            {article.excerpt?.trim() && (
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                {article.excerpt.trim()}
              </p>
            )}

            {dateLabel && (
              <p className="mt-5 text-sm text-slate-400">
                Published <time dateTime={article.published_at || undefined}>{dateLabel}</time>
              </p>
            )}
          </div>

          {cover && (
            <div className="mx-5 overflow-hidden rounded-2xl border border-white/10 sm:mx-9 md:mx-12">
              <img
                src={cover}
                alt={article.title}
                className="max-h-[480px] w-full object-cover"
                loading="eager"
              />
            </div>
          )}

          <div className="px-5 pb-10 pt-8 sm:px-9 md:px-12 md:pb-12">
            {safeHtml ? (
              <div
                className="jude-article-content break-words text-base leading-8 text-slate-300 sm:text-lg sm:leading-9 [&_a]:text-fuchsia-300 [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-fuchsia-200 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-fuchsia-500/60 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-slate-300 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:leading-snug [&_h2]:text-white [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_h4]:mb-2 [&_h4]:mt-6 [&_h4]:font-bold [&_h4]:text-white [&_li]:mb-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-7 [&_p]:mb-5 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-black/40 [&_pre]:p-4 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-7"
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            ) : (
              <p className="text-slate-400">Article content is not available yet.</p>
            )}

            <ArticleEngagement
              key={article.id}
              articleId={article.id}
              question={article.discussion_question?.trim() || defaultQuestion}
            />

            <div className="mt-12 rounded-2xl border border-cyan-400/20 bg-cyan-500/[0.06] p-5 sm:p-6">
              <h2 className="text-lg font-extrabold text-white">Discover games made by JUDE Game Studio</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Explore JUDE Originals, including LAHZA, JUDOKU, and JUDE Space Shooter.
              </p>
              <Link
                href="/jude-originals"
                className="mt-4 inline-flex rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-sm font-bold text-cyan-200 transition hover:bg-cyan-400/20"
              >
                Explore JUDE Originals →
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3 border-t border-white/10 pt-7">
              <Link
                href="/blog"
                className="inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-3 text-sm font-bold transition hover:opacity-90"
              >
                ← More articles
              </Link>
              <Link
                href="/"
                className="inline-flex rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold transition hover:bg-white/10"
              >
                Browse games
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
