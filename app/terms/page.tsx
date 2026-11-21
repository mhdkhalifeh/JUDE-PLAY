import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://www.jude-play.com";
const LAST_UPDATED = "November 21, 2026";

export const metadata: Metadata = {
  title: "Terms & Conditions | JUDE Play",
  description:
    "Read the JUDE Play Terms & Conditions, including rules for using our browser games, accounts, intellectual property, third-party games and services.",
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: { index: true, follow: true },
};

const sections = [
  { id: "acceptance", title: "1. Acceptance of the Terms" },
  { id: "about", title: "2. About JUDE Play" },
  { id: "eligibility", title: "3. Eligibility and Family Use" },
  { id: "accounts", title: "4. Accounts and Login" },
  { id: "use", title: "5. Acceptable Use" },
  { id: "games", title: "6. Games and Third-Party Content" },
  { id: "ownership", title: "7. Intellectual Property" },
  { id: "features", title: "8. Scores, Ratings and Game Features" },
  { id: "advertising", title: "9. Advertising and External Links" },
  { id: "availability", title: "10. Availability and Changes" },
  { id: "disclaimer", title: "11. Disclaimer of Warranties" },
  { id: "liability", title: "12. Limitation of Liability" },
  { id: "responsibility", title: "13. Your Responsibility" },
  { id: "privacy", title: "14. Privacy and Cookies" },
  { id: "termination", title: "15. Restriction or Termination" },
  { id: "changes", title: "16. Changes to These Terms" },
  { id: "contact", title: "17. Contact Us" },
];

const sectionClass =
  "scroll-mt-28 rounded-2xl border border-white/10 bg-[#101526] p-6 sm:p-8";
