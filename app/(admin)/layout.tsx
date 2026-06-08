"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  History,
  BookOpen,
  LockKeyhole,
  ArrowRight,
  Settings,
} from "lucide-react";
import "../globals.css";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Master Produk", path: "/products", icon: Package },
  { name: "In/Out Stok", path: "/transactions", icon: ArrowLeftRight },
  { name: "Riwayat", path: "/logs", icon: History },
  { name: "Pembukuan", path: "/finance", icon: BookOpen },
  { name: "Pengaturan", path: "/settings", icon: Settings }, // MENU BARU
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCustomerPage = pathname === "/order";

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("rockopi_auth_pin");
    if (loggedIn === "true") {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // MENGAMBIL PIN DARI DATABASE LOKAL (DEFAULT: 123456 JIKA BELUM DISET)
    const savedPin = localStorage.getItem("rockopi_admin_pin") || "123456";

    if (pinCode === savedPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem("rockopi_auth_pin", "true");
    } else {
      alert("Akses Ditolak! PIN yang Anda masukkan salah.");
      setPinCode("");
    }
  };

  if (isChecking) {
    return (
      <html lang="en">
        <body className="bg-[#0a150f]"></body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="bg-gray-50">
        {!isCustomerPage && !isAuthenticated ? (
          <div className="min-h-screen bg-[#0a150f] flex flex-col items-center justify-center p-4 bg-[url('/bg-rockopi.avif')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-0"></div>

            <div className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#1B4332] rounded-full flex items-center justify-center mb-6 shadow-lg border-4 border-green-900/50">
                <LockKeyhole size={36} className="text-green-400" />
              </div>

              <h1 className="text-2xl font-black tracking-widest uppercase text-white mb-1">
                ROCKOPI
              </h1>
              <p className="text-xs tracking-widest text-green-400 font-bold mb-8">
                Admin / Cashier Panel
              </p>

              <form onSubmit={handleLogin} className="w-full space-y-4">
                <div>
                  <input
                    type="password"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="Masukkan PIN Rahasia"
                    className="w-full bg-black/40 text-white text-center tracking-[0.5em] font-bold p-4 rounded-xl border border-white/10 focus:border-green-500 focus:ring-2 focus:ring-green-900 outline-none transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-500"
                    maxLength={10} // Disesuaikan barangkali owner mau PIN panjang
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  Buka Sistem <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex h-screen overflow-hidden">
            {/* SIDEBAR DESKTOP */}
            {!isCustomerPage && (
              <aside className="hidden md:flex flex-col w-64 bg-[#0a150f] text-white border-r border-gray-800 transition-all">
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

                <div className="p-4 border-t border-gray-800">
                  <button
                    onClick={() => {
                      sessionStorage.removeItem("rockopi_auth_pin");
                      window.location.reload();
                    }}
                    className="w-full py-2 text-xs font-bold text-red-400 hover:text-white hover:bg-red-900/50 rounded-lg transition-colors"
                  >
                    Kunci Aplikasi (Lock)
                  </button>
                </div>
              </aside>
            )}

            {/* KONTEN UTAMA */}
            <main
              className={`flex-1 overflow-y-auto ${!isCustomerPage ? "pb-20 md:pb-0" : ""}`}
            >
              {!isCustomerPage && (
                <div className="md:hidden bg-[#0a150f] text-white p-4 flex items-center justify-between border-b border-gray-800 sticky top-0 z-40">
                  <img
                    src="/logo.png"
                    alt="Logo Rockopi"
                    className="h-6 object-contain"
                  />
                  <button
                    onClick={() => {
                      sessionStorage.removeItem("rockopi_auth_pin");
                      window.location.reload();
                    }}
                    className="text-[10px] bg-red-900/80 px-2 py-1 rounded-md font-bold text-red-200 active:scale-95"
                  >
                    LOCK
                  </button>
                </div>
              )}
              <div className={!isCustomerPage ? "p-4 md:p-8" : ""}>
                {children}
              </div>
            </main>

            {/* FLOATING BOTTOM NAVIGATION (MOBILE) */}
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
        )}
      </body>
    </html>
  );
}
