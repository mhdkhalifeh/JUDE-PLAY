import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070914] px-8 py-10 text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-black text-white">JUDE PLAY</h3>
          <p className="mt-2 text-sm text-slate-400">Play beyond limits.</p>
        </div>

        <div className="flex flex-wrap gap-5 text-sm">
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms of Use</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </div>

        <p className="text-sm text-slate-500">© 2026 JUDE Play. All rights reserved.</p>
      </div>
    </footer>
  );
}