import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { LinkedinIcon, InstagramIcon, YoutubeIcon, XIcon } from "@/components/social-icons";
import { FOOTER_COLUMNS } from "@/lib/constants";

const SOCIALS = [
  { icon: LinkedinIcon, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: InstagramIcon, label: "Instagram", href: "https://instagram.com" },
  { icon: XIcon, label: "X", href: "https://x.com" },
  { icon: YoutubeIcon, label: "YouTube", href: "https://youtube.com" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-nav-deep-green pt-20">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="#top" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="NavUrja"
                width={30}
                height={30}
                className="h-7 w-7 object-contain"
              />
              <span className="text-base font-semibold tracking-tight text-white">
                NavUrja
              </span>
            </Link>
            <p className="mt-4 max-w-[26ch] text-sm text-white/55">
              New Energy. New Possibility.
            </p>
            <a
              href="mailto:hello@navurja.com"
              className="mt-4 inline-block text-sm font-medium text-nav-light-green underline-offset-4 hover:underline"
            >
              hello@navurja.com
            </a>

            <div className="mt-8 max-w-xs">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                Stay in the loop
              </p>
              <div className="mt-3">
                <NewsletterForm />
              </div>
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                {column.heading}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-white/10" />

        <div className="flex flex-col-reverse items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} NavUrja. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none relative -mt-4 h-28 select-none overflow-hidden sm:h-36 lg:h-44"
      >
        <span
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-bold text-white/[0.05]"
          style={{ fontSize: "clamp(5rem, 16vw, 12rem)", letterSpacing: "-0.02em" }}
        >
          NAVURJA
        </span>
      </div>
    </footer>
  );
}
