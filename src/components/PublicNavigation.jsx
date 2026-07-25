"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function PublicNavigation({ links, settings }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/85 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-16">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <img
            src="/images/logo/monarque-logo.svg"
            alt="Monarque Limo logo"
            className="h-11 w-auto rounded-xl border border-white/10 bg-white/5 object-contain p-1"
          />
          <span className="flex flex-col">
            <span className="font-display text-lg leading-none text-white">{settings?.site_name || "Monarque Limo"}</span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.35em] text-white/45">
              {settings?.site_tagline || "Premium Chauffeur"}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-pill ${isActive(link.href) ? "bg-white/10 text-gold" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="/#booking" className="btn-gold hidden px-4 py-2 text-xs sm:inline-flex">
            Book Now
          </a>
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-gold/40 hover:text-gold lg:hidden"
          >
            <div className="flex flex-col gap-1.5">
              <span className={`h-0.5 w-5 rounded-full bg-current transition ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`h-0.5 w-5 rounded-full bg-current transition ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-5 rounded-full bg-current transition ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-ink/95 px-4 py-4 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-2xl border px-4 py-3 text-sm uppercase tracking-[0.24em] transition ${isActive(link.href) ? "border-gold/30 bg-gold/10 text-gold" : "border-white/10 bg-white/5 text-white/80 hover:border-gold/30 hover:text-gold"}`}
              >
                {link.label}
              </Link>
            ))}
            <a href="/#booking" onClick={() => setMobileOpen(false)} className="btn-gold mt-2 justify-center">
              Reserve a ride
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
