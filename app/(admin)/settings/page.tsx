"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import {
  Settings,
  Lock,
  Palette,
  Shield,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useTheme, THEMES } from "@/lib/theme-context";
import PoweredByFooter from "../../../components/PoweredByFooter";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  // State untuk form PIN
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinMessage, setPinMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSavingPin, setIsSavingPin] = useState(false);
  const [cachedDbPin, setCachedDbPin] = useState("");

  // Menarik PIN asli dari Supabase agar bisa memverifikasi "PIN Lama"
  const fetchSettings = async () => {
    const { data } = await supabase
      .from("admin_settings")
      .select("key, value")
      .eq("key", "admin_pin");
    if (data) {
      const pinData = data.find((d) => d.key === "admin_pin");
      if (pinData) setCachedDbPin(pinData.value);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinMessage(null);

    if (currentPin !== cachedDbPin) {
      setPinMessage({ type: "error", text: "Gagal: PIN saat ini salah!" });
      return;
    }
    if (newPin !== confirmPin) {
      setPinMessage({
        type: "error",
        text: "Gagal: Konfirmasi PIN tidak cocok!",
      });
      return;
    }
    if (newPin.length !== 6) {
      setPinMessage({ type: "error", text: "PIN harus genap 6 digit angka!" });
      return;
    }

    setIsSavingPin(true);
    try {
      // Tembak PIN baru ke Database Supabase!
      const { error } = await supabase
        .from("admin_settings")
        .update({ value: newPin })
        .eq("key", "admin_pin");
      if (error) throw error;

      setCachedDbPin(newPin);
      setPinMessage({
        type: "success",
        text: "Berhasil! Sandi PIN baru telah tersimpan di Database.",
      });
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
    } catch (err) {
      setPinMessage({
        type: "error",
        text: "Koneksi database terputus. Gagal menyimpan.",
      });
    } finally {
      setIsSavingPin(false);
    }
  };

  const handleThemeSelect = async (selectedTheme: (typeof THEMES)[0]) => {
    setTheme(selectedTheme);
    await supabase
      .from("admin_settings")
      .upsert(
        { key: "active_theme", value: selectedTheme.name },
        { onConflict: "key" },
      );
  };

  return (
    <div className="min-h-full flex flex-col font-sans bg-[#07110a]/90 backdrop-blur-md">
      <div className="flex-1 p-4 md:p-7 flex flex-col gap-6">
        {/* HEADER FIGMA */}
        <div className="flex items-center gap-4">
          <Settings size={24} style={{ color: theme.primary || "#4ade80" }} />
          <div>
            <h2 className="text-2xl font-black text-white">
              Pengaturan Sistem
            </h2>
            <p className="text-white/40 text-xs mt-1">
              Konfigurasi keamanan dan personalisasi visual Rockopi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KOTAK KEAMANAN PIN UI FIGMA */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">
                  Ganti PIN Akses
                </h3>
                <p className="text-white/40 text-[10px]">
                  Autentikasi keamanan brankas
                </p>
              </div>
            </div>

            <form
              onSubmit={handleChangePin}
              className="space-y-4 flex-1 flex flex-col"
            >
              {pinMessage && (
                <div
                  className={`p-3 rounded-lg flex items-start gap-2 text-xs font-bold ${pinMessage.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
                >
                  {pinMessage.type === "success" ? (
                    <CheckCircle size={14} />
                  ) : (
                    <AlertTriangle size={14} />
                  )}
                  <span className="flex-1">{pinMessage.text}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-white/40 text-[10px] font-bold uppercase tracking-wider">
                  PIN Saat Ini
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={currentPin}
                  onChange={(e) =>
                    setCurrentPin(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="------"
                  className="w-full bg-black/40 text-white placeholder-white/20 px-4 py-3 rounded-xl border border-white/10 focus:border-green-400/50 outline-none text-center tracking-[1em] font-black transition-all"
                  required
                  disabled={isSavingPin}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-white/40 text-[10px] font-bold uppercase tracking-wider">
                  PIN Baru (6 Digit)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="------"
                  className="w-full bg-black/40 text-white placeholder-white/20 px-4 py-3 rounded-xl border border-white/10 focus:border-green-400/50 outline-none text-center tracking-[1em] font-black transition-all"
                  required
                  disabled={isSavingPin}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-white/40 text-[10px] font-bold uppercase tracking-wider">
                  Konfirmasi PIN Baru
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) =>
                    setConfirmPin(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="------"
                  className="w-full bg-black/40 text-white placeholder-white/20 px-4 py-3 rounded-xl border border-white/10 focus:border-green-400/50 outline-none text-center tracking-[1em] font-black transition-all"
                  required
                  disabled={isSavingPin}
                />
              </div>

              <button
                type="submit"
                disabled={isSavingPin || !currentPin || !newPin || !confirmPin}
                className="w-full py-3.5 mt-auto bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-xl text-xs transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSavingPin ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Lock size={14} /> Perbarui PIN
                  </>
                )}
              </button>
            </form>
          </div>

          {/* KOTAK TEMA & INFO SISTEM UI FIGMA */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:col-span-2 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <Palette size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">
                  Tema & Estetika Visual
                </h3>
                <p className="text-white/40 text-[10px]">
                  Pilih palet warna antarmuka aplikasi
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {THEMES.map((t) => {
                const isActive = theme.name === t.name;
                return (
                  <button
                    key={t.name}
                    onClick={() => handleThemeSelect(t)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isActive ? "bg-white/10 border-white/30 shadow-lg" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/20"
                      style={{ backgroundColor: t.primary }}
                    >
                      {isActive && (
                        <CheckCircle
                          size={14}
                          className="text-white drop-shadow-md"
                        />
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold ${isActive ? "text-white" : "text-white/60"}`}
                    >
                      {t.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Kotak Informasi Sistem */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock size={18} className="text-white/40" />
                <h3 className="text-white font-bold text-sm">
                  Informasi Sistem Keamanan
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Versi Sistem", value: "v2.5.0" },
                  { label: "Auto-lock", value: "5 Menit" },
                  { label: "Database", value: "Supabase" },
                  {
                    label: "Status DB",
                    value: "● Tersinkronisasi",
                    color: "text-green-400",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-black/30 border border-white/5 rounded-xl p-4"
                  >
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-1">
                      {item.label}
                    </p>
                    <p
                      className={`text-xs font-black ${item.color || "text-white"}`}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <PoweredByFooter />
        </div>
      </div>
    </div>
  );
}
