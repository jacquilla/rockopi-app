"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";
import { Lock, Loader2 } from "lucide-react";

type LockContextType = {
  isLocked: boolean;
  lock: () => void;
};

const LockContext = createContext<LockContextType | undefined>(undefined);

export function LockProvider({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(false);
  const [inputPin, setInputPin] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  // Sistem Auto-lock (Aplikasi akan mengunci sendiri jika 5 menit tidak disentuh)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const reset = () => {
      clearTimeout(timeout);
      if (!isLocked)
        timeout = setTimeout(() => setIsLocked(true), 5 * 60 * 1000);
    };
    window.addEventListener("mousemove", reset);
    window.addEventListener("keydown", reset);
    window.addEventListener("click", reset);
    window.addEventListener("touchstart", reset);
    reset();
    return () => {
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("keydown", reset);
      window.removeEventListener("click", reset);
      window.removeEventListener("touchstart", reset);
      clearTimeout(timeout);
    };
  }, [isLocked]);

  // Fungsi untuk memicu layar kunci secara manual (Dipanggil oleh tombol Kunci)
  const lock = () => {
    setIsLocked(true);
    setInputPin("");
    setError("");
  };

  // Fungsi untuk memverifikasi PIN ke Database Supabase
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin.length !== 6) return;

    setIsVerifying(true);
    setError("");

    try {
      const { data, error: dbError } = await supabase
        .from("admin_settings")
        .select("value")
        .eq("key", "admin_pin")
        .single();

      if (dbError) throw dbError;

      // Jika PIN cocok dengan database, buka kuncinya!
      if (data && data.value === inputPin) {
        setIsLocked(false);
        setInputPin("");
      } else {
        setError("PIN Salah. Akses Ditolak!");
        setInputPin("");
      }
    } catch (err) {
      setError("Gagal terhubung ke server keamanan.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <LockContext.Provider value={{ isLocked, lock }}>
      {children}

      {/* LAYAR OVERLAY SAAT TERKUNCI (UI ESTETIK) */}
      {isLocked && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#07110a]/95 backdrop-blur-xl p-4">
          <div className="w-full max-w-sm flex flex-col items-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_50px_rgba(34,197,94,0.15)]">
              <Lock size={32} className="text-green-400" />
            </div>

            <h2 className="text-2xl font-black text-white tracking-widest mb-2">
              SISTEM TERKUNCI
            </h2>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-8 text-center">
              Masukkan PIN untuk membuka akses
            </p>

            <form onSubmit={handleUnlock} className="w-full space-y-6">
              <div className="space-y-2 text-center">
                <input
                  type="password"
                  maxLength={6}
                  autoFocus
                  value={inputPin}
                  onChange={(e) => {
                    setError("");
                    setInputPin(e.target.value.replace(/\D/g, ""));
                  }}
                  className="w-full bg-black/40 text-green-400 font-black px-4 py-4 rounded-2xl border border-white/10 focus:border-green-400/50 outline-none text-center tracking-[1.5em] text-2xl transition-all"
                  placeholder="------"
                  disabled={isVerifying}
                  required
                />
                {error && (
                  <p className="text-red-400 text-xs font-bold animate-pulse">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifying || inputPin.length !== 6}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-black py-4 rounded-xl text-sm transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "BUKA BRANKAS"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </LockContext.Provider>
  );
}

// Hook kustom agar tombol Kunci di Sidebar bisa memanggil fungsi lock()
export const useLock = () => {
  const context = useContext(LockContext);
  if (!context) throw new Error("useLock must be used within LockProvider");
  return context;
};
