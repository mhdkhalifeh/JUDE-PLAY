import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy & Cookie Policy | JUDE Play",
  description:
    "Learn how JUDE Play handles account data, game activity, cookies, analytics, advertising and privacy requests.",
  alternates: { canonical: "https://www.jude-play.com/privacy" },
};

const updated = "November 21, 2026";

const navigation = [
  { id: "who-we-are", title: "1. Who we are" },
  { id: "information", title: "2. Information we collect" },
  { id: "sources", title: "3. Where information comes from" },
  { id: "purposes", title: "4. How we use information" },
  { id: "legal-bases", title: "5. Legal bases" },
  { id: "sharing", title: "6. Third parties and sharing" },
  { id: "games", title: "7. Third-party games" },
  { id: "retention", title: "8. Retention" },
  { id: "security", title: "9. Security" },
  { id: "rights", title: "10. Your privacy rights" },
  { id: "children", title: "11. Children's privacy" },
  { id: "transfers", title: "12. International transfers" },
  { id: "links", title: "13. External links" },
  { id: "changes", title: "14. Policy changes" },
  { id: "contact", title: "15. Contact us" },
  { id: "cookies", title: "Cookie Policy" },
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-b border-white/10 pb-9 pt-8 last:border-b-0">
      <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-8 text-slate-300 [&_a]:text-cyan-300 [&_a]:underline [&_a:hover]:text-cyan-200 [&_li]:pl-1 [&_strong]:text-white">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#070914] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
          <Link href="/" className="hover:text-cyan-300">Home</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span className="text-slate-200">Privacy Policy</span>
        </nav>

        <div className="mt-8 max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">JUDE PLAY · YOUR PRIVACY</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-slate-400">Last updated: {updated}</p>
          <p className="mt-6 text-base leading-8 text-slate-300">
            This policy explains how JUDE Play handles information when you browse our website,
            play games, create an account, save favorites, rate games, or contact us. It also
            explains the role of third-party games, analytics and advertising technologies.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-white/10 bg-[#101425] p-5 lg:sticky lg:top-24">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-white">On this page</h2>
            <nav aria-label="Privacy policy sections" className="mt-4 space-y-1">
              {navigation.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="block rounded-lg px-2 py-1.5 text-sm leading-5 text-slate-400 transition hover:bg-white/5 hover:text-cyan-300">
                  {item.title}
                </a>
              ))}
            </nav>
          </aside>

          <article className="min-w-0 rounded-3xl border border-white/10 bg-[#101322] px-5 py-2 sm:px-9">
            <Section id="who-we-are" title="1. Who we are">
              <p>JUDE Play is an online browser-games platform available at <a href="https://www.jude-play.com">www.jude-play.com</a>. The platform includes original JUDE Game Studio games and games supplied or hosted by third parties.</p>
              <p>In this policy, “JUDE Play”, “we”, “us” and “our” refer to the operator of the JUDE Play website. For privacy questions or requests, use our <Link href="/contact">contact page</Link>.</p>
            </Section>

            <Section id="information" title="2. Information we collect">
              <p>The categories of information involved depend on how you use the website:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li><strong>Account information:</strong> an email address, account identifier, profile information and authentication data associated with sign-in.</li>
                <li><strong>Game activity:</strong> games played, play counts, saved favorites, recently played games, ratings and other progress-related information where a feature supports it.</li>
                <li><strong>Technical and usage information:</strong> browser and device characteristics, pages visited, approximate location inferred from network information, timestamps and diagnostic information collected by hosting or analytics tools.</li>
                <li><strong>Messages:</strong> the details you choose to provide when contacting us.</li>
                <li><strong>Cookies and similar identifiers:</strong> identifiers used for authentication, website functionality, analytics or advertising, as described in our Cookie Policy below.</li>
              </ul>
              <p>You can browse many parts of JUDE Play without signing in. Some features, such as syncing favorites or submitting an account-linked rating, require an account.</p>
            </Section>

            <Section id="sources" title="3. Where information comes from">
              <p>We receive information directly from you when you register, interact with account features or contact us. We also receive technical information automatically through the website and its service providers. If you use a third-party sign-in provider, authentication information may be supplied by that provider.</p>
            </Section>

            <Section id="purposes" title="4. How we use information">
              <ul className="list-disc space-y-2 pl-6">
                <li>To operate games, accounts and core website features.</li>
                <li>To remember favorites, recently played games and user-submitted ratings.</li>
                <li>To measure site and game performance, understand errors and improve usability.</li>
                <li>To help prevent abuse, fraud and unauthorized access.</li>
                <li>To respond to messages and privacy requests.</li>
                <li>To support advertising and measure its performance where advertising services are enabled and applicable privacy requirements are met.</li>
                <li>To comply with applicable legal obligations.</li>
              </ul>
            </Section>

            <Section id="legal-bases" title="5. Legal bases for processing">
              <p>Where data-protection law requires a legal basis, processing may rely on providing a requested service, legitimate interests such as maintaining security and improving the platform, compliance with law, or your consent where required. The relevant basis depends on the information, the purpose and your location.</p>
              <p>Where consent is required for non-essential cookies or personalized advertising, the relevant technology must be configured to respect that requirement. Publishing this policy alone does not obtain consent.</p>
            </Section>

            <Section id="sharing" title="6. Third parties and sharing">
              <p>We use service providers to operate JUDE Play. Depending on the feature, these may include:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li><strong>Supabase:</strong> authentication, database records and related website features. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase privacy information</a>.</li>
                <li><strong>Vercel:</strong> website hosting and delivery. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel Privacy Policy</a>.</li>
                <li><strong>Google Analytics:</strong> website measurement where enabled. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.</li>
                <li><strong>Google AdSense:</strong> an advertising service for which JUDE Play may display advertising or related scripts when configured. Advertising availability depends on approval and implementation. <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">How Google uses information in advertising</a>.</li>
                <li><strong>External game providers:</strong> providers of embedded or externally hosted games, including GameMonetize, which may process information within their own game environments.</li>
              </ul>
              <p>We may also disclose information where legally required or reasonably necessary to protect the website and its users. This policy does not claim that every provider above receives every category of data.</p>
            </Section>

            <Section id="games" title="7. Third-party games">
              <p>Some games on JUDE Play are embedded from external services. When you start such a game, the game provider may receive technical information, such as your IP address and browser details, and may use its own cookies, analytics or advertising technologies.</p>
              <p>The provider’s processing is governed by its own privacy practices. We recommend reviewing relevant game-provider notices before playing. Games developed by JUDE Game Studio may have additional game-specific features described in their interfaces.</p>
              <p>Where available, refer to <a href="https://gamemonetize.com/" target="_blank" rel="noopener noreferrer">GameMonetize</a> for information about its services and applicable policies.</p>
            </Section>

            <Section id="retention" title="8. How long information is kept">
              <p>Information is retained for as long as reasonably needed for the relevant service, website security, legal compliance or dispute resolution. Account-related records may remain while your account is active. Some information may be retained in backups or logs for a limited additional period, subject to provider practices and applicable law.</p>
              <p>Contact us if you would like to request deletion of account-related information. We may need to verify your identity and may retain limited information where the law permits or requires it.</p>
            </Section>

            <Section id="security" title="9. How we protect information">
              <p>We use established hosting and authentication providers and aim to limit access to information according to operational needs. No internet service can guarantee absolute security. Please protect your account credentials and avoid sharing sensitive personal information inside games or public features.</p>
            </Section>

            <Section id="rights" title="10. Your privacy rights and choices">
              <p>Depending on your location and applicable law, you may be able to request access to, correction of, deletion of, or a copy of personal information, and to object to or restrict certain processing. You may also have the right to withdraw consent where consent was used.</p>
              <p>Submit requests through the <Link href="/contact">contact page</Link>. We may ask for information needed to verify account ownership before acting. You may also have a right to complain to the data-protection authority in your jurisdiction.</p>
              <p>For Google advertising controls, you can visit <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">My Ad Center</a>. Your browser also offers settings for managing cookies. These controls are not a substitute for an applicable consent-management mechanism on JUDE Play.</p>
            </Section>

            <Section id="children" title="11. Children's privacy">
              <p>JUDE Play offers games that may appeal to different age groups, but it is not designed to knowingly collect personal information from children below the age at which they can lawfully provide the relevant consent. Parents and guardians should supervise younger users and review the privacy practices of external game providers.</p>
              <p>If you believe a child has supplied personal information that should not have been collected, please contact us so we can review the request.</p>
            </Section>

            <Section id="transfers" title="12. International data transfers">
              <p>Our hosting, authentication, analytics, advertising and game providers may process information in countries other than the one where you live. Applicable privacy protections and transfer requirements vary by service provider and jurisdiction.</p>
            </Section>

            <Section id="links" title="13. Links to other websites">
              <p>JUDE Play may contain links to other websites or games hosted elsewhere. We do not control their privacy notices or data-processing practices. Please review the relevant policy before sharing information with another service.</p>
            </Section>

            <Section id="changes" title="14. Changes to this policy">
              <p>We may update this policy when our website features, partners or legal requirements change. The date at the top of the page indicates the latest published revision.</p>
            </Section>

            <Section id="contact" title="15. Questions and privacy requests">
              <p>For questions about this policy, your account data or privacy requests, please contact JUDE Play through our <Link href="/contact">Contact page</Link>. Please describe your request and, if relevant, the account email used on JUDE Play.</p>
            </Section>

            <section id="cookies" className="scroll-mt-28 py-10">
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-5 py-6 sm:px-7">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Additional notice</p>
                <h2 className="mt-2 text-3xl font-black text-white">JUDE Play Cookie Policy</h2>
                <p className="mt-3 text-sm text-slate-300">This section explains how cookies and comparable technologies may be used on our platform.</p>
              </div>
              <div className="mt-7 space-y-7 text-[15px] leading-8 text-slate-300">
                <div><h3 className="text-xl font-bold text-white">1. What are cookies?</h3><p className="mt-2">Cookies are small pieces of data that a browser stores to remember information about a website visit. Similar technologies may include local storage, pixels and device identifiers.</p></div>
                <div><h3 className="text-xl font-bold text-white">2. Why are they used?</h3><p className="mt-2">They can help maintain account sessions, remember settings, understand website usage, support security and, where enabled, measure or deliver advertising.</p></div>
                <div><h3 className="text-xl font-bold text-white">3. Cookie categories</h3>
                  <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full min-w-[520px] text-left text-sm">
                      <thead className="bg-white/5 text-white"><tr><th className="p-3">Category</th><th className="p-3">Possible purpose</th></tr></thead>
                      <tbody className="divide-y divide-white/10"><tr><td className="p-3 font-semibold">Essential</td><td className="p-3">Authentication, session continuity and security</td></tr><tr><td className="p-3 font-semibold">Analytics</td><td className="p-3">Understanding visits, game engagement and errors</td></tr><tr><td className="p-3 font-semibold">Advertising</td><td className="p-3">Ad delivery, frequency controls and effectiveness measurement, where enabled</td></tr><tr><td className="p-3 font-semibold">Third-party games</td><td className="p-3">Features, progress, analytics or advertising within embedded games</td></tr></tbody>
                    </table>
                  </div>
                </div>
                <div><h3 className="text-xl font-bold text-white">4. First-party and third-party technologies</h3><p className="mt-2">First-party technologies are associated with JUDE Play. Third-party providers, such as authentication, analytics, advertising and embedded-game services, may set or read their own identifiers under their applicable policies.</p></div>
                <div><h3 className="text-xl font-bold text-white">5. Managing your choices</h3><p className="mt-2">You can block or remove many cookies through your browser settings, although doing so may affect sign-in or gameplay. Where the law requires consent for optional technologies, JUDE Play must provide an appropriate consent mechanism; a written policy alone does not serve as that mechanism. You can also review Google advertising choices at <a className="text-cyan-300 underline" href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">My Ad Center</a>.</p></div>
                <div><h3 className="text-xl font-bold text-white">6. Changes to cookie practices</h3><p className="mt-2">Our use of cookies may change as website features and integrations change. We will update this notice when needed.</p></div>
              </div>
            </section>
          </article>
        </div>
        <div className="mt-8 text-sm text-slate-500">
          <Link href="/terms" className="hover:text-cyan-300">Terms &amp; Conditions</Link>
          <span className="mx-3">·</span>
          <Link href="/contact" className="hover:text-cyan-300">Contact</Link>
        </div>
      </div>
    </main>
  );
}
