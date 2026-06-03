"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  History,
  BookOpen,
} from "lucide-react";
import "../globals.css"; // Pastikan path CSS ini sesuai dengan struktur Anda

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Master Produk", path: "#", icon: Package }, // Ganti '#' dengan path asli Anda jika ada
  { name: "In/Out Stok", path: "/transactions", icon: ArrowLeftRight },
  { name: "Riwayat", path: "/logs", icon: History },
  { name: "Pembukuan", path: "/finance", icon: BookOpen },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Menyembunyikan navigasi jika sedang berada di halaman order pelanggan
  const isCustomerPage = pathname === "/order";

  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="flex h-screen overflow-hidden">
          {/* --- SIDEBAR DESKTOP (Disembunyikan di Layar HP) --- */}
          {!isCustomerPage && (
            <aside className="hidden md:flex flex-col w-64 bg-[#0a150f] text-white border-r border-gray-800 transition-all">
              <div className="p-6 border-b border-gray-800 flex flex-col items-center justify-center">
                <h1 className="text-3xl font-black tracking-widest uppercase">
                  ROCKOPI
                </h1>
                <p className="text-xs tracking-widest text-gray-400 mt-1">
                  WAREHOUSE
                </p>
              </div>
              <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                  const isActive = pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-[#1B4332] text-white font-bold"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon size={20} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </aside>
          )}

          {/* --- KONTEN UTAMA --- */}
          {/* Tambahkan pb-20 (padding bottom) khusus di HP agar konten tidak tertutup menu bawah */}
          <main
            className={`flex-1 overflow-y-auto ${!isCustomerPage ? "pb-20 md:pb-0" : ""}`}
          >
            {children}
          </main>

          {/* --- FLOATING BOTTOM NAVIGATION (Hanya Muncul di Layar HP) --- */}
          {!isCustomerPage && (
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a150f] text-gray-400 border-t border-gray-800 z-50 flex justify-around items-center h-16 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;

                // Menyingkat teks untuk mobile agar tidak bertabrakan
                let shortName = item.name;
                if (item.name === "Master Produk") shortName = "Produk";
                if (item.name === "In/Out Stok") shortName = "Stok";

                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                      isActive
                        ? "text-green-400"
                        : "hover:text-gray-200 active:text-white"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={isActive ? "animate-bounce-short" : ""}
                    />
                    <span className="text-[10px] font-bold">{shortName}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </body>
    </html>
  );
}
