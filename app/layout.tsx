import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { LockProvider } from "@/lib/lock-context";

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
        {/* Mengaktifkan kembali layar PIN dan Tema Dinamis */}
        <ThemeProvider>
          <LockProvider>{children}</LockProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
