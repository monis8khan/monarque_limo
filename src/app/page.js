import prisma from "@/lib/prisma";
import BookingForm from "@/components/BookingForm";
import Link from "next/link";

export const revalidate = 60;

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

  const heroImage =
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80";
  const displayedServices = services.slice(0, 3);
  const displayedVehicles = vehicles.slice(0, 3);
  const fleetImages = [
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1519643381401-22c77e60520e?auto=format&fit=crop&w=900&q=80"
  ];

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,167,106,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_25%)]" />

      <section className="relative min-h-[90vh] border-b border-white/10 px-6 py-20 md:px-16 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10">
            <span className="section-eyebrow">{settings.site_tagline || "Monarque Limo • Elevated mobility"}</span>
            <h1 className="mb-6 font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              {settings.site_title || "Luxury tailored for the modern journey."}
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-white/70">
              From airport arrivals to executive meetings, weddings, and red-carpet evenings,
              we orchestrate every mile with precision, comfort, and discreet service.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#booking" className="btn-gold group relative overflow-hidden px-7 py-3 text-sm shadow-[0_0_30px_rgba(201,167,106,0.2)]">
                <span className="absolute inset-0 translate-x-[-120%] bg-white/20 transition-transform duration-500 group-hover:translate-x-[120%]" />
                <span className="relative flex items-center gap-2">
                  <span>Reserve your ride</span>
                  <span className="text-base">↗</span>
                </span>
              </a>
              <a href="/fleet" className="group rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-gold/10 hover:text-gold">
                <span className="flex items-center gap-2">
                  <span>Explore the fleet</span>
                  <span className="text-gold transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </a>
              <a href="/services" className="group rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-gold/10 hover:text-gold">
                <span className="flex items-center gap-2">
                  <span>View services</span>
                  <span className="text-gold transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="font-display text-2xl text-gold">{s.value}</div>
                  <div className="mt-1 text-sm text-white/60">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="ambient-orb absolute -left-6 top-8 h-24 w-24 rounded-full bg-gold/25 blur-3xl" />
            <div className="glass-panel relative overflow-hidden rounded-[2rem] border border-white/10 p-3">
              <img
                src={heroImage}
                alt="Luxury black car at night"
                className="h-[420px] w-full rounded-[1.5rem] object-cover"
              />
              <div className="absolute inset-x-6 bottom-6 rounded-[1.25rem] border border-white/10 bg-ink/80 p-5 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.35em] text-gold">24/7 concierge</p>
                <p className="mt-2 text-lg text-white">
                  Every arrival is choreographed with elegance, security, and seamless timing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-6 py-20 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="section-eyebrow">Signature experience</span>
              <h2 className="section-heading">Futuristic comfort, human precision.</h2>
            </div>
            <div className="flex items-center gap-3">
              <p className="max-w-xl text-sm text-white/60 md:text-base">
                Our service blends premium design, intelligent coordination, and attentive hospitality.
              </p>
              <Link href="/services" className="text-sm font-semibold uppercase tracking-[0.25em] text-gold transition hover:underline">
                View all
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {displayedServices.map((s, index) => (
              <div key={s.id} className="card group">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-lg text-gold">
                  {index === 0 ? "✦" : index === 1 ? "◌" : "◎"}
                </div>
                <h3 className="mb-2 font-display text-xl text-white">{s.title}</h3>
                <p className="text-sm leading-6 text-white/60">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="fleet" className="border-b border-white/10 px-6 py-20 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="section-eyebrow">Our fleet</span>
              <h2 className="section-heading">Prestige in motion.</h2>
            </div>
            <div className="flex items-center gap-3">
              <p className="max-w-xl text-sm text-white/60 md:text-base">
                Select from executive sedans, spacious SUVs, and premium luxury vehicles designed for comfort.
              </p>
              <Link href="/fleet" className="text-sm font-semibold uppercase tracking-[0.25em] text-gold transition hover:underline">
                View all
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {displayedVehicles.map((v, index) => (
              <div key={v.id} className="card group overflow-hidden p-0">
                <img
                  src={fleetImages[index % fleetImages.length]}
                  alt={v.name}
                  className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="p-6">
                  <h3 className="mb-1 font-display text-xl text-white">{v.name}</h3>
                  <p className="mb-3 text-xs uppercase tracking-[0.25em] text-gold">{v.category}</p>
                  <p className="mb-3 text-sm leading-6 text-white/60">{v.description}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Up to {v.passengerCapacity} passengers
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-6 py-20 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <span className="section-eyebrow">Client stories</span>
            <h2 className="section-heading">Trusted by discerning travelers.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.id} className="card">
                <p className="mb-4 text-lg leading-8 text-white/70">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-sm font-semibold text-gold">{t.clientName}</p>
                {t.clientTitle && <p className="text-xs text-white/40">{t.clientTitle}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="booking" className="px-6 py-20 md:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent p-8">
            <span className="section-eyebrow">Reserve in minutes</span>
            <h2 className="section-heading">Let your next arrival feel effortless.</h2>
            <p className="mt-4 text-base leading-7 text-white/70">
              Share your itinerary and we’ll prepare a polished, punctual experience tailored to your plans.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/70">
              <li>• Instant confirmation and proactive communication</li>
              <li>• Premium amenities and discreet professional chauffeurs</li>
              <li>• Flexible service for business, special occasions, and travel</li>
            </ul>
          </div>

          <BookingForm vehicles={vehicles} services={services} />
        </div>
      </section>

    </main>
  );
}
