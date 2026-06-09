"use client";

import { Palette, Smartphone, Share2 } from "lucide-react";
import PoweredByFooter from "../../../components/PoweredByFooter";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[url('/bg-rockopi.avif')] bg-cover bg-fixed bg-center flex flex-col text-white">
      <div className="flex-1 bg-black/50 backdrop-blur-sm p-4 md:p-8 pt-6 flex flex-col">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col space-y-8 pb-10">
          <header className="pt-4">
            <h2 className="text-3xl font-black drop-shadow-lg flex items-center gap-3">
              Pengaturan Sistem Rockopi
            </h2>
            <p className="text-gray-200 font-medium mt-1">
              Konfigurasi aplikasi dan identitas visual bisnis Anda.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 text-green-300 group-hover:scale-110 transition-transform">
                <Palette size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Tema & Estetika</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Kustomisasi palet warna, logo, dan background utama aplikasi
                Rockopi.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 text-blue-300 group-hover:scale-110 transition-transform">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Device Kasir</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Kelola perangkat yang terhubung ke live-feed dashboard dapur.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 text-purple-300 group-hover:scale-110 transition-transform">
                {/* Mengganti Instagram dengan Share2 di sini */}
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
