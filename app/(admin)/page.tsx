"use client";

import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Clock,
  BellDot,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Store,
  ArrowRight,
  Activity,
} from "lucide-react";

export default function DashboardFrontend() {
  const [incomingOrders, setIncomingOrders] = useState<any[]>([]);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // State untuk Data KPI Hari Ini
  const [todayStats, setTodayStats] = useState({
    omset: 0,
    expense: 0,
    net: 0,
    orderCount: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Helper untuk mengecek apakah tanggal transaksi adalah hari ini
  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  useEffect(() => {
    // 1. Setup Jam Real-time
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    // 2. Setup Audio Notifikasi
    audioRef.current = new Audio("/sounds/notification.mp3");
    audioRef.current.load();

    // 3. Fungsi Load Data Utama
    const loadDashboardData = () => {
      try {
        const allData = JSON.parse(
          localStorage.getItem("rockopi_orders") || "[]",
        );

        // --- HITUNG KPI HARI INI ---
        let omset = 0;
        let expense = 0;
        let orderCount = 0;
        const liveOrdersList: any[] = [];

        allData.forEach((item: any) => {
          if (isToday(item.date)) {
            // Hitung Uang Masuk / Keluar
            if (item.type === "IN") {
              omset += item.amount;
              // Pisahkan untuk dimasukkan ke tabel Live Orders (khusus penjualan)
              if (item.desc.includes("Pesanan Pelanggan")) {
                orderCount++;
                liveOrdersList.push(item);
              }
            } else if (item.type === "OUT") {
              expense += item.amount;
            }
          }
        });

        setTodayStats({
          omset,
          expense,
          net: omset - expense,
          orderCount,
        });

        // --- UPDATE TABEL LIVE ORDERS ---
        // Urutkan pesanan dari yang paling baru
        const sortedOrders = liveOrdersList.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        const latestOrders = sortedOrders.slice(0, 10);

        // Putar suara jika ada pesanan baru bertambah
        if (sortedOrders.length > lastOrderCount && lastOrderCount !== 0) {
          if (audioRef.current) {
            audioRef.current
              .play()
              .catch((e) => console.log("Autoplay diblokir", e));
          }
        }

        setIncomingOrders(latestOrders);
        setLastOrderCount(sortedOrders.length);
      } catch (e) {
        console.error("Gagal load data dashboard:", e);
      }
    };

    // Load pertama kali
    loadDashboardData();

    // 4. Detektor Tab Lain (Real-time Sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "rockopi_orders" || e.key === "rockopi_inventory_logs") {
        loadDashboardData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      clearInterval(timer);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [lastOrderCount]);

  if (!currentTime) return null; // Mencegah hydration error di Next.js

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* --- HEADER DASHBOARD --- */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 drop-shadow-sm flex items-center gap-3">
            Dashboard Utama
            <span className="text-xs bg-black/60 backdrop-blur-sm text-green-300 font-bold px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Sync
            </span>
          </h2>
          <p className="text-gray-700 font-medium mt-1">
            Pantau performa Rockopi hari ini secara sekilas.
          </p>
        </div>

        {/* Jam Real-time */}
        <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-sm border border-white/60 flex items-center gap-4">
          <Clock className="text-[#1B4332]" size={24} />
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Waktu Operasional
            </p>
            <p className="text-xl font-black text-gray-900 leading-none mt-0.5">
              {currentTime.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>
        </div>
      </header>

      {/* --- KARTU KPI HARI INI (4 Kolom) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Pesanan */}
        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/60 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShoppingCart size={100} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <ShoppingCart size={20} />
            </div>
            <h3 className="text-sm font-bold text-gray-600">Total Pesanan</h3>
          </div>
          <p className="text-4xl font-black text-gray-900">
            {todayStats.orderCount}{" "}
            <span className="text-lg text-gray-500 font-medium">Transaksi</span>
          </p>
        </div>

        {/* KPI 2: Omset */}
        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/60 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp size={100} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-sm font-bold text-gray-600">Omset Masuk</h3>
          </div>
          <p className="text-3xl font-black text-gray-900">
            Rp {todayStats.omset.toLocaleString("id-ID")}
          </p>
        </div>

        {/* KPI 3: Pengeluaran */}
        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/60 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingDown size={100} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <TrendingDown size={20} />
            </div>
            <h3 className="text-sm font-bold text-gray-600">Pengeluaran</h3>
          </div>
          <p className="text-3xl font-black text-gray-900">
            Rp {todayStats.expense.toLocaleString("id-ID")}
          </p>
        </div>

        {/* KPI 4: Laba Bersih */}
        <div
          className={`backdrop-blur-xl p-6 rounded-3xl shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform ${todayStats.net >= 0 ? "bg-[#1B4332]/90 border-green-800" : "bg-red-800/90 border-red-900"} text-white`}
        >
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign size={100} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-full bg-black/30 flex items-center justify-center ${todayStats.net >= 0 ? "text-green-300" : "text-red-300"}`}
            >
              <DollarSign size={20} />
            </div>
            <h3 className="text-sm font-bold text-green-100">Laba Hari Ini</h3>
          </div>
          <p className="text-3xl font-black drop-shadow-md">
            {todayStats.net < 0 ? "-" : ""} Rp{" "}
            {Math.abs(todayStats.net).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* --- AREA UTAMA (Tabel Pesanan & Akses Cepat) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* KIRI: Tabel Live Orders (Lebih Lebar) */}
        <div className="lg:col-span-2 bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 overflow-hidden">
          <div
            className={`border-b border-gray-200/60 p-5 flex items-center justify-between ${incomingOrders.length > 0 ? "bg-red-50/50" : "bg-gray-50/50"}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl shadow-inner ${incomingOrders.length > 0 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
              >
                <BellDot
                  size={22}
                  className={incomingOrders.length > 0 ? "animate-pulse" : ""}
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Pesanan Masuk (Live)
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
              <Activity size={14} className="text-blue-500" /> Hari Ini
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
            {incomingOrders.length === 0 ? (
              <div className="p-16 text-center text-gray-500">
                <Store size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-bold text-xl text-[#1B4332] mb-1">
                  Toko Sudah Siap!
                </p>
                <p className="text-sm">
                  Menunggu pesanan pertama masuk hari ini...
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                  <tr className="border-b border-gray-200 text-sm text-gray-600">
                    <th className="p-4 font-bold">Waktu</th>
                    <th className="p-4 font-bold">
                      Detail Pesanan (Menu x Jumlah)
                    </th>
                    <th className="p-4 font-bold text-right">Total Bayar</th>
                  </tr>
                </thead>
                <tbody>
                  {incomingOrders.map((order: any, index: number) => {
                    const isNewest = index === 0;
                    return (
                      <tr
                        key={order.id}
                        className={`border-b border-gray-100 transition-colors ${isNewest ? "bg-green-50/50" : "hover:bg-white/60"}`}
                      >
                        <td className="p-4 whitespace-nowrap text-gray-600 text-sm">
                          <span className="font-bold text-gray-900 bg-white shadow-sm border px-2 py-1 rounded-md">
                            {new Date(order.date).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </td>
                        <td className="p-4">
                          <p
                            className={`font-bold ${isNewest ? "text-[#1B4332]" : "text-gray-800"}`}
                          >
                            {order.desc.replace("Pesanan Pelanggan: ", "")}
                          </p>
                        </td>
                        <td className="p-4 text-right font-black text-lg text-[#1B4332] whitespace-nowrap">
                          Rp {order.amount.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* KANAN: Action Menu / Pintasan */}
        <div className="space-y-6">
          <div className="bg-black/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/10 text-white relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-20 text-white">
              <Store size={150} />
            </div>
            <h3 className="font-bold text-lg mb-2 relative z-10">
              Status Sistem POS
            </h3>
            <div className="flex items-center gap-3 relative z-10 mb-6">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
              </span>
              <span className="font-bold text-green-400">ONLINE & AKTIF</span>
            </div>

            <a
              href="/order"
              target="_blank"
              className="w-full relative z-10 bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Buka Layar Kasir / Order <ArrowRight size={20} />
            </a>
          </div>

          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/60">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity size={18} className="text-[#1B4332]" /> Pintasan Cepat
            </h3>
            <div className="space-y-3">
              <a
                href="/transactions"
                className="block p-4 rounded-xl bg-gray-50 border border-gray-100 font-bold text-gray-700 hover:border-[#1B4332] hover:text-[#1B4332] transition-colors group"
              >
                <div className="flex justify-between items-center">
                  Input Bahan Baku Baru
                  <ArrowRight
                    size={16}
                    className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                  />
                </div>
              </a>
              <a
                href="/finance"
                className="block p-4 rounded-xl bg-gray-50 border border-gray-100 font-bold text-gray-700 hover:border-[#1B4332] hover:text-[#1B4332] transition-colors group"
              >
                <div className="flex justify-between items-center">
                  Lihat Analisis Penjualan Mingguan
                  <ArrowRight
                    size={16}
                    className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
