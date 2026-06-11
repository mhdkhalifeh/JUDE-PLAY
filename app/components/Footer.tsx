import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#090b18]">
      <div className="mx-auto grid max-w-7xl gap-10 px-8 py-14 md:grid-cols-4">
        <div>
          <h3 className="text-3xl font-black text-white">
            JUDE PLAY
          </h3>

          <p className="mt-4 text-slate-400 leading-7">
            Play the best HTML5 browser games instantly.
            No downloads. No limits. Just gaming.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white">
            Navigation
          </h4>

          <div className="mt-4 space-y-3 text-slate-400">
            <Link href="/">Home</Link><br />
            <Link href="/top-games">Top Games</Link><br />
            <Link href="/new-games">New Games</Link><br />
            <Link href="/categories">Categories</Link>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white">
            Content
          </h4>

          <div className="mt-4 space-y-3 text-slate-400">
            <Link href="/blog">Blog</Link><br />
            <Link href="/faq">FAQ</Link><br />
            <Link href="/stats">Statistics</Link><br />
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white">
            Legal
          </h4>

          <div className="mt-4 space-y-3 text-slate-400">
            <Link href="/privacy">Privacy Policy</Link><br />
            <Link href="/terms">Terms of Service</Link><br />
            <Link href="/about">About Us</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-sm text-slate-500">
        © 2026 JUDE PLAY. All rights reserved.
      </div>
    </footer>
  );
}