const paragraphClass = "mt-4 text-sm leading-8 text-slate-300 sm:text-base";
const listClass = "mt-4 list-disc space-y-2 pl-5 text-sm leading-8 text-slate-300 sm:text-base";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#070914] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-7 text-sm text-slate-400">
          <Link href="/" className="hover:text-cyan-300">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-slate-200" aria-current="page">Terms & Conditions</span>
        </nav>

        <header className="mb-10 overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-[#172347] via-[#11172a] to-[#211230] p-7 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">JUDE PLAY · Legal</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Terms & Conditions</h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-300 sm:text-base">
            These terms explain the rules for using JUDE Play, playing browser games, creating an account,
            and interacting with content and services available through our website.
          </p>
          <p className="mt-5 text-xs font-medium text-slate-400">Last updated: {LAST_UPDATED}</p>
        </header>

        <div className="grid items-start gap-7 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-white/10 bg-[#101526] p-5 lg:sticky lg:top-24">
            <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-300">On this page</h2>
            <nav aria-label="Terms sections" className="mt-4 max-h-[65vh] space-y-1 overflow-y-auto pr-1">
              {sections.map((section) => (
                <a key={section.id} href={`#${section.id}`} className="block rounded-lg px-2 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
                  {section.title}
                </a>
              ))}
            </nav>
            <div className="mt-5 border-t border-white/10 pt-4 text-sm">
              <Link href="/privacy" className="font-semibold text-fuchsia-300 hover:text-fuchsia-200">
                Privacy & Cookie Policy →
              </Link>
            </div>
          </aside>

          <div className="space-y-5">
            <section id="acceptance" className={sectionClass}>
              <h2 className="text-xl font-extrabold sm:text-2xl">1. Acceptance of the Terms</h2>
              <p className={paragraphClass}>
                By accessing or using JUDE Play (the “Service”), you agree to these Terms & Conditions.
                If you do not agree, please stop using the Service. Different terms may also apply to
                third-party games or services made available through JUDE Play.
              </p>
            </section>

            <section id="about" className={sectionClass}>
              <h2 className="text-xl font-extrabold sm:text-2xl">2. About JUDE Play</h2>
              <p className={paragraphClass}>
                JUDE Play is a browser-gaming website offering a collection of free-to-access games.
                The collection includes games developed by JUDE Game Studio, such as titles featured
                in our <Link href="/jude-originals" className="text-cyan-300 underline underline-offset-4">JUDE Originals</Link> section,
                and games supplied or hosted by independent third-party providers.
              </p>
              <p className={paragraphClass}>
                JUDE Play is not the developer or owner of every game on the website. The identity,
                availability and terms of individual games may vary.
              </p>
            </section>

            <section id="eligibility" className={sectionClass}>
              <h2 className="text-xl font-extrabold sm:text-2xl">3. Eligibility and Family Use</h2>
              <p className={paragraphClass}>
                You must use the Service in accordance with laws applicable to you. If you are a minor,
                you should use JUDE Play with the permission or supervision of a parent or legal guardian
                where required. Parents and guardians are encouraged to review game content, external links,
                advertising and privacy practices before allowing children to play.
              </p>
            </section>

            <section id="accounts" className={sectionClass}>
              <h2 className="text-xl font-extrabold sm:text-2xl">4. Accounts and Login</h2>
              <p className={paragraphClass}>
                Some features, including favorites, ratings or saved activity, may require an account.
                You are responsible for keeping your sign-in credentials secure and for activity carried
                out through your account. Provide accurate information when requested and do not access
                another person’s account without authorization.
              </p>
              <p className={paragraphClass}>
                If you believe your account has been accessed without permission, contact us through
                the <Link href="/contact" className="text-cyan-300 underline underline-offset-4">Contact page</Link>.
              </p>
            </section>

            <section id="use" className={sectionClass}>
              <h2 className="text-xl font-extrabold sm:text-2xl">5. Acceptable Use</h2>
              <p className={paragraphClass}>When using JUDE Play, you agree not to:</p>
              <ul className={listClass}>
                <li>Use the Service for unlawful, fraudulent or abusive purposes.</li>
                <li>Attempt to interfere with the website, servers, authentication or game functionality.</li>
                <li>Use bots, exploits or manipulation to falsify game activity, ratings or other site metrics.</li>
                <li>Upload, transmit or distribute malicious code or material that violates others’ rights.</li>
                <li>Copy, redistribute or commercially exploit games or website materials without the required permission.</li>
                <li>Attempt to bypass access restrictions or obtain information about other users without authorization.</li>
              </ul>
            </section>

            <section id="games" className={sectionClass}>
              <h2 className="text-xl font-extrabold sm:text-2xl">6. Games and Third-Party Content</h2>
              <p className={paragraphClass}>
                Some games run in embedded frames or are delivered through third-party game providers.
                Those providers may control the game code, content, advertising, technical operation and
                availability, and may have their own terms and privacy policies.
              </p>
              <p className={paragraphClass}>
                We aim to provide useful game information and remove or correct problematic listings when
                identified, but we cannot guarantee that every third-party game will always work on every
                browser or device. Please notify us of broken games or potentially infringing content through
                our <Link href="/contact" className="text-cyan-300 underline underline-offset-4">Contact page</Link>.
              </p>
            </section>

            <section id="ownership" className={sectionClass}>
              <h2 className="text-xl font-extrabold sm:text-2xl">7. Intellectual Property</h2>
              <p className={paragraphClass}>
                JUDE Play’s original website design, text, branding and original game content are protected
                to the extent permitted by applicable intellectual-property law. Third-party games, artwork,
                trademarks and other content remain the property of their respective owners or licensors.
              </p>
              <p className={paragraphClass}>
                Access to a game on JUDE Play does not transfer ownership or grant permission to reproduce,
                modify, redistribute or sell that game outside the rights granted by its owner.
                If you believe content infringes your rights, please contact us with the relevant URL and
                details sufficient to review the concern.
              </p>
            </section>

            <section id="features" className={sectionClass}>
              <h2 className="text-xl font-extrabold sm:text-2xl">8. Scores, Ratings and Game Features</h2>
              <p className={paragraphClass}>
                Features such as ratings, favorites, recently played games, achievements and play counts are
                intended to improve the gaming experience. They may depend on account status, technical
                availability or other factors. These figures and features should not be treated as guaranteed,
                permanent records or as having monetary value.
              </p>
              <p className={paragraphClass}>
                We may correct inaccurate or manipulated activity and adjust features when necessary to
                protect fair use and the integrity of the Service.
              </p>
            </section>

            <section id="advertising" className={sectionClass}>
              <h2 className="text-xl font-extrabold sm:text-2xl">9. Advertising and External Links</h2>
              <p className={paragraphClass}>
                JUDE Play may display advertisements and links to third-party websites. Advertising providers
                and external websites may operate under their own terms and privacy policies. An external
                link or advertisement does not necessarily indicate our endorsement of the advertised service.
              </p>
              <p className={paragraphClass}>
                For information about cookies, analytics and advertising technologies, see our
                {" "}<Link href="/privacy" className="text-cyan-300 underline underline-offset-4">Privacy & Cookie Policy</Link>.
              </p>
            </section>

            <section id="availability" className={sectionClass}>
              <h2 className="text-xl font-extrabold sm:text-2xl">10. Availability and Changes</h2>
              <p className={paragraphClass}>
                We may add, update, remove or temporarily disable games, features or pages for maintenance,
                licensing, security, quality or operational reasons. We do not guarantee uninterrupted access
                to any particular game, feature or saved experience.
              </p>
            </section>

            <section id="disclaimer" className={sectionClass}>
              <h2 className="text-xl font-extrabold sm:text-2xl">11. Disclaimer of Warranties</h2>
              <p className={paragraphClass}>
                To the extent permitted by applicable law, the Service is offered on an “as is” and “as
                available” basis. We do not guarantee that every game or feature will be uninterrupted,
                error-free, secure or compatible with your device. Nothing in these Terms excludes rights
                or warranties that cannot legally be excluded.
              </p>
            </section>

            <section id="liability" className={sectionClass}>
              <h2 className="text-xl font-extrabold sm:text-2xl">12. Limitation of Liability</h2>
              <p className={paragraphClass}>
                To the extent permitted by applicable law, JUDE Play will not be responsible for indirect,
                incidental or consequential losses arising from use of or inability to use the Service,
                including interruptions or issues with third-party games. This provision does not limit
                liability where doing so would be prohibited by law.
              </p>
            </section>

            <section id="responsibility" className={sectionClass}>
              <h2 className="text-xl font-extrabold sm:text-2xl">13. Your Responsibility</h2>
              <p className={paragraphClass}>
                You are responsible for the way you use the Service, including compliance with applicable
                laws and respect for the rights of other users, game developers and third parties.
                Please report security concerns, abusive behavior or rights-related issues through our
                Contact page rather than attempting to interfere with the Service.
              </p>
            </section>

            <section id="privacy" className={sectionClass}>
              <h2 className="text-xl font-extrabold sm:text-2xl">14. Privacy and Cookies</h2>
              <p className={paragraphClass}>
                Our <Link href="/privacy" className="text-cyan-300 underline underline-offset-4">Privacy & Cookie Policy</Link> explains
                how information may be collected, used and shared in connection with accounts, gameplay,
                analytics, advertising and third-party providers. Please review it alongside these Terms.
              </p>
            </section>

            <section id="termination" className={sectionClass}>
              <h2 className="text-xl font-extrabold sm:text-2xl">15. Restriction or Termination</h2>
              <p className={paragraphClass}>
                We may restrict access to certain features or accounts when reasonably necessary to address
                security threats, abuse, legal requirements or violations of these Terms, subject to
                applicable law. You may stop using the Service at any time.
              </p>
            </section>

            <section id="changes" className={sectionClass}>
              <h2 className="text-xl font-extrabold sm:text-2xl">16. Changes to These Terms</h2>
              <p className={paragraphClass}>
                We may revise these Terms as the Service develops or legal requirements change. The updated
                version will be posted on this page with a revised “Last updated” date. If changes are
                material, we will take any additional steps required by applicable law.
              </p>
            </section>

            <section id="contact" className={sectionClass}>
              <h2 className="text-xl font-extrabold sm:text-2xl">17. Contact Us</h2>
              <p className={paragraphClass}>
                Questions about these Terms, content ownership, game availability or account-related issues?
                Please contact JUDE Play using our
                {" "}<Link href="/contact" className="text-cyan-300 underline underline-offset-4">Contact page</Link>.
              </p>
            </section>

            <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-6 text-sm">
              <Link href="/" className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/10">← Back to JUDE Play</Link>
              <Link href="/privacy" className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 font-semibold text-white transition hover:opacity-90">Privacy & Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
