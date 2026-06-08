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
import "../globals.css";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Master Produk", path: "/products", icon: Package }, // Jalur sudah diperbaiki ke /products
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
  const isCustomerPage = pathname === "/order";

  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="flex h-screen overflow-hidden">
          {/* --- SIDEBAR DESKTOP --- */}
          {!isCustomerPage && (
            <aside className="hidden md:flex flex-col w-64 bg-[#0a150f] text-white border-r border-gray-800 transition-all">
              {/* Bagian Logo Baru di Halaman Admin */}
              <div className="p-6 border-b border-gray-800 flex flex-col items-center justify-center bg-black/20">
                <img
                  src="/logo.png"
                  alt="Logo Rockopi"
                  className="h-10 object-contain drop-shadow-xl mb-1"
                />
                <p className="text-[10px] tracking-[0.2em] text-green-400 font-bold uppercase">
                  Warehouse Panel
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
                          ? "bg-[#1B4332] text-white font-bold shadow-lg"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon size={20} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Badge Lingkar Kecil di Bawah Sidebar */}
              <div className="p-4 border-t border-gray-800 flex justify-center opacity-50 hover:opacity-100 transition-opacity">
                <img
                  src="/rockopi.png"
                  alt="Rockopi Badge"
                  className="w-10 h-10 object-cover rounded-full"
                />
              </div>
            </aside>
          )}

          {/* --- KONTEN UTAMA --- */}
          <main
            className={`flex-1 overflow-y-auto ${!isCustomerPage ? "pb-20 md:pb-0" : ""}`}
          >
            {/* Header Mobile dengan Logo (Hanya muncul di HP) */}
            {!isCustomerPage && (
              <div className="md:hidden bg-[#0a150f] text-white p-4 flex items-center justify-between border-b border-gray-800 sticky top-0 z-40">
                <img
                  src="/logo.png"
                  alt="Logo Rockopi"
                  className="h-6 object-contain"
                />
                <span className="text-[10px] bg-[#1B4332] px-2 py-1 rounded-md font-bold text-green-300">
                  ADMIN
                </span>
              </div>
            )}
            <div className={!isCustomerPage ? "p-4 md:p-8" : ""}>
              {children}
            </div>
          </main>

          {/* --- FLOATING BOTTOM NAVIGATION (MOBILE) --- */}
          {!isCustomerPage && (
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a150f] text-gray-400 border-t border-gray-800 z-50 flex justify-around items-center h-16 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;

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
                    <Icon size={20} />
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
