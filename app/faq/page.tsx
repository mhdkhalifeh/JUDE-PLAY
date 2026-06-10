export const metadata = {
  title: "FAQ | JUDE Play",
  description:
    "Find answers to common questions about JUDE Play, free browser games, HTML5 games, mobile gaming and online gameplay.",
};

const faqs = [
  {
    question: "What is JUDE Play?",
    answer:
      "JUDE Play is a free online gaming platform where players can enjoy browser-based HTML5 games instantly without downloads or installations.",
  },
  {
    question: "Are the games on JUDE Play free?",
    answer:
      "Yes. Games on JUDE Play are free to play directly from your browser.",
  },
  {
    question: "Do I need to download anything?",
    answer:
      "No. JUDE Play games run directly in your web browser, so you do not need to download or install extra software.",
  },
  {
    question: "Can I play JUDE Play games on mobile?",
    answer:
      "Many games on JUDE Play work on mobile phones, tablets and desktop browsers. Some games may perform better on larger screens depending on controls.",
  },
  {
    question: "What types of games are available?",
    answer:
      "JUDE Play includes action, puzzle, racing, arcade, sports, adventure, hypercasual and many other game categories.",
  },
  {
    question: "How often are new games added?",
    answer:
      "New games are added regularly to keep the platform fresh and enjoyable for returning players.",
  },
  {
    question: "Do I need an account?",
    answer:
      "You can browse and play many games without an account. Creating an account helps you use features like favorites, profile and recently played games.",
  },
  {
    question: "Is JUDE Play safe to use?",
    answer:
      "JUDE Play is designed to provide a simple and safe browser gaming experience. We focus on accessible HTML5 games and clear navigation.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#070914] text-white">
      <div className="mx-auto max-w-5xl px-8 py-12">
        <p className="font-bold uppercase tracking-[0.3em] text-fuchsia-400">
          HELP CENTER
        </p>

        <h1 className="mt-4 text-5xl font-black">
          Frequently Asked Questions
        </h1>

        <p className="mt-4 max-w-3xl text-slate-400">
          Learn more about JUDE Play, how our free browser games work, and how
          you can enjoy online games instantly.
        </p>

        <div className="mt-12 space-y-5">
          {faqs.map((item) => (
            <section
              key={item.question}
              className="rounded-3xl border border-white/10 bg-slate-950 p-7"
            >
              <h2 className="text-2xl font-black">{item.question}</h2>
              <p className="mt-4 leading-8 text-slate-300">{item.answer}</p>
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-3xl border border-white/10 bg-slate-950 p-8">
          <h2 className="text-3xl font-black">Still Need Help?</h2>
          <p className="mt-4 leading-8 text-slate-300">
            If you have questions about JUDE Play, game access, partnerships or
            website support, please visit our Contact page and reach out to us.
          </p>
        </section>
      </div>
    </main>
  );
}