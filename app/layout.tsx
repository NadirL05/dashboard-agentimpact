import type { Metadata } from "next";
import { Syne, Outfit, Space_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-syne" });
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-outfit" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Portefeuille — AgentImpact",
  description: "Suivi interne domaine/Stripe/Calendly/SEO pour HostIA, PLU-IA et Hector.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${syne.variable} ${outfit.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
