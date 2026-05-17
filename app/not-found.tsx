import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070914] p-8 text-white">
      <div className="max-w-2xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-400">
          ERROR 404
        </p>

        <h1 className="mt-6 text-7xl font-black">
          Game Over
        </h1>

        <p className="mt-6 text-lg text-slate-400">
          The page you are looking for does not exist.
        </p>

        <Link
          href="/"
          className="mt-10 inline-block rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-4 font-black shadow-[0_0_30px_rgba(168,85,247,.35)]"
        >
          Back To Home
        </Link>
      </div>
    </main>
  );
}