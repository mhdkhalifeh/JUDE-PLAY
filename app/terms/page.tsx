export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#070914] p-8 text-white"> 
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-slate-950 p-8">
        <h1 className="text-4xl font-black">Terms of Use</h1>

        <p className="mt-6 leading-8 text-slate-300">
          By using JUDE Play, you agree to use the platform for lawful and
          personal entertainment purposes only.
        </p>

        <p className="mt-4 leading-8 text-slate-300">
          Games and content displayed on JUDE Play may belong to their
          respective owners. Users must not copy, redistribute, or misuse any
          content without permission.
        </p>

        <p className="mt-4 leading-8 text-slate-300">
          JUDE Play may update, remove, or modify games and features at any
          time.
        </p>
      </div>
    </div>
  );
}