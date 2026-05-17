"use client";

import Link from "next/link";

export default function ErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] p-8 text-white">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-slate-950 p-10 text-center">
        <h1 className="text-5xl font-black text-red-500">
          Something Went Wrong
        </h1>

        <p className="mt-4 text-slate-400">
          An unexpected error occurred.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 font-bold"
        >
          Back Home
        </Link>
      </div>
    </main>
  );
}