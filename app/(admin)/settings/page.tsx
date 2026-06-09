"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLock } from "@/lib/lock-context";
import { useTheme, THEMES } from "@/lib/theme-context";
import { Palette, Smartphone, Share2, Lock, KeyRound, X, Loader as Loader2, Check, ChevronRight } from "lucide-react";
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
      alert("PIN harus 6 digit angka!");
      return;
    }
    if (oldPin !== cachedDbPin) {
      alert("PIN lama salah.");
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("admin_settings")
        .update({ value: newPin })
        .eq("key", "admin_pin");
      if (error) throw error;
      alert("PIN berhasil diperbarui!");
      setIsPinModalOpen(false);
      setOldPin("");
      setNewPin("");
      fetchCurrentPin();
    } catch (err) {
      alert("Gagal memperbarui PIN.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/bg-rockopi.avif')] bg-cover bg-fixed bg-center flex flex-col text-white font-sans">
      {/* MODAL GANTI PIN */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white/10 backdrop-blur-2xl w-full max-w-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/40">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <KeyRound className="text-yellow-400" /> Ganti PIN Akses
              </h3>
              <button
                onClick={() => { if (!isSaving) setIsPinModalOpen(false); }}
                className="text-white/60 hover:text-white bg-white/10 p-2 rounded-full transition-all"
                disabled={isSaving}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSavePin} className="p-6 flex flex-col gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">PIN Lama</label>
                <input
                  type="password"
                  maxLength={6}
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="------"
                  className="w-full bg-black/40 text-white font-bold px-4 py-3.5 rounded-xl border border-white/10 focus:border-yellow-400 outline-none text-center tracking-[0.5em] text-lg"
                  disabled={isSaving}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">PIN Baru</label>
                <input
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="------"
                  className="w-full bg-black/40 text-white font-bold px-4 py-3.5 rounded-xl border border-white/10 focus:border-yellow-400 outline-none text-center tracking-[0.5em] text-lg"
                  disabled={isSaving}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black font-black py-3.5 rounded-xl transition-all shadow-lg active:scale-95 text-sm flex items-center justify-center gap-2"
              >
                {isSaving ? <><Loader2 className="animate-spin" size={18} /> Menyimpan...</> : "SIMPAN PIN BARU"}
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
                <Palette className="text-green-300" /> Tema & Estetika
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
              </p>
              {THEMES.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => {
                    setTheme(t);
                    setIsThemeModalOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${
                    themeIndex === i
                      ? "bg-[#1B4332]/80 border-[#1B4332] shadow-lg"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-xl shadow-inner flex-shrink-0 flex items-center justify-center border-2 border-white/20"
                    style={{ backgroundColor: t.primary }}
                  >
                    {themeIndex === i && <Check className="text-white" size={20} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white group-hover:text-white">{t.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Primary: <span style={{ color: t.primary }}>{t.primary}</span>
                    </p>
                  </div>
                  <ChevronRight className="text-white/30" size={18} />
                </button>
              ))}

              <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/10">
                <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Tema Aktif</p>
                <div
                  className="w-full h-20 rounded-xl shadow-lg border border-white/10"
                  style={{ backgroundColor: theme.bodyBg }}
                >
                  <div className="flex items-center justify-center h-full gap-2 text-sm font-bold" style={{ color: theme.textHeading }}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.primary }} />
                    {theme.name}
                  </div>
                </div>
              </div>
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
            <div
              onClick={() => {
                if (isPinLoading) {
                  alert("Sistem sedang menyinkronkan data keamanan...");
                } else if (cachedDbPin) {
                  setIsPinModalOpen(true);
                } else {
                  alert("PIN tidak dapat dimuat. Coba lagi.");
                }
              }}
              className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer group shadow-xl"
            >
              <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-6 text-yellow-400 group-hover:scale-110 transition-transform">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Keamanan & PIN</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Ubah PIN akses Admin untuk melindungi data keuangan dan menu kasir.
              </p>
            </div>

            <div
              onClick={() => setIsThemeModalOpen(true)}
              className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer group shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: theme.primary + "30" }}
              >
                <Palette size={24} style={{ color: theme.primary }} />
              </div>
              <h3 className="text-xl font-bold mb-2">Tema & Estetika</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Kustomisasi palet warna, logo, dan background utama aplikasi Rockopi.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.primary }} />
                <span className="text-xs font-bold" style={{ color: theme.primary }}>
                  {theme.name}
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer group shadow-xl">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 text-blue-300 group-hover:scale-110 transition-transform">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Device Kasir</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Kelola perangkat yang terhubung ke live-feed dashboard dapur.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer group shadow-xl">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 text-purple-300 group-hover:scale-110 transition-transform">
                <Share2 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Sosial Media</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Hubungkan link sosial media Digi Business untuk promosi otomatis.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Keamanan Sesi</h3>
              <Lock size={20} className="text-yellow-400" />
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Aplikasi akan terkunci secara otomatis setelah 5 menit tidak aktif. Anda juga dapat mengunci secara manual.
            </p>
            <button
              onClick={lock}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 px-5 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center gap-2"
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
