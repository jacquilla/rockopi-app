"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  History,
  BookOpen,
  Settings,
  Lock,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // DAFTAR MENU NAVBAR YANG SUDAH DIPERBAIKI
  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Master Produk", path: "/products", icon: <Package size={20} /> },
    // Menu "In/Out Stok" sudah Dihapus Sepenuhnya
    // Menu "Riwayat" diarahkan ke "/transactions" dengan ikon History
    { name: "Riwayat", path: "/transactions", icon: <History size={20} /> },
    { name: "Pembukuan", path: "/finance", icon: <BookOpen size={20} /> },
    { name: "Pengaturan", path: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#0a1f16] text-white overflow-hidden font-sans">
      {/* PANEL SAMPING (SIDEBAR) */}
      <aside className="w-64 bg-[#0a1f16] border-r border-white/5 flex flex-col shadow-2xl z-20 relative">
        <div className="p-7">
          <h1 className="text-3xl font-black tracking-widest text-white drop-shadow-md">
            ROCKOPI
          </h1>
          <p className="text-[10px] font-bold text-green-400 tracking-[0.25em] mt-1.5">
            WAREHOUSE PANEL
          </p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            // Mengecek apakah menu ini sedang aktif/dibuka
            const isActive = pathname === item.path;

            return (
              <Link key={item.name} href={item.path}>
                <div
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all cursor-pointer mb-1 ${
                    isActive
                      ? "bg-[#1B4332] text-white font-bold shadow-lg border border-white/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5 font-medium"
                  }`}
                >
                  <span
                    className={`${isActive ? "text-green-300" : "text-gray-400"}`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm tracking-wide">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* TOMBOL KUNCI APLIKASI DI BAWAH */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <button className="flex items-center justify-center gap-3 text-red-500 hover:text-red-400 hover:bg-red-500/10 px-4 py-3 w-full rounded-xl text-sm font-bold transition-colors">
            <Lock size={18} /> Kunci Aplikasi (Lock)
          </button>
        </div>
      </aside>

      {/* AREA KONTEN UTAMA */}
      <main className="flex-1 overflow-y-auto relative bg-[#0a1f16]">
        {children}
      </main>
    </div>
  );
}
