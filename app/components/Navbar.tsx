"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function Navbar() {
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070914]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="JUDE Play"
            className="h-14 w-auto"
            loading="lazy"
          />
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          <Link className="rounded-xl px-4 py-2 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white" href="/">
            🏠 Home
          </Link>

          <Link className="rounded-xl px-4 py-2 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white" href="/top-games">
            🎮 Top Games
          </Link>

          <Link className="rounded-xl px-4 py-2 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white" href="/new-games">
            ⚡ New Games
          </Link>

          <Link className="rounded-xl px-4 py-2 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white" href="/categories">
            🗂 Categories
          </Link>

          <Link className="rounded-xl px-4 py-2 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white" href="/stats">
            📊 Stats
          </Link>

          <Link className="rounded-xl px-4 py-2 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white" href="/favorites">
            ❤️ Favorites
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2 text-sm font-black text-white shadow-[0_0_25px_rgba(168,85,247,.45)]"
          >
            Profile
          </Link>

          <button
            onClick={logout}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-bold text-white hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}