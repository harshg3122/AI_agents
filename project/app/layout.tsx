import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-agents.netlify.app"),
  title: "AI Agents - Find the Right Agent for Your Business",
  description:
    "Discover curated AI agents with ready JSON configs. Smart search matches your business needs with the perfect automation solution.",
  keywords: "AI agents, automation, business tools, JSON config, smart search",
  openGraph: {
    title: "AI Agents - Find the Right Agent for Your Business",
    description: "Discover curated AI agents with ready JSON configs.",
    type: "website",
    url: "https://ai-agents.netlify.app",
    siteName: "AI Agents",
    images: [
      {
        url: "https://ai-agents.netlify.app/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agents - Find the Right Agent for Your Business",
    description: "Discover curated AI agents with ready JSON configs.",
    images: ["https://ai-agents.netlify.app/og-image.png"],
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-[#0B0B0F] text-[#EDEDF2] antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
