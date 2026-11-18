"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import {
  Menu,
  X,
  Search,
  Home,
  Gamepad2,
  Zap,
  Grid3X3,
  BookOpen,
  BarChart3,
  HelpCircle,
  Info,
  Mail,
  Heart,
  User,
  LogOut,
  LogIn,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/top-games", label: "Top Games", icon: Gamepad2 },
  { href: "/new-games", label: "New Games", icon: Zap },
  { href: "/categories", label: "Categories", icon: Grid3X3 },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [checkingUser, setCheckingUser] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUser(data.user);
      setCheckingUser(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!active) return;
        setUser(session?.user ?? null);
        setCheckingUser(false);
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = search.trim();
    if (!term) return;
    setMenuOpen(false);
    router.push(`/search/${encodeURIComponent(term)}`);
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Unable to log out. Please try again.");
      return;
    }
    setMenuOpen(false);
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#14151d]/95 text-white backdrop-blur-xl">
      <div className="flex h-[64px] w-full items-center gap-3 px-3 sm:px-5 lg:gap-5">
        <button
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="jude-navigation-menu"
          onClick={() => setMenuOpen((value) => !value)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-200 transition hover:bg-white/10"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link href="/" aria-label="JUDE Play — Home" className="flex shrink-0 items-center">
          <img src="/logo.png" alt="JUDE Play" className="h-10 w-auto max-w-[125px] object-contain sm:h-11 sm:max-w-[150px]" />
        </Link>

        <form
          role="search"
          onSubmit={submitSearch}
          className="mx-auto hidden h-10 w-full max-w-[460px] items-center gap-2 rounded-full border border-white/[0.07] bg-[#34354d] px-4 text-slate-300 transition focus-within:border-violet-400/60 focus-within:bg-[#393b56] sm:flex"
        >
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search games and categories"
            aria-label="Search games and categories"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
          />
          <button type="submit" aria-label="Search" className="shrink-0 hover:text-white">
            <Search size={19} />
          </button>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0">
          <Link
            href="/favorites"
            title="My favorites"
            aria-label="My favorites"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2c2d39] text-slate-200 transition hover:bg-[#3c3c50] hover:text-fuchsia-300"
          >
            <Heart size={19} />
          </Link>

          {!checkingUser && user ? (
            <>
              <Link
                href="/profile"
                className="flex h-10 items-center gap-2 rounded-full bg-[#2c2d39] px-3 text-sm font-bold text-white transition hover:bg-[#3c3c50]"
              >
                <User size={18} />
                <span className="hidden md:inline">My Profile</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                title="Log out"
                aria-label="Log out"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2c2d39] text-slate-200 transition hover:bg-[#3c3c50]"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : !checkingUser ? (
            <Link
              href="/login"
              className="flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3 text-sm font-bold text-white transition hover:opacity-90 sm:px-4"
            >
              <LogIn size={17} />
              <span className="hidden min-[420px]:inline">Login</span>
            </Link>
          ) : (
            <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" aria-label="Checking account" />
          )}
        </div>
      </div>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 top-[64px] z-40 h-[calc(100dvh-64px)] w-full cursor-default bg-black/55"
          />
          <nav
            id="jude-navigation-menu"
            aria-label="Main navigation"
            className="absolute left-0 top-[64px] z-50 max-h-[calc(100dvh-64px)] w-[min(320px,90vw)] overflow-y-auto border-r border-white/10 bg-[#161720] p-4 shadow-2xl"
          >
            <form onSubmit={submitSearch} className="mb-4 flex items-center gap-2 rounded-xl bg-[#34354d] px-3 py-2 sm:hidden">
              <Search size={18} className="text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search games..."
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
              />
              <button type="submit" className="text-xs font-bold text-cyan-300">Go</button>
            </form>
            <div className="space-y-1">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    pathname === href
                      ? "bg-violet-600/20 text-violet-200"
                      : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
                  }`}
                >
                  <Icon size={19} className="text-violet-400" />
                  {label}
                </Link>
              ))}
              {user && (
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/[0.07]">
                  <User size={19} className="text-violet-400" /> My Profile
                </Link>
              )}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
