"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLock } from "@/lib/lock-context";
import { useTheme, THEMES } from "@/lib/theme-context";
import {
  Palette,
  Smartphone,
  Share2,
  Lock,
  KeyRound,
  X,
  Loader as Loader2,
  Check,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import PoweredByFooter from "@/components/PoweredByFooter";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const { lock } = useLock();
  const { theme, setTheme, themeIndex } = useTheme();
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [cachedDbPin, setCachedDbPin] = useState("");
  const [isPinLoading, setIsPinLoading] = useState(true);

  // Efek transisi warna dinamis (Hex ke RGBA untuk glow)
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const primaryGlow = theme.primary
    ? hexToRgba(theme.primary, 0.4)
    : "rgba(255,255,255,0.1)";
  const primaryLight = theme.primary
    ? hexToRgba(theme.primary, 0.15)
    : "rgba(255,255,255,0.05)";

  const fetchCurrentPin = async () => {
    setIsPinLoading(true);
    try {
      const { data, error } = await supabase
        .from("admin_settings")
        .select("value")
        .eq("key", "admin_pin")
        .maybeSingle();
      if (error) throw error;
      if (data?.value) setCachedDbPin(data.value);
    } catch (err) {
      console.error("Gagal memuat konfigurasi PIN:", err);
    } finally {
      setIsPinLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentPin();
  }, []);

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPin.length !== 6 || newPin.length !== 6) {
      alert("PIN harus 6 digit angka penuh!");
      return;
    }
    if (oldPin !== cachedDbPin) {
      alert("Autentikasi Gagal: PIN lama tidak cocok.");
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("admin_settings")
        .update({ value: newPin })
        .eq("key", "admin_pin");
      if (error) throw error;
      alert("Luar Biasa! PIN Akses berhasil diperbarui.");
      setIsPinModalOpen(false);
      setOldPin("");
      setNewPin("");
      fetchCurrentPin();
    } catch (err) {
      alert("Sistem gagal memperbarui PIN.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[url('/bg-rockopi.avif')] bg-cover bg-fixed bg-center flex flex-col text-white font-sans relative transition-all duration-700 ease-in-out"
      style={{ backgroundColor: theme.bodyBg || "#0a1f16" }}
    >
      {/* DINAMIC AURORA GLOW - Ini yang membuat tema terasa menyatu dengan background */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-1000 ease-in-out"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${primaryGlow} 0%, transparent 60%), radial-gradient(circle at 50% 100%, ${primaryLight} 0%, transparent 50%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* MODAL GANTI PIN DENGAN TEMA DINAMIS */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div
            className="bg-black/60 backdrop-blur-2xl w-full max-w-md rounded-3xl shadow-2xl border overflow-hidden flex flex-col transition-all duration-300"
            style={{
              borderColor: primaryGlow,
              boxShadow: `0 20px 50px -10px ${primaryGlow}`,
            }}
          >
            <div
              className="p-5 border-b flex justify-between items-center"
              style={{
                borderColor: primaryLight,
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <h3
                className="text-xl font-black flex items-center gap-3 tracking-wide"
                style={{ color: theme.primary }}
              >
                <ShieldCheck size={24} /> Reset PIN Akses
              </h3>
              <button
                onClick={() => {
                  if (!isSaving) setIsPinModalOpen(false);
                }}
                className="text-white/60 hover:text-white bg-white/10 p-2 rounded-full transition-all active:scale-95"
                disabled={isSaving}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSavePin} className="p-7 flex flex-col gap-6">
              <div className="space-y-2.5">
                <label
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: theme.primary }}
                >
                  PIN Lama
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="------"
                  className="w-full bg-black/40 text-white font-black px-4 py-4 rounded-2xl border outline-none text-center tracking-[1em] text-xl transition-all"
                  style={{
                    borderColor: oldPin
                      ? theme.primary
                      : "rgba(255,255,255,0.1)",
                  }}
                  disabled={isSaving}
                  required
                />
              </div>
              <div className="space-y-2.5">
                <label
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: theme.primary }}
                >
                  PIN Baru
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="------"
                  className="w-full bg-black/40 text-white font-black px-4 py-4 rounded-2xl border outline-none text-center tracking-[1em] text-xl transition-all"
                  style={{
                    borderColor: newPin
                      ? theme.primary
                      : "rgba(255,255,255,0.1)",
                  }}
                  disabled={isSaving}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full mt-4 font-black py-4 rounded-2xl transition-all active:scale-95 text-sm flex items-center justify-center gap-2 tracking-wide shadow-lg"
                style={{
                  backgroundColor: theme.primary,
                  color: theme.textHeading || "#000",
                  boxShadow: `0 10px 20px -5px ${primaryGlow}`,
                }}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> MENYIMPAN KE
                    CLOUD...
                  </>
                ) : (
                  "SIMPAN PIN BARU"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PEMILIH TEMA (THEME PICKER) PREMIUM */}
      {isThemeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div
            className="bg-black/80 backdrop-blur-3xl w-full max-w-lg rounded-[2rem] shadow-2xl border overflow-hidden flex flex-col max-h-[90vh]"
            style={{ borderColor: primaryLight }}
          >
            <div
              className="p-6 border-b flex justify-between items-center"
              style={{ borderColor: primaryLight }}
            >
              <h3
                className="text-2xl font-black flex items-center gap-3"
                style={{ color: theme.primary }}
              >
                <Palette size={28} /> Etalase Tema
              </h3>
              <button
                onClick={() => setIsThemeModalOpen(false)}
                className="text-white/60 hover:text-white bg-white/10 p-2.5 rounded-full transition-all active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 scrollbar-hide">
              <p className="text-sm font-medium text-gray-300 mb-6 leading-relaxed">
                Pilih identitas visual yang paling mewakili karakter bisnis dan
                *mood* operasional Anda hari ini.
              </p>

              <div className="grid gap-3">
                {THEMES.map((t, i) => {
                  const isSelected = themeIndex === i;
                  return (
                    <button
                      key={t.name}
                      onClick={() => {
                        setTheme(t);
                        // Hapus baris ini jika Anda tidak ingin modal langsung tertutup setelah memilih
                        // setIsThemeModalOpen(false);
                      }}
                      className="w-full flex items-center gap-5 p-4 rounded-2xl border transition-all duration-300 text-left group relative overflow-hidden"
                      style={{
                        backgroundColor: isSelected
                          ? hexToRgba(t.primary, 0.15)
                          : "rgba(255,255,255,0.03)",
                        borderColor: isSelected
                          ? t.primary
                          : "rgba(255,255,255,0.05)",
                        transform: isSelected ? "scale(1.02)" : "scale(1)",
                      }}
                    >
                      {/* Accent glow on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `linear-gradient(90deg, ${hexToRgba(t.primary, 0.2)} 0%, transparent 100%)`,
                        }}
                      />

                      <div
                        className="w-14 h-14 rounded-full shadow-inner flex-shrink-0 flex items-center justify-center border-4 relative z-10 transition-transform duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: t.primary,
                          borderColor: isSelected
                            ? "#fff"
                            : "rgba(255,255,255,0.2)",
                        }}
                      >
                        {isSelected && (
                          <Check
                            className="text-white"
                            size={24}
                            strokeWidth={3}
                          />
                        )}
                      </div>

                      <div className="flex-1 relative z-10">
                        <p
                          className="font-black text-lg tracking-wide transition-colors"
                          style={{ color: isSelected ? t.primary : "#fff" }}
                        >
                          {t.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 font-medium">
                          HEX:{" "}
                          <span style={{ color: t.primary }}>{t.primary}</span>
                        </p>
                      </div>
                      <ChevronRight
                        className="relative z-10 transition-transform group-hover:translate-x-1"
                        style={{
                          color: isSelected
                            ? t.primary
                            : "rgba(255,255,255,0.3)",
                        }}
                        size={20}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KONTEN UTAMA HALAMAN SETTINGS */}
      <div className="flex-1 z-10 p-4 md:p-8 pt-6 flex flex-col">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col space-y-8 pb-10">
          <header
            className="pt-4 border-b pb-6"
            style={{ borderColor: primaryLight }}
          >
            <h2 className="text-4xl font-black drop-shadow-lg flex items-center gap-3 tracking-tight">
              Sistem <span style={{ color: theme.primary }}>Terpadu</span>
            </h2>
            <p className="text-gray-300 font-medium mt-2 text-lg">
              Kendalikan penuh keamanan, integrasi *device*, dan estetika
              aplikasi Anda.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CARD 1: KEAMANAN PIN */}
            <div
              onClick={() => {
                if (isPinLoading)
                  alert("Sistem sedang menyinkronkan data keamanan...");
                else if (cachedDbPin) setIsPinModalOpen(true);
                else
                  alert(
                    "Koneksi ke database PIN terputus. Silakan muat ulang.",
                  );
              }}
              className="bg-black/40 backdrop-blur-2xl p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer group hover:-translate-y-1"
              style={{
                borderColor: primaryLight,
                boxShadow: `0 10px 30px -15px ${primaryGlow}`,
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:rotate-12"
                style={{ backgroundColor: primaryLight, color: theme.primary }}
              >
                <KeyRound size={28} />
              </div>
              <h3
                className="text-2xl font-black mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text transition-all"
                style={{
                  backgroundImage: `linear-gradient(45deg, #fff, ${theme.primary})`,
                }}
              >
                Keamanan & PIN
              </h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                Ubah PIN autentikasi Admin untuk menjaga kerahasiaan data
                finansial dan mengunci akses pihak luar.
              </p>
            </div>

            {/* CARD 2: TEMA & ESTETIKA */}
            <div
              onClick={() => setIsThemeModalOpen(true)}
              className="bg-black/40 backdrop-blur-2xl p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer group hover:-translate-y-1"
              style={{
                borderColor: primaryLight,
                boxShadow: `0 10px 30px -15px ${primaryGlow}`,
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:rotate-12"
                style={{ backgroundColor: primaryLight, color: theme.primary }}
              >
                <Palette size={28} />
              </div>
              <h3
                className="text-2xl font-black mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text transition-all"
                style={{
                  backgroundImage: `linear-gradient(45deg, #fff, ${theme.primary})`,
                }}
              >
                Tema Visual
              </h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed mb-5">
                Kustomisasi antarmuka UI. Tema yang sedang aktif saat ini adalah{" "}
                <strong style={{ color: theme.primary }}>{theme.name}</strong>.
              </p>
              <div className="flex items-center gap-3 bg-black/50 p-3 rounded-xl border border-white/5 w-fit">
                <div
                  className="w-4 h-4 rounded-full shadow-md"
                  style={{ backgroundColor: theme.primary }}
                />
                <span className="text-xs font-bold tracking-widest uppercase text-gray-300">
                  Aktif
                </span>
              </div>
            </div>

            {/* CARD 3: DEVICE KASIR */}
            <div
              className="bg-black/40 backdrop-blur-2xl p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer group hover:-translate-y-1"
              style={{
                borderColor: primaryLight,
                boxShadow: `0 10px 30px -15px ${primaryGlow}`,
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:rotate-12"
                style={{ backgroundColor: primaryLight, color: theme.primary }}
              >
                <Smartphone size={28} />
              </div>
              <h3 className="text-2xl font-black mb-3 text-white">
                Sinkronisasi Perangkat
              </h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                Kelola sesi *smartphone* kasir dan tablet yang terhubung ke
                dalam ekosistem *live-feed* Rockopi.
              </p>
            </div>

            {/* CARD 4: SOSIAL MEDIA */}
            <div
              className="bg-black/40 backdrop-blur-2xl p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer group hover:-translate-y-1"
              style={{
                borderColor: primaryLight,
                boxShadow: `0 10px 30px -15px ${primaryGlow}`,
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:rotate-12"
                style={{ backgroundColor: primaryLight, color: theme.primary }}
              >
                <Share2 size={28} />
              </div>
              <h3 className="text-2xl font-black mb-3 text-white">
                Eksposur Digital
              </h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                Tautkan profil Instagram dan optimasi SEO lokal yang
                dipersembahkan oleh Digi Business.
              </p>
            </div>
          </div>

          {/* ZONA KUNCI OTOMATIS */}
          <div className="mt-8 bg-black/60 backdrop-blur-2xl p-8 rounded-[2rem] border border-red-500/20 shadow-[0_10px_40px_-10px_rgba(239,68,68,0.15)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black mb-2 flex items-center gap-3 text-red-400">
                <Lock size={24} /> Kunci Sesi (Lock System)
              </h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-2xl">
                Aplikasi dirancang dengan tingkat keamanan bank. Layar akan
                otomatis terkunci jika tidak ada aktivitas selama 5 menit. Anda
                juga dapat menguncinya sekarang jika akan meninggalkan meja.
              </p>
            </div>
            <button
              onClick={lock}
              className="w-full md:w-auto bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 whitespace-nowrap shadow-lg"
            >
              <Lock size={18} strokeWidth={3} /> KUNCI SEKARANG
            </button>
          </div>

          <div className="flex-1"></div>
          <PoweredByFooter />
        </div>
      </div>
    </div>
  );
}
