import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Menggunakan font Outfit yang elegan
import "./globals.css";
import { LockProvider } from "@/lib/lock-context";
import { ThemeProvider } from "@/lib/theme-context";

// Konfigurasi font
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rockopi Warehouse",
  description: "Sistem POS & Manajemen Gudang Rockopi",
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
      {/* Mengaplikasikan font Outfit ke seluruh body website */}
      <body className={`${outfit.className} antialiased`}>
        <ThemeProvider>
          <LockProvider>{children}</LockProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
