import Link from "next/link";
import AdminNav from "@/components/AdminNav";

export default function AdminDashboardHome() {
  return (
    <div className="flex">
      <AdminNav />
      <main className="flex-1 p-10">
        <h1 className="font-display text-2xl text-white mb-4">Welcome back</h1>
        <p className="text-white/60 mb-8">Choose a section to manage.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
          <Link href="/admin/dashboard/bookings" className="card hover:border-gold">
            Bookings
          </Link>
          <Link href="/admin/dashboard/blog" className="card hover:border-gold">
            Blog
          </Link>
          <Link href="/admin/dashboard/fleet" className="card hover:border-gold">
            Fleet
          </Link>
          <Link href="/admin/dashboard/services" className="card hover:border-gold">
            Services
          </Link>
          <Link href="/admin/dashboard/testimonials" className="card hover:border-gold">
            Testimonials
          </Link>
          <Link href="/admin/dashboard/settings" className="card hover:border-gold">
            Site Settings
          </Link>
        </div>
      </main>
    </div>
  );
}
