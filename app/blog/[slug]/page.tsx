import Link from "next/link";
import { notFound } from "next/navigation";

const posts: Record<
  string,
  {
    title: string;
    description: string;
    content: string[];
  }
> = {
  "best-browser-games": {
    title: "Best Browser Games to Play Online",
    description:
      "Browser games are one of the easiest ways to enjoy gaming instantly without downloads.",
    content: [
      "Browser games have become a popular choice for players who want quick entertainment without installing large files or creating complicated accounts. With modern HTML5 technology, online games can run smoothly on desktop computers, tablets and mobile browsers.",
      "JUDE Play focuses on making browser gaming simple and accessible. Players can open a game, start playing instantly and explore different categories such as action, puzzle, racing, arcade and sports.",
      "The best browser games are usually fast to load, easy to understand and enjoyable for short or long gaming sessions. Whether you want a relaxing puzzle game or a fast action challenge, browser games offer a flexible experience for many types of players.",
      "One of the biggest advantages of browser games is convenience. There is no need to download software, update applications or use powerful hardware. A modern web browser is enough to start playing.",
    ],
  },

  "why-html5-games-are-popular": {
    title: "Why HTML5 Games Are Popular",
    description:
      "HTML5 games became popular because they are fast, lightweight and work across many devices.",
    content: [
      "HTML5 games replaced older browser technologies because they work directly inside modern web browsers. This makes them easier to access, safer to use and more compatible with different devices.",
      "Players enjoy HTML5 games because they usually load quickly and do not require installation. Developers also prefer HTML5 because it supports graphics, sound, animation and interaction without requiring extra plugins.",
      "For platforms like JUDE Play, HTML5 games are ideal because they allow users to play instantly. This creates a smooth experience for visitors who want entertainment without waiting.",
      "Another reason HTML5 games are popular is mobile compatibility. Many games can be played on phones and tablets, making them accessible anywhere.",
    ],
  },

  "top-puzzle-games": {
    title: "Top Puzzle Games for Quick Fun",
    description:
      "Puzzle games are perfect for players who enjoy logic, timing and problem solving.",
    content: [
      "Puzzle games are among the most enjoyable browser game categories because they challenge the mind while remaining easy to start. Many puzzle games use simple controls but offer deep and rewarding gameplay.",
      "Players often choose puzzle games when they want a relaxing experience that still requires focus. Matching games, logic games, physics puzzles and strategy challenges are all popular examples.",
      "On JUDE Play, puzzle games are designed to be easy to access and enjoyable across different devices. You can start a quick puzzle session in seconds and continue exploring new challenges.",
      "Puzzle games are also great for improving concentration, pattern recognition and decision-making skills while still being fun.",
    ],
  },

  "free-online-games-without-downloads": {
    title: "Free Online Games Without Downloads",
    description:
      "Playing games without downloads is one of the biggest advantages of browser gaming.",
    content: [
      "Free online games without downloads are perfect for players who want instant entertainment. Instead of installing software or using storage space, players can simply open a game in their browser.",
      "This makes browser games especially useful for casual players, students, office breaks and anyone who wants quick access to fun games on different devices.",
      "JUDE Play offers a growing collection of games that can be played instantly. The platform is built around speed, simplicity and accessibility.",
      "No-download gaming also reduces technical problems. Players do not need to worry about updates, installation errors or device compatibility in the same way they would with traditional downloadable games.",
    ],
  },

  "best-game-categories": {
    title: "Best Game Categories on JUDE Play",
    description:
      "JUDE Play offers multiple game categories for different types of players.",
    content: [
      "Game categories help players discover the right type of experience quickly. Some players enjoy action games, while others prefer puzzles, racing, sports or arcade challenges.",
      "JUDE Play organizes games into categories so visitors can easily browse and find something that matches their interests. This makes the platform easier to use and more enjoyable.",
      "Action games are great for fast reflexes, puzzle games are ideal for problem solving, racing games provide speed and competition, while arcade games offer simple and addictive fun.",
      "As the JUDE Play library grows, categories will continue to help players explore new games and discover popular titles.",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return {
      title: "Article Not Found | JUDE Play",
    };
  }

  return {
    title: `${post.title} | JUDE Play Blog`,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-[#070914] text-white">
      <article className="mx-auto max-w-4xl px-8 py-12">
        <Link href="/blog" className="text-fuchsia-400">
          ← Back to Blog
        </Link>

        <p className="mt-8 font-bold uppercase tracking-[0.3em] text-fuchsia-400">
          JUDE PLAY BLOG
        </p>

        <h1 className="mt-4 text-5xl font-black">{post.title}</h1>

        <p className="mt-4 text-xl leading-8 text-slate-400">
          {post.description}
        </p>

        <div className="mt-10 space-y-6 leading-8 text-slate-300">
          {post.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}