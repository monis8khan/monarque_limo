"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const links = [
  { href: "/admin/dashboard/bookings", label: "Bookings" },
  { href: "/admin/dashboard/blog", label: "Blog" },
  { href: "/admin/dashboard/fleet", label: "Fleet" },
  { href: "/admin/dashboard/services", label: "Services" },
  { href: "/admin/dashboard/testimonials", label: "Testimonials" },
  { href: "/admin/dashboard/settings", label: "Site Settings" }
];

export default function AdminNav() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-56 shrink-0 border-r border-white/10 min-h-screen p-6">
      <p className="font-display text-lg text-white mb-8">Monarque Admin</p>
      <nav className="flex flex-col gap-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="text-white/70 hover:text-gold text-sm py-1">
            {l.label}
          </Link>
        ))}
      </nav>
      <button onClick={handleLogout} className="mt-10 text-white/40 hover:text-red-400 text-sm">
        Log out
      </button>
    </aside>
  );
}
