import prisma from "@/lib/prisma";
import FleetImage from "@/components/FleetImage";
import Link from "next/link";
import { safeFindMany, safeGetSettings } from "@/lib/safe-prisma";

export const revalidate = 60;

async function getPageSettings() {
  return safeGetSettings(() => prisma.siteSetting.findMany());
}

export async function generateMetadata() {
  const settings = await getPageSettings();

  return {
    title: settings.page_fleet_meta_title || "Fleet | Monarque Limo",
    description: settings.page_fleet_meta_description || "Explore the premium fleet available through Monarque Limo."
  };
}

export default async function FleetPage() {
  const vehicles = await safeFindMany(() =>
    prisma.vehicle.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" }
    })
  );

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
          {vehicles.map((vehicle) => (
            <article key={vehicle.id} className="card overflow-hidden p-0">
              <FleetImage
                src={vehicle.imageUrl}
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
