import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#070914]/80 px-8 py-4 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <Link href="/" className="text-2xl font-black">
          JUDE <span className="text-fuchsia-400">PLAY</span>
        </Link>

        <div className="hidden gap-6 text-sm text-slate-300 md:flex">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/category/Action" className="hover:text-white">Action</Link>
          <Link href="/category/Racing" className="hover:text-white">Racing</Link>
          <Link href="/category/Arcade" className="hover:text-white">Arcade</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </div>

        <Link href="/search">
          <button className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2 text-sm font-bold">
            Search
          </button>
        </Link>
      </div>
    </nav>
  );
}