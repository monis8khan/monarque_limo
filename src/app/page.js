import prisma from "@/lib/prisma";
import BookingForm from "@/components/BookingForm";
import Link from "next/link";

export const revalidate = 60; // ISR: re-fetch content at most every 60s

async function getHomeData() {
  const [vehicles, services, testimonials, settingsRows] = await Promise.all([
    prisma.vehicle.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } }),
    prisma.service.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } }),
    prisma.testimonial.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } }),
    prisma.siteSetting.findMany()
  ]);

  const settings = Object.fromEntries(settingsRows.map((s) => [s.key, s.value]));
  return { vehicles, services, testimonials, settings };
}

export default async function HomePage() {
  const { vehicles, services, testimonials, settings } = await getHomeData();

  const stats = [
    { label: "Journeys Completed", value: settings.stat_journeys_completed || "0" },
    { label: "Years of Excellence", value: settings.stat_years_of_excellence || "0" },
    { label: "Global Markets", value: settings.stat_global_markets || "0" },
    { label: "Privacy Guaranteed", value: `${settings.stat_privacy_guaranteed || "0"}%` }
  ];

  return (
    <main>
      {/* Hero */}
      <section className="min-h-[80vh] flex items-center border-b border-white/10 px-6 md:px-16">
        <div className="max-w-2xl">
          <span className="section-eyebrow">Monarque Limo</span>
          <h1 className="font-display text-4xl md:text-6xl text-white leading-tight mb-6">
            Luxury Chauffeur Service, Uncompromised.
          </h1>
          <p className="text-white/70 text-lg mb-8">
            Airport transfers, corporate travel, weddings, and VIP events — driven with
            precision and discretion across California, Texas, and beyond.
          </p>
          <a href="#booking" className="btn-gold">
            Request a Reservation
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 border-b border-white/10">
        {stats.map((s) => (
          <div key={s.label} className="p-8 text-center border-r border-white/10 last:border-r-0">
            <div className="font-display text-3xl gold-text">{s.value}</div>
            <div className="text-white/60 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Services */}
      <section className="px-6 md:px-16 py-20 border-b border-white/10">
        <span className="section-eyebrow">What We Offer</span>
        <h2 className="section-heading mb-10">Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.id} className="card">
              <h3 className="font-display text-xl text-white mb-2">{s.title}</h3>
              <p className="text-white/60 text-sm">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fleet */}
      <section className="px-6 md:px-16 py-20 border-b border-white/10">
        <span className="section-eyebrow">Our Fleet</span>
        <h2 className="section-heading mb-10">Vehicles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div key={v.id} className="card">
              <h3 className="font-display text-xl text-white mb-1">{v.name}</h3>
              <p className="text-xs gold-text uppercase tracking-wide mb-3">{v.category}</p>
              <p className="text-white/60 text-sm mb-3">{v.description}</p>
              <p className="text-white/40 text-xs">Up to {v.passengerCapacity} passengers</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 md:px-16 py-20 border-b border-white/10">
        <span className="section-eyebrow">Client Words</span>
        <h2 className="section-heading mb-10">Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="card">
              <p className="text-white/70 italic mb-4">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-sm gold-text font-semibold">{t.clientName}</p>
              {t.clientTitle && <p className="text-xs text-white/40">{t.clientTitle}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="px-6 md:px-16 py-20 border-b border-white/10">
        <span className="section-eyebrow">Reserve</span>
        <h2 className="section-heading mb-10">Request a Booking</h2>
        <BookingForm vehicles={vehicles} services={services} />
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-16 py-10 flex flex-col md:flex-row justify-between text-white/40 text-sm">
        <p>&copy; {new Date().getFullYear()} Monarque Limo. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/blog" className="hover:text-gold">
            Blog
          </Link>
          <Link href="/admin/login" className="hover:text-gold">
            Admin
          </Link>
        </div>
      </footer>
    </main>
  );
}
