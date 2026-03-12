import "./globals.css";
import "leaflet/dist/leaflet.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col h-full">
        <Header />

        <main className="grow max-w-6xl mx-auto w-full">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}