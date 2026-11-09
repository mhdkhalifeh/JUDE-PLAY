
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import LegacyBlogPostPage, {
  generateMetadata as legacyGenerateMetadata,
} from "./legacy-page";
import sanitizeHtml from "sanitize-html";



export const revalidate = 60;

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
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getArticle(slug: string) {
  const { data, error } = await supabase
    .from("articles")
    .select(
      "id,title,slug,excerpt,content,cover_image,category,seo_title,seo_description,published_at"
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("Article loading error:", error.message);
    return null;
  }

  return data as Article | null;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return legacyGenerateMetadata({
      params: Promise.resolve({ slug }),
    });
  }

  const title = article.seo_title || article.title;
  const description =
    article.seo_description ||
    article.excerpt ||
    `Read ${article.title} on JUDE Play.`;

  const canonical = `https://www.jude-play.com/blog/${slug}`;

  const images = article.cover_image
    ? [article.cover_image]
    : ["https://www.jude-play.com/og-image.jpg"];

  return {
    title: `${title} | JUDE Play`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "JUDE Play",
      type: "article" as const,
      images,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  // Old articles remain available through the legacy page.
  if (!article) {
    return LegacyBlogPostPage({
      params: Promise.resolve({ slug }),
    });
  }

 
const isHtml = /^\s*</.test(article.content);

const rawHtml = isHtml
  ? article.content
  : article.content
      .split(/\n\s*\n/)
      .filter(Boolean)
      .map((paragraph) => {
        const escaped = paragraph
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br>");

        return `<p>${escaped}</p>`;
      })
      .join("");

const safeHtml = sanitizeHtml(rawHtml, {
  allowedTags: [
    "p", "br", "h2", "h3", "strong",
    "b", "em", "i", "u", "s",
    "ul", "ol", "li", "blockquote",
    "a", "code", "pre"
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"]
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        href: attribs.href || "#",
        target: "_blank",
        rel: "noopener noreferrer"
      }
    })
  }
});

  return (
    <main className="min-h-screen bg-[#070914] text-white">
      <article className="mx-auto max-w-4xl px-6 py-12 md:px-8">
        <Link
          href="/blog"
          className="font-semibold text-fuchsia-400 transition hover:text-fuchsia-300"
        >
          ← Back to Blog
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-fuchsia-400">
            {article.category || "Gaming"}
          </span>

          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            JUDE PLAY BLOG
          </span>
        </div>

        <h1 className="mt-6 text-4xl font-black leading-tight md:text-5xl">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="mt-6 text-lg leading-8 text-slate-400">
            {article.excerpt}
          </p>
        )}

        {article.published_at && (
          <p className="mt-5 text-sm text-slate-500">
            Published{" "}
            {new Date(article.published_at).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </p>
        )}

        {article.cover_image && (
          <div className="mt-10 overflow-hidden rounded-3xl border border-white/10">
            <img
              src={article.cover_image}
              alt={article.title}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        
<div
  className="jude-article-content mt-12 text-lg leading-9 text-slate-300"
  dangerouslySetInnerHTML={{ __html: safeHtml }}
/>


        <div className="mt-14 border-t border-white/10 pt-8">
          <Link
            href="/blog"
            className="inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 font-bold transition hover:opacity-90"
          >
            Explore More Articles
          </Link>
        </div>
      </article>
    </main>
  );
}
