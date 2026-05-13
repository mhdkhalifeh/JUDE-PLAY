export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#070914] p-8 text-white">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-slate-950 p-8">
        <h1 className="text-4xl font-black">Privacy Policy</h1>

        <p className="mt-6 text-slate-300 leading-8">
          JUDE Play respects your privacy. We may collect basic usage data to
          improve the gaming experience, analyze traffic, and display relevant
          advertisements.
        </p>

        <p className="mt-4 text-slate-300 leading-8">
          We do not sell personal information. Third-party services such as
          analytics or advertising providers may use cookies according to their
          own privacy policies.
        </p>

        <p className="mt-4 text-slate-300 leading-8">
          By using JUDE Play, you agree to this privacy policy.
        </p>
      </div>
    </div>
  );
}