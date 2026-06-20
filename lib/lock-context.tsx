"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { verifyAdminPin } from "@/app/actions/security";
import { Lock as LockIcon, Loader2, ShieldAlert } from "lucide-react";
import { usePathname } from "next/navigation"; // Tambahan baru untuk mendeteksi URL

type LockContextType = {
  isLocked: boolean;
  lock: () => void;
};

const LockContext = createContext<LockContextType | undefined>(undefined);

export function LockProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Mengecek apakah pengunjung sedang berada di halaman order pelanggan
  const isOrderPage = pathname?.startsWith("/order");

  const [isLocked, setIsLocked] = useState(true);
  const [inputPin, setInputPin] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  // 1. Logika Pengecekan Awal
  useEffect(() => {
    // Jika ini halaman order, BEBASKAN! Jangan jalankan logika kunci.
    if (isOrderPage) {
      setIsLocked(false);
      return;
    }

    const checkInitialSession = () => {
      const session = localStorage.getItem("rockopi_admin_session");
      if (session === "authenticated") {
        setIsLocked(false);
      } else {
        setIsLocked(true);
      }
    };
    checkInitialSession();
  }, [isOrderPage]);

  // 2. Logika Auto-Lock 5 Menit
  useEffect(() => {
    // Matikan timer auto-lock untuk pelanggan yang sedang pesan kopi
    if (isOrderPage) return;

    let timeout: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      if (!isLocked) {
        timeout = setTimeout(
          () => {
            localStorage.removeItem("rockopi_admin_session");
            setIsLocked(true);
          },
          5 * 60 * 1000,
        );
      }
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("touchstart", resetTimer);

    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
      clearTimeout(timeout);
    };
  }, [isLocked, isOrderPage]);

  const lock = () => {
    localStorage.removeItem("rockopi_admin_session");
    setIsLocked(true);
    setInputPin("");
    setError("");
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin.length !== 6) return;

    setIsVerifying(true);
    setError("");

    try {
      // Memanggil Server Action (Sama amannya seperti Edge Function)
      const response = await verifyAdminPin(inputPin);

      if (response.success) {
        localStorage.setItem("rockopi_admin_session", "authenticated");
        setIsLocked(false);
        setInputPin("");
      } else {
        setError(response.message || "PIN Salah");
        setInputPin("");
      }
    } catch (err) {
      setError("Gagal menghubungi server keamanan.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <LockContext.Provider value={{ isLocked, lock }}>
      {children}

      {/* 3. Tampilkan Layar Kunci HANYA jika isLocked = true DAN bukan di isOrderPage */}
      {isLocked && !isOrderPage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050b07] p-4">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="w-full max-w-sm flex flex-col items-center bg-white/5 border border-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl relative overflow-hidden text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
              <ShieldAlert size={26} className="text-red-400" />
            </div>

            <h2 className="text-xl font-black text-white tracking-widest uppercase">
              Otorisasi Diperlukan
            </h2>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mt-1.5 px-4 leading-relaxed">
              Sistem mendeteksi akses baru. Masukkan PIN Admin Rockopi untuk
              membuka dashboard.
            </p>

            <form onSubmit={handleUnlock} className="w-full space-y-5 mt-8">
              <div className="space-y-2">
                <input
                  type="password"
                  maxLength={6}
                  autoFocus
                  value={inputPin}
                  onChange={(e) => {
                    setError("");
                    setInputPin(e.target.value.replace(/\D/g, ""));
                  }}
                  className="w-full bg-black/50 text-green-400 font-black px-4 py-4 rounded-2xl border border-white/10 focus:border-green-400/50 outline-none text-center tracking-[1.2em] text-2xl transition-all"
                  placeholder="------"
                  disabled={isVerifying}
                  required
                />
                {error && (
                  <p className="text-red-400 text-[11px] font-bold animate-pulse mt-1">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifying || inputPin.length !== 6}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(34,197,94,0.2)]"
              >
                {isVerifying ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Verifikasi Akses"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </LockContext.Provider>
  );
}

export const useLock = () => {
  const context = useContext(LockContext);
  if (!context) throw new Error("useLock must be used within LockProvider");
  return context;
};
