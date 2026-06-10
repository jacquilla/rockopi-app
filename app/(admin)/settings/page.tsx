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
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);

  // Mengambil PIN dan Tema Aktif dari Database
  const fetchSettings = async () => {
    setIsSettingsLoading(true);
    try {
      const { data, error } = await supabase
        .from("admin_settings")
        .select("key, value")
        .in("key", ["admin_pin", "active_theme"]); // Mengambil 2 pengaturan sekaligus

      if (error) throw error;

      if (data) {
        // Set PIN Lama
        const pinData = data.find((d) => d.key === "admin_pin");
        if (pinData) setCachedDbPin(pinData.value);

        // Set Tema Aktif
        const themeData = data.find((d) => d.key === "active_theme");
        if (themeData) {
          const savedTheme = THEMES.find((t) => t.name === themeData.value);
          if (savedTheme) setTheme(savedTheme);
        }
      }
    } catch (err) {
      console.error("Gagal memuat pengaturan dari database:", err);
    } finally {
      setIsSettingsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Simpan PIN ke Database
  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPin.length !== 6 || newPin.length !== 6) {
      alert("PIN harus 6 digit angka penuh!");
      return;
    }
    if (oldPin !== cachedDbPin) {
      alert("PIN lama yang Anda masukkan salah.");
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("admin_settings")
        .update({ value: newPin })
        .eq("key", "admin_pin");

      if (error) throw error;

      alert("PIN Akses berhasil diperbarui!");
      setIsPinModalOpen(false);
      setOldPin("");
      setNewPin("");
      fetchSettings();
    } catch (err) {
      alert("Gagal memperbarui PIN.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Simpan Tema ke Database (Integrasi Baru)
  const handleThemeChange = async (selectedTheme: (typeof THEMES)[0]) => {
    setTheme(selectedTheme); // Ubah tampilan secara instan (Optimistic UI)
    setIsThemeModalOpen(false);

    try {
      // Upsert: Update jika sudah ada, Insert jika belum ada di database
      const { error } = await supabase
        .from("admin_settings")
        .upsert(
          { key: "active_theme", value: selectedTheme.name },
          { onConflict: "key" },
        );

      if (error) throw error;
    } catch (err) {
      console.error("Gagal menyimpan tema ke database:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/bg-rockopi.avif')] bg-cover bg-fixed bg-center flex flex-col text-white font-sans transition-colors duration-500">
      {/* MODAL GANTI PIN */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white/10 backdrop-blur-2xl w-full max-w-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/40">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <KeyRound style={{ color: theme.primary }} /> Ganti PIN Akses
              </h3>
              <button
                onClick={() => {
                  if (!isSaving) setIsPinModalOpen(false);
                }}
                className="text-white/60 hover:text-white bg-white/10 p-2 rounded-full transition-all"
                disabled={isSaving}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSavePin} className="p-6 flex flex-col gap-5">
              <div className="space-y-2">
                <label
                  className="text-xs font-bold text-gray-300 uppercase tracking-wider"
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
                  className="w-full bg-black/40 text-white font-bold px-4 py-3.5 rounded-xl border border-white/10 focus:border-white/30 outline-none text-center tracking-[0.5em] text-lg transition-all"
                  style={{ borderColor: oldPin ? theme.primary : "" }}
                  disabled={isSaving}
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-xs font-bold text-gray-300 uppercase tracking-wider"
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
                  className="w-full bg-black/40 text-white font-bold px-4 py-3.5 rounded-xl border border-white/10 focus:border-white/30 outline-none text-center tracking-[0.5em] text-lg transition-all"
                  style={{ borderColor: newPin ? theme.primary : "" }}
                  disabled={isSaving}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full mt-2 text-white font-black py-3.5 rounded-xl transition-all shadow-lg active:scale-95 text-sm flex items-center justify-center gap-2"
                style={{ backgroundColor: theme.primary }}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Menyimpan...
                  </>
                ) : (
                  "SIMPAN PIN BARU"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TEMA */}
      {isThemeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white/10 backdrop-blur-2xl w-full max-w-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/40">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Palette style={{ color: theme.primary }} /> Tema & Estetika
              </h3>
              <button
                onClick={() => setIsThemeModalOpen(false)}
                className="text-white/60 hover:text-white bg-white/10 p-2 rounded-full transition-all"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <p className="text-sm text-gray-300 mb-4">
                Pilih tema yang sesuai dengan suasana dan identitas brand Anda.
                Pilihan Anda akan tersimpan di database.
              </p>
              {THEMES.map((t) => {
                const isActive = theme.name === t.name;
                return (
                  <button
                    key={t.name}
                    onClick={() => handleThemeChange(t)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${
                      isActive
                        ? "shadow-lg"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                    style={{
                      backgroundColor: isActive ? `${t.primary}30` : "",
                      borderColor: isActive ? t.primary : "",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl shadow-inner flex-shrink-0 flex items-center justify-center border-2 border-white/20"
                      style={{ backgroundColor: t.primary }}
                    >
                      {isActive && <Check className="text-white" size={20} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white group-hover:text-white">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        HEX:{" "}
                        <span style={{ color: t.primary }}>{t.primary}</span>
                      </p>
                    </div>
                    <ChevronRight className="text-white/30" size={18} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* HALAMAN SETTINGS UTAMA */}
      <div className="flex-1 bg-black/50 backdrop-blur-sm p-4 md:p-8 pt-6 flex flex-col">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col space-y-8 pb-10">
          <header className="pt-4">
            <h2 className="text-3xl font-black drop-shadow-lg flex items-center gap-3">
              Pengaturan Sistem
            </h2>
            <p className="text-gray-200 font-medium mt-1">
              Konfigurasi aplikasi, keamanan, dan identitas visual bisnis Anda.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TILE: KEAMANAN & PIN */}
            <div
              onClick={() => {
                if (isSettingsLoading) {
                  alert("Sistem sedang menyinkronkan data dari server...");
                } else if (cachedDbPin) {
                  setIsPinModalOpen(true);
                } else {
                  alert(
                    "Koneksi ke database PIN terputus. Silakan muat ulang.",
                  );
                }
              }}
              className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer group shadow-xl"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: theme.primary + "30" }}
              >
                <Lock size={24} style={{ color: theme.primary }} />
              </div>
              <h3 className="text-xl font-bold mb-2">Keamanan & PIN</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Ubah PIN akses Admin untuk melindungi data keuangan dan menu
                kasir.
              </p>
            </div>

            {/* TILE: TEMA & ESTETIKA */}
            <div
              onClick={() => setIsThemeModalOpen(true)}
              className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer group shadow-xl"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: theme.primary + "30" }}
              >
                <Palette size={24} style={{ color: theme.primary }} />
              </div>
              <h3 className="text-xl font-bold mb-2">Tema & Estetika</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Kustomisasi palet warna aplikasi Rockopi. Tersinkronisasi dengan
                database.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                />
                <span
                  className="text-xs font-bold"
                  style={{ color: theme.primary }}
                >
                  {theme.name}
                </span>
              </div>
            </div>

            {/* TILE: DEVICE KASIR */}
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer group shadow-xl">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: theme.primary + "30" }}
              >
                <Smartphone size={24} style={{ color: theme.primary }} />
              </div>
              <h3 className="text-xl font-bold mb-2">Device Kasir</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Kelola perangkat yang terhubung ke live-feed dashboard dapur.
              </p>
            </div>

            {/* TILE: SOSIAL MEDIA */}
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer group shadow-xl">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: theme.primary + "30" }}
              >
                <Share2 size={24} style={{ color: theme.primary }} />
              </div>
              <h3 className="text-xl font-bold mb-2">Sosial Media</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Hubungkan link sosial media Digi Business untuk promosi
                otomatis.
              </p>
            </div>
          </div>

          {/* BAGIAN BAWAH: KEAMANAN SESI */}
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Keamanan Sesi</h3>
              <Lock size={20} style={{ color: theme.primary }} />
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Aplikasi akan terkunci secara otomatis setelah 5 menit tidak
              aktif. Anda juga dapat mengunci secara manual untuk mencegah akses
              tidak sah.
            </p>
            <button
              onClick={lock}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 px-5 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center w-fit gap-2"
            >
              <Lock size={16} /> Kunci Sekarang
            </button>
          </div>

          <div className="flex-1"></div>
          <PoweredByFooter />
        </div>
      </div>
    </div>
  );
}
