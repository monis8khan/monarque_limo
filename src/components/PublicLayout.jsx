import Link from "next/link";
import prisma from "@/lib/prisma";
import PublicNavigation from "@/components/PublicNavigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/fleet", label: "Fleet" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/#booking", label: "Reserve" }
];

export default async function PublicLayout({ children }) {
  const settingsRows = await prisma.siteSetting.findMany();
  const settings = Object.fromEntries(settingsRows.map((s) => [s.key, s.value]));

  return (
    <div className="relative min-h-screen">
      <PublicNavigation links={links} settings={settings} />

      <div className="relative z-10">{children}</div>

      <footer className="relative mt-8 overflow-hidden border-t border-white/10 bg-[linear-gradient(135deg,rgba(201,167,106,0.12),transparent)] px-4 py-10 sm:px-6 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="footer-card">
            <div className="flex items-center gap-3">
              <span className="brand-mark">M</span>
              <div>
                <p className="font-display text-xl text-white">{settings?.site_name || "Monarque Limo"}</p>
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">{settings?.site_tagline || "Luxury transport"}</p>
              </div>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">
              Premium chauffeur and black car service for executive travel, airport transfers, weddings, and VIP occasions.
            </p>
            <a href="/#booking" className="mt-5 inline-flex text-sm font-semibold text-gold hover:underline">
              Reserve your next trip →
            </a>
          </div>

          <div className="footer-card">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Quick links</p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-white/70">
              <Link href="/fleet" className="transition hover:text-gold">Fleet</Link>
              <Link href="/services" className="transition hover:text-gold">Services</Link>
              <Link href="/blog" className="transition hover:text-gold">Blog</Link>
              <a href="/#booking" className="transition hover:text-gold">Book now</a>
            </div>
          </div>

          <div className="footer-card">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Contact</p>
            <div className="mt-4 space-y-2 text-sm text-white/70">
              <p>hello@monarquelimo.com</p>
              <p>+1 (800) 555-0142</p>
              <p>Serving California, Texas, and beyond</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
