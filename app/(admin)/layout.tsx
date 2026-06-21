"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  History,
  BookOpen,
  Settings,
  Lock as LockIcon,
} from "lucide-react";
import { useLock } from "@/lib/lock-context";
import { useTheme } from "@/lib/theme-context";
import RockopiAssistant from "@/components/RockopiAssistant";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { lock } = useLock();
  const { theme } = useTheme();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={22} /> },
    { name: "Master Produk", path: "/products", icon: <Package size={22} /> },
    { name: "Riwayat", path: "/transactions", icon: <History size={22} /> },
    { name: "Pembukuan", path: "/finance", icon: <BookOpen size={22} /> },
    { name: "Pengaturan", path: "/settings", icon: <Settings size={22} /> },
  ];

  return (
    <div
      className="flex flex-col md:flex-row h-screen text-white overflow-hidden font-sans transition-colors duration-500"
      style={{ backgroundColor: theme.bodyBg || "#07110a" }}
    >
      {/* 1. HEADER MOBILE */}
      <header
        className="md:hidden border-b border-white/10 p-4 flex items-center justify-between z-20 shadow-md"
        style={{ backgroundColor: theme.bodyBg || "#07110a" }}
      >
        <div>
          <img
            src="/logo.png"
            alt="Rockopi Logo"
            className="h-8 w-auto object-contain drop-shadow-md"
          />
          <p
            className="text-[8px] font-bold tracking-[0.2em] mt-1"
            style={{ color: theme.primary || "#4ade80" }}
          >
            WAREHOUSE PANEL
          </p>
        </div>
        <button
          onClick={lock}
          className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors active:scale-95"
        >
          <LockIcon size={18} />
        </button>
      </header>

      {/* 2. SIDEBAR DESKTOP */}
      <aside
        className="hidden md:flex w-64 border-r border-white/5 flex-col shadow-2xl z-20 relative"
        style={{ backgroundColor: theme.bodyBg || "#07110a" }}
      >
        <div className="p-7">
          <img
            src="/logo.png"
            alt="Rockopi Logo"
            className="h-10 w-auto object-contain drop-shadow-md"
          />
          <p
            className="text-[10px] font-bold tracking-[0.25em] mt-3"
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
                  style={{
                    backgroundColor: isActive
                      ? theme.primary || "#4ade80"
                      : "transparent",
                  }}
                >
                  {item.icon}
                  <span className="text-sm tracking-wide">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <button
            onClick={lock}
            className="flex items-center justify-center gap-3 text-red-500 hover:text-red-400 hover:bg-red-500/10 px-4 py-3 w-full rounded-xl text-sm font-bold transition-colors active:scale-95"
          >
            <LockIcon size={18} /> Kunci (Lock)
          </button>
        </div>
      </aside>

      {/* 3. KONTEN ADMIN */}
      <main
        className="flex-1 overflow-y-auto relative pb-24 md:pb-0"
        style={{ backgroundColor: theme.bodyBg || "#07110a" }}
      >
        {children}
      </main>

      {/* 4. ASISTEN AI (Melayang di pojok layar) */}
      <RockopiAssistant />
    </div>
  );
}
