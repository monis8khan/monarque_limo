const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // --- Admin user ---
  const adminEmail = process.env.ADMIN_EMAIL || "admin@monarquelimo.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, role: "admin" }
  });
  console.log(`Admin user ready: ${adminEmail}`);

  // --- Vehicles ---
  const vehicles = [
    {
      name: "Cadillac Escalade ESV",
      category: "SUV",
      description:
        "Full-size luxury SUV with extended cargo room, ideal for airport runs and small groups.",
      passengerCapacity: 6,
      features: "Leather interior,Ample luggage space,Privacy glass,Wi-Fi",
      displayOrder: 1
    },
    {
      name: "Mercedes-Benz Sprinter Extended",
      category: "Van",
      description:
        "Executive van configuration for larger groups, corporate transfers, and events.",
      passengerCapacity: 12,
      features: "Conference seating,Onboard refreshments,USB charging,Extra luggage bay",
      displayOrder: 2
    },
    {
      name: "Mercedes-Benz S-Class",
      category: "Sedan",
      description:
        "Flagship luxury sedan for executive travel, VIP transport, and special occasions.",
      passengerCapacity: 3,
      features: "Massage seats,Ambient lighting,Chauffeur privacy partition,Wi-Fi",
      displayOrder: 3
    }
  ];

  for (const v of vehicles) {
    const existing = await prisma.vehicle.findFirst({ where: { name: v.name } });
    if (!existing) {
      await prisma.vehicle.create({ data: v });
    }
  }
  console.log("Vehicles seeded.");

  // --- Services ---
  const services = [
    {
      title: "Airport Transfers",
      description:
        "Reliable, flight-tracked pickups and drop-offs at LAX, DFW, and other major airports.",
      displayOrder: 1
    },
    {
      title: "Corporate Black Car",
      description:
        "Executive transportation for meetings, roadshows, and corporate accounts.",
      displayOrder: 2
    },
    {
      title: "Private Jet & Tarmac Coordination",
      description:
        "Seamless ground transport coordinated directly with FBOs and private aviation schedules.",
      displayOrder: 3
    },
    {
      title: "Weddings & VIP Events",
      description:
        "White-glove chauffeur service for weddings, galas, and milestone celebrations.",
      displayOrder: 4
    },
    {
      title: "Hourly Charter",
      description:
        "Flexible as-directed chauffeur service billed by the hour for multi-stop days.",
      displayOrder: 5
    },
    {
      title: "Executive Security Escort",
      description:
        "Discreet, security-trained chauffeurs for high-profile or sensitive travel.",
      displayOrder: 6
    }
  ];

  for (const s of services) {
    const existing = await prisma.service.findFirst({ where: { title: s.title } });
    if (!existing) {
      await prisma.service.create({ data: s });
    }
  }
  console.log("Services seeded.");

  // --- Testimonials ---
  const testimonials = [
    {
      clientName: "J. Whitfield",
      clientTitle: "Corporate Client",
      quote:
        "Every pickup has been on time and the cars are immaculate. This is our go-to for client transport.",
      displayOrder: 1
    },
    {
      clientName: "M. Alvarez",
      clientTitle: "Wedding Client",
      quote:
        "The chauffeur made our wedding day feel effortless. Professional from the first email to the last mile.",
      displayOrder: 2
    },
    {
      clientName: "R. Chen",
      clientTitle: "Frequent Flyer",
      quote:
        "Flight was delayed two hours and the driver was still there tracking it. Exactly the reliability I need.",
      displayOrder: 3
    }
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { clientName: t.clientName } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }
  console.log("Testimonials seeded.");

  // --- Site settings (trust stat counters, no more hardcoded zeros) ---
  const settings = [
    { key: "stat_journeys_completed", value: "4200" },
    { key: "stat_years_of_excellence", value: "8" },
    { key: "stat_global_markets", value: "3" },
    { key: "stat_privacy_guaranteed", value: "100" }
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s
    });
  }
  console.log("Site settings seeded.");

  // --- Sample blog post ---
  const existingPost = await prisma.blogPost.findUnique({ where: { slug: "pinnacle-of-luxury-transport" } });
  if (!existingPost) {
    await prisma.blogPost.create({
      data: {
        title: "The Pinnacle of Luxury Transport",
        slug: "pinnacle-of-luxury-transport",
        category: "Company News",
        excerpt: "What sets a true luxury chauffeur experience apart from a standard car service.",
        body:
          "<p>Luxury ground transportation is about more than a nice car — it's about precision, discretion, and consistency. In this post we walk through how Monarque Limo approaches every reservation, from flight tracking to vehicle detailing standards.</p>",
        status: "published",
        publishedAt: new Date(),
        metaTitle: "The Pinnacle of Luxury Transport | Monarque Limo",
        metaDescription:
          "How Monarque Limo delivers a consistent, white-glove chauffeur experience for every client."
      }
    });
  }
  console.log("Sample blog post seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
