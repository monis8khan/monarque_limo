import "./globals.css";
import PublicLayout from "@/components/PublicLayout";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Monarque Limo | Luxury Chauffeur & Black Car Service",
  description:
    "Luxury chauffeur and black car service for airport transfers, corporate travel, weddings, and VIP events across California, Texas, and beyond.",
  metadataBase: new URL("http://localhost:3000")
};

function readSchemaValue(rawValue, fallback) {
  if (!rawValue) return fallback;

  try {
    const parsed = JSON.parse(rawValue);
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export default async function RootLayout({ children }) {
  const settingsRows = await prisma.siteSetting.findMany();
  const settings = Object.fromEntries(settingsRows.map((s) => [s.key, s.value]));

  const websiteSchema = readSchemaValue(settings.schema_website_json, {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Monarque Limo",
    url: "http://localhost:3000"
  });

  const businessSchema = readSchemaValue(settings.schema_business_json, {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Monarque Limo",
    url: "http://localhost:3000",
    telephone: "+1-800-555-0199",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Los Angeles",
      addressRegion: "CA",
      addressCountry: "US"
    }
  });

  return (
    <html lang="en">
      <body className="font-body">
        <PublicLayout>{children}</PublicLayout>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />
      </body>
    </html>
  );
}
