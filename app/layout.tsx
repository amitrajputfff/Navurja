import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0e241c" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:rounded-full focus-visible:bg-primary focus-visible:px-5 focus-visible:py-2.5 focus-visible:text-sm focus-visible:font-medium focus-visible:text-primary-foreground"
        >
          Skip to content
        </a>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider delay={150}>
            {children}
            <Toaster position="bottom-right" richColors />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
