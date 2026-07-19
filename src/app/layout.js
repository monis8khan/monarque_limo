import "./globals.css";

export const metadata = {
  title: "Monarque Limo | Luxury Chauffeur & Black Car Service",
  description:
    "Luxury chauffeur and black car service for airport transfers, corporate travel, weddings, and VIP events across California, Texas, and beyond.",
  metadataBase: new URL("http://localhost:3000")
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body">{children}</body>
    </html>
  );
}
