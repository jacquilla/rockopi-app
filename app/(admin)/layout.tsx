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
import { useLock } from "@/lib/lock-context";
import { useTheme } from "@/lib/theme-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { lock } = useLock(); // Memanggil fungsi pengunci layar
  const { theme } = useTheme(); // Memanggil warna tema yang sedang aktif

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={22} /> },
    { name: "Master Produk", path: "/products", icon: <Package size={22} /> },
    { name: "Riwayat", path: "/transactions", icon: <History size={22} /> },
    { name: "Pembukuan", path: "/finance", icon: <BookOpen size={22} /> },
    { name: "Pengaturan", path: "/settings", icon: <Settings size={22} /> },
  ];

  return (
    // Latar belakang sekarang selaras dengan Tema Dinamis
    <div
      className="flex flex-col md:flex-row h-screen text-white overflow-hidden font-sans transition-colors duration-500"
      style={{ backgroundColor: theme.bodyBg || "#0a1f16" }}
    >
      {/* 1. HEADER MOBILE (HP) */}
      <header
        className="md:hidden border-b border-white/10 p-4 flex items-center justify-between z-20 shadow-md"
        style={{ backgroundColor: theme.bodyBg || "#0a1f16" }}
      >
        <div>
          <h1 className="text-xl font-black tracking-widest text-white drop-shadow-md">
            ROCKOPI
          </h1>
          <p
            className="text-[8px] font-bold tracking-[0.2em] mt-0.5"
            style={{ color: theme.primary || "#4ade80" }}
          >
            WAREHOUSE PANEL
          </p>
        </div>
        {/* Tombol Kunci Aktif */}
        <button
          onClick={lock}
          className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors active:scale-95"
        >
          <Lock size={18} />
        </button>
      </header>

      {/* 2. SIDEBAR DESKTOP & iPAD */}
      <aside
        className="hidden md:flex w-64 border-r border-white/5 flex-col shadow-2xl z-20 relative"
        style={{ backgroundColor: theme.bodyBg || "#0a1f16" }}
      >
        // Ganti bagian header di dalam <aside> (Desktop)
        <div className="p-7">
          <img
            src="/logo.png"
            alt="Rockopi Logo"
            className="h-10 w-auto object-contain drop-shadow-md"
          />
          <p className="text-[10px] font-bold tracking-[0.25em] mt-3" style={{ color: theme.primary || '#4ade80' }}>WAREHOUSE PANEL</p>
        </div>

        // Ganti bagian header di <header> (Mobile)
        <header className="md:hidden border-b border-white/10 p-4 flex items-center justify-between z-20 shadow-md" style={{ backgroundColor: theme.bodyBg || '#0a1f16' }}>
          <div>
            <img
              src="/logo.png"
              alt="Rockopi Logo"
              className="h-8 w-auto object-contain drop-shadow-md"
            />
            <p className="text-[8px] font-bold tracking-[0.2em] mt-1" style={{ color: theme.primary || '#4ade80' }}>WAREHOUSE PANEL</p>
          </div>
          {/* Tombol Kunci Aktif */}
          <button onClick={lock} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors active:scale-95">
            <Lock size={18} />
          </button>
        </header>
          <p
            className="text-[10px] font-bold tracking-[0.25em] mt-1.5"
            style={{ color: theme.primary || "#4ade80" }}
          >
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
                      ? "text-white font-bold shadow-lg border border-white/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5 font-medium"
                  }`}
                  // Kotak menu yang aktif akan berubah warnanya sesuai Tema
                  style={{
                    backgroundColor: isActive
                      ? theme.primary || "#1B4332"
                      : "transparent",
                  }}
                >
                  <span
                    className={`${isActive ? "text-white" : "text-gray-400"}`}
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
          {/* Tombol Kunci Aktif */}
          <button
            onClick={lock}
            className="flex items-center justify-center gap-3 text-red-500 hover:text-red-400 hover:bg-red-500/10 px-4 py-3 w-full rounded-xl text-sm font-bold transition-colors active:scale-95"
          >
            <Lock size={18} /> Kunci (Lock)
          </button>
        </div>
      </aside>

      {/* 3. AREA KONTEN UTAMA */}
      <main
        className="flex-1 overflow-y-auto relative pb-24 md:pb-0"
        style={{ backgroundColor: theme.bodyBg || "#0a1f16" }}
      >
        {children}
      </main>

      {/* 4. BOTTOM NAVIGATION MOBILE (HP) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 z-50 flex justify-around items-center p-2 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path} className="flex-1">
              <div className="flex flex-col items-center justify-center py-2 gap-1.5">
                <div
                  className={`p-2 rounded-xl transition-all ${isActive ? "shadow-md text-white" : "text-gray-400 hover:text-gray-200"}`}
                  style={{
                    backgroundColor: isActive
                      ? theme.primary || "#1B4332"
                      : "transparent",
                  }}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-[9px] font-bold tracking-wide ${isActive ? "text-white" : "text-gray-500"}`}
                >
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
