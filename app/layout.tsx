import type { Metadata } from "next";
import "./globals.css";

// Di sinilah kita mengatur judul tab dan ikon tab (favicon)
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
      {/* Tag body ini yang sebelumnya hilang dan dicari oleh Next.js */}
      <body className="bg-gray-50 text-gray-900 font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
