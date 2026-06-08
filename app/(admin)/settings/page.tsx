"use client";

import { useState } from "react";
import { Settings, ShieldCheck, KeyRound, Save } from "lucide-react";

export default function SettingsPage() {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Ambil PIN yang aktif saat ini
    const savedPin = localStorage.getItem("rockopi_admin_pin") || "123456";

    // 2. Validasi Keamanan
    if (currentPin !== savedPin) {
      alert("Gagal! PIN saat ini (Lama) yang Anda masukkan salah.");
      return;
    }

    if (newPin !== confirmPin) {
      alert("Gagal! Konfirmasi PIN baru tidak cocok.");
      return;
    }

    if (newPin.length < 4) {
      alert("Gagal! PIN baru minimal harus terdiri dari 4 karakter.");
      return;
    }

    // 3. Simpan PIN Baru
    localStorage.setItem("rockopi_admin_pin", newPin);
    alert(
      "Berhasil! PIN / Password Admin telah diganti.\n\nSimpan PIN baru Anda baik-baik.",
    );

    // Kosongkan form
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* HEADER UTAMA */}
      <header className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-white/80 backdrop-blur-sm text-[#1B4332] rounded-lg shadow-sm border border-white/50">
          <Settings size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 drop-shadow-sm">
            Pengaturan Sistem
          </h2>
          <p className="text-gray-700 font-medium">
            Manajemen keamanan dan konfigurasi aplikasi.
          </p>
        </div>
      </header>

      {/* KARTU MANAJEMEN PASSWORD */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 overflow-hidden">
        <div className="bg-[#1B4332] p-6 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck size={24} className="text-green-300" />
              Ganti PIN Keamanan
            </h3>
            <p className="text-sm text-green-100/80 mt-1">
              Ubah kata sandi untuk mengakses dashboard Admin.
            </p>
          </div>
          <KeyRound size={48} className="text-white/20" />
        </div>

        <form onSubmit={handleChangePin} className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              PIN Aktif Saat Ini
            </label>
            <input
              type="password"
              required
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              placeholder="Masukkan PIN yang sedang digunakan"
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1B4332] outline-none bg-white/50 tracking-widest font-mono"
            />
            <p className="text-xs text-gray-500 italic">
              *PIN bawaan sistem (default) adalah 123456.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Buat PIN Baru
              </label>
              <input
                type="password"
                required
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Minimal 4 Karakter"
                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50/30 tracking-widest font-mono text-blue-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Ulangi PIN Baru
              </label>
              <input
                type="password"
                required
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Ketik ulang PIN baru"
                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50/30 tracking-widest font-mono text-blue-800"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full md:w-auto bg-[#1B4332] hover:bg-green-900 text-white font-bold py-4 px-8 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Save size={20} />
              Simpan Perubahan PIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
