import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "JUDE Play",
  description: "Play free online games",
  verification: {
    google: "UiLKAHH70uSkc0Zq722p58jPJ1xEXQMqKsd_-uyqKNw",
  },


  openGraph: {
    title: "JUDE Play",
    description: "Play the best HTML5 browser games online instantly.",
    url: "https://jude-play.com",
    siteName: "JUDE Play",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "JUDE Play",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "JUDE Play",
    description: "Play the best HTML5 browser games online instantly.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1791515120755145"
          crossOrigin="anonymous"
        ></script>
      </head>

      <body className="bg-[#070914] text-white">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}