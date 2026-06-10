export const metadata = {
  title: "About JUDE Play",
  description:
    "Learn more about JUDE Play, our mission, browser games, HTML5 gaming and our growing online gaming platform.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#070914] text-white">
      <div className="mx-auto max-w-5xl px-8 py-12">
        <p className="font-bold uppercase tracking-[0.3em] text-fuchsia-400">
          ABOUT JUDE PLAY
        </p>

        <h1 className="mt-4 text-5xl font-black">
          About JUDE Play
        </h1>

        <p className="mt-6 leading-8 text-slate-300">
          JUDE Play is a modern browser gaming platform dedicated to providing
          free, instant and accessible online entertainment for players around
          the world. Our mission is simple: make gaming easy, fast and
          enjoyable without requiring downloads, installations or expensive
          hardware.
        </p>

        <p className="mt-6 leading-8 text-slate-300">
          The platform offers a growing collection of HTML5 browser games across
          multiple categories including action, puzzle, arcade, racing,
          sports, adventure, multiplayer and hypercasual games. Every title is
          selected to provide an engaging experience while remaining easy to
          access from any modern web browser.
        </p>

        <p className="mt-6 leading-8 text-slate-300">
          Unlike traditional gaming platforms that require large downloads and
          frequent updates, JUDE Play allows players to start gaming
          immediately. Whether you are using a desktop computer, laptop, tablet
          or mobile device, our games are designed to load quickly and provide
          smooth gameplay experiences.
        </p>

        <section className="mt-12 rounded-3xl border border-white/10 bg-slate-950 p-8">
          <h2 className="text-3xl font-black">Our Mission</h2>

          <p className="mt-6 leading-8 text-slate-300">
            At JUDE Play, we believe gaming should be available to everyone.
            We focus on simplicity, accessibility and variety, ensuring that
            players of all ages can discover games that match their interests
            and skill levels.
          </p>

          <p className="mt-6 leading-8 text-slate-300">
            Our goal is to create a platform where users can explore hundreds
            of games, discover new favorites and enjoy quality entertainment
            without unnecessary barriers.
          </p>
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-slate-950 p-8">
          <h2 className="text-3xl font-black">Why Choose JUDE Play?</h2>

          <ul className="mt-6 space-y-4 text-slate-300">
            <li>✓ Free browser-based gaming</li>
            <li>✓ No downloads or installations required</li>
            <li>✓ Fast loading HTML5 games</li>
            <li>✓ Multiple game categories</li>
            <li>✓ Mobile and desktop compatibility</li>
            <li>✓ Regularly updated game library</li>
            <li>✓ Simple and user-friendly experience</li>
          </ul>

          <p className="mt-6 leading-8 text-slate-300">
            We continuously work to improve the platform by adding new content,
            improving navigation and helping players discover exciting games
            through categories, statistics and recommendations.
          </p>
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-slate-950 p-8">
          <h2 className="text-3xl font-black">Game Categories</h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-bold">Action Games</h3>
              <p className="mt-3 text-slate-300">
                Fast-paced experiences that challenge reflexes and
                decision-making skills.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold">Puzzle Games</h3>
              <p className="mt-3 text-slate-300">
                Brain-training games designed to improve logic, focus and
                problem-solving abilities.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold">Racing Games</h3>
              <p className="mt-3 text-slate-300">
                Speed-focused challenges where players compete against time,
                opponents or obstacles.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold">Arcade Games</h3>
              <p className="mt-3 text-slate-300">
                Classic gameplay concepts with modern browser technology.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold">Sports Games</h3>
              <p className="mt-3 text-slate-300">
                Competitive experiences inspired by real-world sports and
                activities.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold">Adventure Games</h3>
              <p className="mt-3 text-slate-300">
                Exploration-focused games that encourage discovery and
                progression.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-slate-950 p-8">
          <h2 className="text-3xl font-black">
            Accessibility and Performance
          </h2>

          <p className="mt-6 leading-8 text-slate-300">
            One of the biggest advantages of browser gaming is convenience.
            Players can enjoy games instantly without consuming storage space
            or installing software. JUDE Play takes advantage of modern web
            technologies to provide smooth and responsive gameplay directly
            through the browser.
          </p>

          <p className="mt-6 leading-8 text-slate-300">
            The platform is optimized to work on a wide range of devices,
            helping players enjoy gaming wherever they are.
          </p>
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-slate-950 p-8">
          <h2 className="text-3xl font-black">Growing Every Day</h2>

          <p className="mt-6 leading-8 text-slate-300">
            The JUDE Play library continues to grow with new titles being added
            regularly. We are committed to expanding our collection and
            improving the overall user experience through better discovery
            tools, enhanced statistics, useful gaming guides and
            community-focused features.
          </p>

          <p className="mt-6 leading-8 text-slate-300">
            As our platform evolves, our commitment remains the same:
            delivering high-quality browser gaming that is simple, enjoyable
            and accessible for everyone.
          </p>
        </section>
      </div>
    </main>
  );
}