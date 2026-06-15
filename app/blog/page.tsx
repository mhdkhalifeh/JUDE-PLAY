import Link from "next/link";

const posts = [
  {
    title: "Best Browser Games to Play Online",
    slug: "best-browser-games",
    description:
      "Discover the best browser games you can play instantly without downloads or installation.",
  },
  {
    title: "Why HTML5 Games Are Popular",
    slug: "why-html5-games-are-popular",
    description:
      "Learn why HTML5 games became the standard for fast, lightweight and accessible online gaming.",
  },
  {
    title: "Top Puzzle Games for Quick Fun",
    slug: "top-puzzle-games",
    description:
      "Explore puzzle games that challenge your brain and provide quick entertainment on any device.",
  },
  {
    title: "Free Online Games Without Downloads",
    slug: "free-online-games",
    description:
      "A guide to playing free online games directly in your browser without installing anything.",
  },
  {
    title: "Best Game Categories on JUDE Play",
    slug: "best-game-categories",
    description:
      "Explore the most popular game categories available on JUDE Play.",
  },
  {
    title: "The Rise of Multiplayer Browser Games",
    slug: "multiplayer-browser-games",
    description:
      "Why multiplayer browser games continue to grow in popularity.",
  },
  {
    title: "Why Browser Games Work Great on Mobile Devices",
    slug: "browser-games-mobile",
    description:
      "Discover how browser games provide smooth mobile gaming experiences.",
  },
  {
    title: "The Future of Browser Gaming",
    slug: "future-of-browser-gaming",
    description:
      "How browser gaming continues to evolve and attract millions of players.",
  },
  {
  title: "Best Racing Games You Can Play in Your Browser",
  slug: "best-racing-games-browser",
  description:
    "Discover why browser racing games are perfect for quick speed challenges, casual competition and instant fun without downloads.",
},
{
  title: "Top Action Games for Fast-Paced Fun",
  slug: "top-action-games-online",
  description:
    "Explore action games that challenge reflexes, timing and decision-making directly from your browser.",
},
{
  title: "Best Arcade Games to Play for Free",
  slug: "best-arcade-games",
  description:
    "Learn why arcade games remain popular and how free browser arcade games deliver simple, addictive fun.",
},
{
  title: "How Browser Games Have Changed Over the Years",
  slug: "history-of-browser-games",
  description:
    "A look at how browser games evolved from simple web games to modern HTML5 gaming experiences.",
},
{
  title: "Best Games to Play During Short Breaks",
  slug: "games-for-short-breaks",
  description:
    "Discover why browser games are perfect for short breaks, quick entertainment and casual gaming sessions.",
},
];

export const metadata = {
  title: "Gaming Blog | JUDE Play",
  description:
    "Read gaming guides, browser game tips, HTML5 game articles and online gaming recommendations on the JUDE Play blog.",
  alternates: {
    canonical: "https://jude-play.com/blog",
  },
  openGraph: {
    title: "Gaming Blog | JUDE Play",
    description:
      "Read gaming guides, browser game tips, HTML5 game articles and online gaming recommendations on the JUDE Play blog.",
    url: "https://jude-play.com/blog",
    siteName: "JUDE Play",
    images: [
      {
        url: "https://jude-play.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JUDE Play Blog",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gaming Blog | JUDE Play",
    description:
      "Read gaming guides, browser game tips, HTML5 game articles and online gaming recommendations on the JUDE Play blog.",
    images: ["https://jude-play.com/og-image.jpg"],
  },
  
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#070914] text-white">
      <div className="mx-auto max-w-7xl px-8 py-12">
        <p className="font-bold uppercase tracking-[0.3em] text-fuchsia-400">
          JUDE PLAY BLOG
        </p>

        <h1 className="mt-4 text-5xl font-black">Gaming Blog</h1>

        <p className="mt-4 max-w-4xl text-slate-400">
          Read guides, tips and articles about free browser games, HTML5 games,
          online gaming categories and how to enjoy games instantly without
          downloads.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-3xl border border-white/10 bg-slate-950 p-8 transition hover:-translate-y-1 hover:border-fuchsia-500"
            >
              <h2 className="text-2xl font-black">{post.title}</h2>

              <p className="mt-4 leading-7 text-slate-400">
                {post.description}
              </p>

              <span className="mt-6 inline-block font-bold text-fuchsia-400">
                Read Article →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}