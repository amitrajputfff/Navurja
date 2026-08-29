import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://navurja.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NavUrja — Give Waste a New Energy",
    template: "%s — NavUrja",
  },
  description:
    "NavUrja collects used cooking oil and gives it a new life through responsible recycling and renewable energy.",
  keywords: [
    "used cooking oil collection",
    "UCO recycling India",
    "biofuel",
    "circular economy",
    "renewable energy",
    "NavUrja",
  ],
  openGraph: {
    title: "NavUrja — Give Waste a New Energy",
    description:
      "NavUrja collects used cooking oil and gives it a new life through responsible recycling and renewable energy.",
    url: siteUrl,
    siteName: "NavUrja",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NavUrja — Give Waste a New Energy",
    description:
      "NavUrja collects used cooking oil and gives it a new life through responsible recycling and renewable energy.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b3d2e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider delay={150}>
          {children}
          <Toaster position="bottom-right" richColors />
        </TooltipProvider>
      </body>
    </html>
  );
}
