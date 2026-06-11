import Link from "next/link";

export const metadata = {
  title: "Check Your Email | JUDE Play",
  description: "Your JUDE Play account has been created. Please check your email.",
};

export default function SignupSuccessPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  return (
    <main className="min-h-screen bg-[#070914] px-6 py-16 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-slate-950 p-10 text-center shadow-2xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-fuchsia-600/20 text-4xl">
          ✉️
        </div>

        <p className="mt-8 font-bold uppercase tracking-[0.3em] text-fuchsia-400">
          ACCOUNT CREATED
        </p>

        <h1 className="mt-4 text-5xl font-black">Check Your Email</h1>

        <p className="mt-6 leading-8 text-slate-300">
          Your JUDE Play account has been created successfully.
          {searchParams.email ? (
            <>
              {" "}
              We sent a confirmation message to{" "}
              <strong>{searchParams.email}</strong>.
            </>
          ) : (
            " Please check your email inbox to confirm your account."
          )}
        </p>

        <p className="mt-4 leading-8 text-slate-400">
          After confirming your email, you can log in and start saving favorite
          games, tracking recently played games and using your player profile.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 font-black text-white"
          >
            Back to Login
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-bold text-white hover:bg-white/10"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}