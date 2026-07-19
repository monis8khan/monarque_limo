import prisma from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 60;

export const metadata = {
  title: "Fleet | Monarque Limo",
  description: "Explore the premium fleet available through Monarque Limo."
};

export default async function FleetPage() {
  const vehicles = await prisma.vehicle.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" }
  });

  const fleetImages = [
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1519643381401-22c77e60520e?auto=format&fit=crop&w=900&q=80"
  ];

  return (
    <main className="min-h-screen px-6 py-20 md:px-16">
      <div className="mx-auto max-w-7xl">
        <span className="section-eyebrow">Our fleet</span>
        <h1 className="section-heading mb-4">Fleet collection</h1>
        <p className="mb-10 max-w-2xl text-white/65">
          Discover the executive vehicles and luxury transport options curated for airport travel,
          corporate events, weddings, and elevated everyday travel.
        </p>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle, index) => (
            <article key={vehicle.id} className="card overflow-hidden p-0">
              <img
                src={fleetImages[index % fleetImages.length]}
                alt={vehicle.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">{vehicle.category}</p>
                <h2 className="mb-2 font-display text-2xl text-white">{vehicle.name}</h2>
                <p className="mb-4 text-sm leading-7 text-white/65">{vehicle.description}</p>
                <div className="flex items-center justify-between text-sm text-white/50">
                  <span>Up to {vehicle.passengerCapacity} passengers</span>
                  <span className="text-gold">{vehicle.isActive ? "Available" : "Reserved"}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <Link href="/" className="text-sm text-gold hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
