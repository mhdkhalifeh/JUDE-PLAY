"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

const ADMIN_EMAIL = "your-email@example.com";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    }

    getUser();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#070914]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="group flex items-center">
          <img
            src="/logo.png"
            alt="JUDE PLAY"
            className="h-16 w-auto object-contain drop-shadow-[0_0_18px_rgba(168,85,247,0.9)] transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_30px_rgba(217,70,239,1)]"
          />
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-300 lg:flex">
          <Link href="/" className="transition hover:text-fuchsia-400">
            Home
          </Link>

          {user && (
            <>
              <Link
                href="/favorites"
                className="transition hover:text-fuchsia-400"
              >
                Favorites
              </Link>

              <Link
                href="/profile"
                className="transition hover:text-fuchsia-400"
              >
                Profile
              </Link>
            </>
          )}

          <Link href="/contact" className="transition hover:text-fuchsia-400">
            Contact
          </Link>

          {user?.email === ADMIN_EMAIL && (
            <Link
              href="/admin"
              className="font-semibold text-fuchsia-400 hover:text-white"
            >
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/profile">
                <button className="hidden rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-bold text-white transition hover:bg-white/10 md:block">
                  Profile
                </button>
              </Link>

              <button
                onClick={logout}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login">
              <button className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/30 transition hover:scale-105">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}