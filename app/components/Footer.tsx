import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050816]">
      <div className="mx-auto max-w-7xl px-8 py-14">

        <div className="grid gap-10 md:grid-cols-4">

          <div>
            <h2 className="text-3xl font-black text-white">
              JUDE PLAY
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              Play the best HTML5 browser games instantly.
              No downloads. No limits. Just gaming.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-black text-white">
              Navigation
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-slate-400">
              <Link href="/" className="hover:text-fuchsia-400">
                Home
              </Link>

              <Link href="/favorites" className="hover:text-fuchsia-400">
                Favorites
              </Link>

              <Link href="/profile" className="hover:text-fuchsia-400">
                Profile
              </Link>

              <Link href="/contact" className="hover:text-fuchsia-400">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black text-white">
              Categories
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-slate-400">
              <Link href="/category/Action" className="hover:text-fuchsia-400">
                Action Games
              </Link>

              <Link href="/category/Racing" className="hover:text-fuchsia-400">
                Racing Games
              </Link>

              <Link href="/category/Shooter" className="hover:text-fuchsia-400">
                Shooter Games
              </Link>

              <Link href="/category/Arcade" className="hover:text-fuchsia-400">
                Arcade Games
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black text-white">
              Legal
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-slate-400">
              <Link href="/privacy" className="hover:text-fuchsia-400">
                Privacy Policy
              </Link>

              <Link href="/terms" className="hover:text-fuchsia-400">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-slate-500">
          © 2026 JUDE PLAY. All rights reserved.
        </div>
      </div>
    </footer>
  );
}