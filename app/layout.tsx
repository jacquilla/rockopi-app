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

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={22} /> },
    { name: "Master Produk", path: "/products", icon: <Package size={22} /> },
    { name: "Riwayat", path: "/transactions", icon: <History size={22} /> },
    { name: "Pembukuan", path: "/finance", icon: <BookOpen size={22} /> },
    { name: "Pengaturan", path: "/settings", icon: <Settings size={22} /> },
  ];

  return (
    // Penambahan flex-col untuk HP, md:flex-row untuk iPad/Desktop
    <div className="flex flex-col md:flex-row h-screen bg-[#0a1f16] text-white overflow-hidden font-sans">
      {/* 1. HEADER KHUSUS MOBILE (Hanya tampil di HP) */}
      <header className="md:hidden bg-[#0a1f16] border-b border-white/10 p-4 flex items-center justify-between z-20 shadow-md">
        <div>
          <h1 className="text-xl font-black tracking-widest text-white drop-shadow-md">
            ROCKOPI
          </h1>
          <p className="text-[8px] font-bold text-green-400 tracking-[0.2em] mt-0.5">
            WAREHOUSE PANEL
          </p>
        </div>
        <button className="p-2.5 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors">
          <Lock size={18} />
        </button>
      </header>

      {/* 2. SIDEBAR DESKTOP & iPAD (Sembunyi di HP, tampil di layar md ke atas) */}
      <aside className="hidden md:flex w-64 bg-[#0a1f16] border-r border-white/5 flex-col shadow-2xl z-20 relative">
        <div className="p-7">
          <h1 className="text-3xl font-black tracking-widest text-white drop-shadow-md">
            ROCKOPI
          </h1>
          <p className="text-[10px] font-bold text-green-400 tracking-[0.25em] mt-1.5">
            WAREHOUSE PANEL
          </p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
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

        <div className="p-4 border-t border-white/5 bg-black/20">
          <button className="flex items-center justify-center gap-3 text-red-500 hover:text-red-400 hover:bg-red-500/10 px-4 py-3 w-full rounded-xl text-sm font-bold transition-colors">
            <Lock size={18} /> Kunci (Lock)
          </button>
        </div>
      </aside>

      {/* 3. AREA KONTEN UTAMA */}
      {/* pb-24 ditambahkan khusus di HP agar konten paling bawah tidak tertutup Bottom Navigation */}
      <main className="flex-1 overflow-y-auto relative bg-[#0a1f16] pb-24 md:pb-0">
        {children}
      </main>

      {/* 4. BOTTOM NAVIGATION KHUSUS MOBILE (Hanya tampil di HP) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a1f16]/95 backdrop-blur-xl border-t border-white/10 z-50 flex justify-around items-center p-2 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path} className="flex-1">
              <div className="flex flex-col items-center justify-center py-2 gap-1.5">
                <div
                  className={`p-2 rounded-xl transition-all ${isActive ? "bg-[#1B4332] text-green-300 shadow-md" : "text-gray-400 hover:text-gray-200"}`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-[9px] font-bold tracking-wide ${isActive ? "text-white" : "text-gray-500"}`}
                >
                  {/* Singkat nama menu panjang agar muat di layar HP kecil */}
                  {item.name === "Master Produk" ? "Produk" : item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
