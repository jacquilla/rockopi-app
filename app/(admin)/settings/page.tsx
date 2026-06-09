"use client";

import { useState } from "react";
import { Palette, Smartphone, Share2, Lock, KeyRound, X } from "lucide-react";
import PoweredByFooter from "../../../components/PoweredByFooter";

export default function SettingsPage() {
  // State untuk mengontrol pop-up Ganti PIN
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    // Di sini nanti kita sambungkan dengan sistem Auth Supabase
    alert(
      "Berhasil! Konfigurasi PIN baru telah disiapkan untuk dihubungkan ke database.",
    );
    setIsPinModalOpen(false);
    setOldPin("");
    setNewPin("");
  };

  return (
    <div className="min-h-screen bg-[url('/bg-rockopi.avif')] bg-cover bg-fixed bg-center flex flex-col text-white font-sans">
      {/* MODAL GANTI PIN (GLASSMORPHISM) */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white/10 backdrop-blur-2xl w-full max-w-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col transform transition-all">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/40">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <KeyRound className="text-yellow-400" /> Ganti PIN Akses
              </h3>
              <button
                onClick={() => setIsPinModalOpen(false)}
                className="text-white/60 hover:text-white bg-white/10 p-2 rounded-full transition-all active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePin} className="p-6 flex flex-col gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  PIN Lama
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value)}
                  placeholder="Masukkan 6 digit PIN lama"
                  className="w-full bg-black/40 text-white font-bold px-4 py-3.5 rounded-xl border border-white/10 focus:border-yellow-400 outline-none transition-all text-center tracking-[0.5em] text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  PIN Baru
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Masukkan 6 digit PIN baru"
                  className="w-full bg-black/40 text-white font-bold px-4 py-3.5 rounded-xl border border-white/10 focus:border-yellow-400 outline-none transition-all text-center tracking-[0.5em] text-lg"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600 text-black font-black py-3.5 rounded-xl transition-all shadow-lg active:scale-95 text-sm"
              >
                SIMPAN PIN BARU
              </button>
            </form>
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

          {/* GRID TILE: Diubah menjadi 2 kolom di tablet/laptop agar 4 kotak tampil rapi dan proporsional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TILE 1: KEAMANAN & PIN (BARU) */}
            <div
              onClick={() => setIsPinModalOpen(true)}
              className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer group shadow-xl"
            >
              <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-6 text-yellow-400 group-hover:scale-110 transition-transform">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Keamanan & PIN</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Ubah PIN akses Admin untuk melindungi data keuangan dan menu
                kasir.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer group shadow-xl">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 text-green-300 group-hover:scale-110 transition-transform">
                <Palette size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Tema & Estetika</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Kustomisasi palet warna, logo, dan background utama aplikasi
                Rockopi.
              </p>
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
                Hubungkan link sosial media Digi Business untuk promosi
                otomatis.
              </p>
            </div>
          </div>

          <div className="flex-1"></div>
          <PoweredByFooter />
        </div>
      </div>
    </div>
  );
}
