import prisma from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 60;

async function getPageSettings() {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((s) => [s.key, s.value]));
}

export async function generateMetadata() {
  const settings = await getPageSettings();

  return {
    title: settings.page_services_meta_title || "Services | Monarque Limo",
    description:
      settings.page_services_meta_description || "Browse the premium chauffeur services offered by Monarque Limo."
  };
}

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" }
  });

  return (
    <main className="min-h-screen px-6 py-20 md:px-16">
      <div className="mx-auto max-w-7xl">
        <span className="section-eyebrow">What we offer</span>
        <h1 className="section-heading mb-4">Services tailored to every occasion</h1>
        <p className="mb-10 max-w-2xl text-white/65">
          Choose from a full suite of executive and luxury transport solutions designed around
          punctuality, comfort, and peace of mind.
        </p>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <article key={service.id} className="card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-lg text-gold">
                {index === 0 ? "✦" : index === 1 ? "◌" : "◎"}
              </div>
              <h2 className="mb-2 font-display text-2xl text-white">{service.title}</h2>
              <p className="text-sm leading-7 text-white/65">{service.description}</p>
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
