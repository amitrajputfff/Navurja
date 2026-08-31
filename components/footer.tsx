import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { NAV_LINKS, SOCIALS } from "@/lib/constants";

export function Footer() {
  return (
    <footer id="site-footer" className="relative overflow-hidden bg-nav-deep-green pt-20 pb-6">
      <div className="relative mx-auto max-w-3xl px-6">
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            aria-label="NavUrja home"
            className="mb-6 flex size-16 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/15"
          >
            <Image
              src="/logo-icon.png"
              alt=""
              width={32}
              height={32}
              className="size-8 object-contain"
            />
          </Link>

          <nav
            aria-label="Footer"
            className="mb-8 flex flex-wrap justify-center gap-x-6 gap-y-2"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mb-8 flex items-center gap-2">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/30 hover:bg-white/5 hover:text-white"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>

          <div className="mb-10 w-full max-w-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
              Stay in the loop
            </p>
            <NewsletterForm />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-white/40">
            <span>&copy; {new Date().getFullYear()} NavUrja. All rights reserved.</span>
            <Link href="/privacy" className="transition-colors hover:text-white/70">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white/70">
              Terms of Service
            </Link>
            <a
              href="mailto:hello@navurja.com"
              className="transition-colors hover:text-white/70"
            >
              hello@navurja.com
            </a>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="relative -mt-2 h-32 select-none sm:h-40 lg:h-48"
      >
        <TextHoverEffect text="NAVURJA" />
      </div>
    </footer>
  );
}
