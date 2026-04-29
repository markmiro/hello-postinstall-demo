import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/utils";
import "./globals.css";

const title = "hello-postinstall — npm postinstall hook demo";
const description =
  "A tiny npm package to demonstrate why running install scripts from untrusted packages is risky";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s — hello-postinstall",
  },
  description,
  applicationName: "hello-postinstall",
  keywords: [
    "npm",
    "postinstall",
    "security",
    "OWASP",
    "ignore-scripts",
    "supply chain",
    "demo",
  ],
  authors: [{ name: "Mark Miro", url: "https://github.com/markmiro" }],
  creator: "Mark Miro",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title,
    description,
    siteName: "hello-postinstall",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-svh bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
