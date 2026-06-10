import type { Metadata } from "next";
import "./globals.css"; // Ini adalah nyawa utama desain aplikasi Anda!

export const metadata: Metadata = {
  title: "Rockopi",
  description: "Sistem Pemesanan dan Manajemen Gudang Rockopi",
  icons: {
    icon: "/rockopi.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-gray-50 text-gray-900 font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
