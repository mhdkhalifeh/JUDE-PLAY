"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import {
  Home,
  Gamepad2,
  Zap,
  Grid3X3,
  BookOpen,
  MoreHorizontal,
  BarChart3,
  HelpCircle,
  Info,
  Mail,
  Heart,
  User,
  LogOut,
  LogIn,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checkingUser, setCheckingUser] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setCheckingUser(false);
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setCheckingUser(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  }

  const mainLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/top-games", label: "Top Games", icon: Gamepad2 },
    { href: "/new-games", label: "New Games", icon: Zap },
    { href: "/categories", label: "Categories", icon: Grid3X3 },
    { href: "/blog", label: "Blog", icon: BookOpen },
  ];

  const moreLinks = [
    { href: "/stats", label: "Stats", icon: BarChart3 },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Mail },
    { href: "/favorites", label: "Favorites", icon: Heart },
  ];

  const linkClass = (href: string) =>
    `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
      pathname === href
        ? "bg-fuchsia-600 text-white shadow-[0_0_20px_rgba(217,70,239,.35)]"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070914]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="JUDE Play"
            className="h-14 w-auto"
            loading="lazy"
          />
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {mainLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={linkClass(item.href)}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <MoreHorizontal size={18} />
              More
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/10 bg-slate-950 p-3 shadow-2xl">
                {moreLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={linkClass(item.href)}
                    >
                      <Icon size={17} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          {!checkingUser && user && (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2 text-sm font-black text-white shadow-[0_0_25px_rgba(168,85,247,.45)]"
              >
                <User size={17} />
                Profile
              </Link>

              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-bold text-white hover:bg-white/10"
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          )}

          {!checkingUser && !user && (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2 text-sm font-black text-white shadow-[0_0_25px_rgba(168,85,247,.45)]"
            >
              <LogIn size={17} />
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}