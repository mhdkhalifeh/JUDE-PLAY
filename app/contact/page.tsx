export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#070914] p-8 text-white"> 
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-slate-950 p-8">

        <h1 className="text-4xl font-black">
          Contact Us
        </h1>

        <p className="mt-6 leading-8 text-slate-300">
          Have questions, suggestions, or business inquiries?
          We'd love to hear from you.
        </p>

        <div className="mt-10 space-y-6">

          <div>
            <p className="text-sm text-slate-500">
              Email
            </p>

            <p className="mt-2 text-lg font-bold">
              contact@judeplay.com
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Business
            </p>

            <p className="mt-2 text-lg font-bold">
              partnerships@judeplay.com
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}