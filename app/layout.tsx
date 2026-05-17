import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "JUDE Play",
  description: "Play the best online browser games instantly.",
  manifest: "/manifest.json",
themeColor: "#a855f7",
verification: {
  google: "p374ZgarSEzrqSxEtYE9A52mynaz5nZaHCaxRHSP4oU",
},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}