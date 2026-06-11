import Link from "next/link";

export const metadata = {
  title: "Contact Us | JUDE Play",
  description:
    "Contact JUDE Play for support, feedback, game suggestions and business inquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#070914] px-6 py-16 text-white">
      <section className="mx-auto max-w-6xl">
        <p className="font-bold uppercase tracking-[0.3em] text-fuchsia-400">
          CONTACT
        </p>

        <h1 className="mt-4 text-5xl font-black">Contact JUDE Play</h1>

        <p className="mt-6 max-w-3xl leading-8 text-slate-300">
          Have questions, suggestions, technical issues or business inquiries?
          We would love to hear from you. Our team reviews messages and responds
          as soon as possible.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-slate-950 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-400">
              General Contact
            </p>

            <h2 className="mt-4 text-2xl font-black">Contact Email</h2>

            <p className="mt-4 text-slate-400">
              For general questions, suggestions and feedback.
            </p>

            <p className="mt-5 font-bold text-white">
              contact@jude-play.com
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-400">
              Support
            </p>

            <h2 className="mt-4 text-2xl font-black">Player Support</h2>

            <p className="mt-4 text-slate-400">
              For login issues, game problems or account assistance.
            </p>

            <p className="mt-5 font-bold text-white">
              support@jude-play.com
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-400">
              Business
            </p>

            <h2 className="mt-4 text-2xl font-black">Business Inquiries</h2>

            <p className="mt-4 text-slate-400">
              For partnerships, publishing requests and platform inquiries.
            </p>

            <p className="mt-5 font-bold text-white">
              info@jude-play.com
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-slate-950 p-8">
          <h2 className="text-3xl font-black">Before You Contact Us</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white/5 p-5">
              <h3 className="text-xl font-black">Game Suggestions</h3>
              <p className="mt-3 leading-7 text-slate-400">
                If you want to suggest a new HTML5 game category or report a
                game that is not working correctly, please include the game name
                and a short description of the issue.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-5">
              <h3 className="text-xl font-black">Response Time</h3>
              <p className="mt-3 leading-7 text-slate-400">
                We usually review messages within 24 to 72 hours. Response times
                may vary depending on the type of request.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-fuchsia-500/30 bg-fuchsia-500/10 p-8">
          <h2 className="text-3xl font-black">Explore JUDE Play</h2>

          <p className="mt-4 max-w-3xl leading-8 text-slate-300">
            While waiting for a response, you can explore our latest games,
            trending titles and gaming guides.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 font-black text-white"
            >
              Browse Games
            </Link>

            <Link
              href="/blog"
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-bold text-white hover:bg-white/10"
            >
              Read Blog
            </Link>

            <Link
              href="/faq"
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-bold text-white hover:bg-white/10"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}