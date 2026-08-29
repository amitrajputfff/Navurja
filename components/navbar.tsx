"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/constants";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-3 z-50 flex justify-center px-4 sm:top-5"
    >
      <div
        className={`glass flex w-full max-w-4xl items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-300 sm:px-5 ${
          scrolled ? "max-w-3xl py-2 shadow-lg" : ""
        }`}
      >
        <Link href="#top" className="flex shrink-0 items-center gap-2">
          <Image
            src="/logo.png"
            alt="NavUrja"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
            priority
          />
          <span className="hidden text-sm font-semibold tracking-tight text-nav-primary sm:block">
            NavUrja
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-nav-dark-text/80 transition-colors hover:bg-nav-mint hover:text-nav-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button
          render={<a href="#pickup" />}
          nativeButton={false}
          size="sm"
          className="hidden rounded-full bg-nav-primary text-white hover:bg-nav-deep-green md:inline-flex"
        >
          Request Pickup <ArrowRight className="size-3.5" />
        </Button>

        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full md:hidden"
                aria-label="Open menu"
              />
            }
          >
            <Menu className="size-5 text-nav-primary" />
          </SheetTrigger>
          <SheetContent side="right" className="bg-background">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-nav-primary">
                <Image
                  src="/logo.png"
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                NavUrja
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {NAV_LINKS.map((link) => (
                <SheetClose
                  key={link.href}
                  nativeButton={false}
                  render={
                    <a
                      href={link.href}
                      className="rounded-lg px-3 py-3 text-base font-medium text-nav-dark-text transition-colors hover:bg-nav-mint"
                    />
                  }
                >
                  {link.label}
                </SheetClose>
              ))}
              <SheetClose
                nativeButton={false}
                render={
                  <a
                    href="#pickup"
                    className="mt-3 flex items-center justify-center gap-2 rounded-full bg-nav-primary px-4 py-3 text-sm font-semibold text-white"
                  />
                }
              >
                Request Pickup <ArrowRight className="size-4" />
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  );
}
