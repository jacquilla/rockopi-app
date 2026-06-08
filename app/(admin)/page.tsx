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
import { supabase } from "../lib/supabase"; // Koneksi Supabase

export default function DashboardFrontend() {
  const [incomingOrders, setIncomingOrders] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [todayStats, setTodayStats] = useState({
    omset: 0,
    expense: 0,
    net: 0,
    orderCount: 0,
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fungsi penarik data ter-update dari database awan
  const fetchCloudDashboardData = async () => {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      // Ambil seluruh data transaksi khusus HARI INI dari server cloud
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .gte("created_at", startOfDay.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;

      let omset = 0;
      let expense = 0;
      let orderCount = 0;
      const liveOrdersList: any[] = [];

      data?.forEach((item: any) => {
        if (item.type === "IN") {
          omset += Number(item.amount);
          if (item.description.includes("Pesanan Pelanggan")) {
            orderCount++;
            liveOrdersList.push(item);
          }
        } else if (item.type === "OUT") {
          expense += Number(item.amount);
        }
      });

      setTodayStats({
        omset,
        expense,
        net: omset - expense,
        orderCount,
      });
      setIncomingOrders(liveOrdersList.slice(0, 10));
    } catch (e) {
      console.error("Gagal menarik data cloud dashboard:", e);
    }
  };

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    audioRef.current = new Audio("/sounds/notification.mp3");
    audioRef.current.load();

    // Jalankan penarikan data pertama kali halaman dibuka
    fetchCloudDashboardData();

    // =========================================================
    // SENSOR REAL-TIME DATABASES (SUPABASE STREAMING)
    // =========================================================
    const realtimeSubscription = supabase
      .channel("live-orders-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          // 1. Tarik ulang kalkulasi angka KPI terbaru
          fetchCloudDashboardData();

          // 2. Bunyikan speaker alarm jika baris data baru adalah pesanan kopi
          if (
            payload.new &&
            payload.new.description.includes("Pesanan Pelanggan")
          ) {
            if (audioRef.current) {
              audioRef.current
                .play()
                .catch((err) =>
                  console.log(
                    "Autoplay diblokir browser, butuh interaksi klik pertama:",
                    err,
                  ),
                );
            }
          }
        },
      )
      .subscribe();

    return () => {
      clearInterval(timer);
      supabase.removeChannel(realtimeSubscription);
    };
  }, []);

  if (!currentTime) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 drop-shadow-sm flex items-center gap-3">
            Dashboard Utama
            <span className="text-xs bg-black/60 backdrop-blur-sm text-green-300 font-bold px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Cloud Real-Time Connected
            </span>
          </h2>
          <p className="text-gray-700 font-medium mt-1">
            Pantau performa Rockopi hari ini secara sekilas melalui database
            cloud.
          </p>
        </div>

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

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/60 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5">
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

        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/60 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5">
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

        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/60 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5">
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

        <div
          className={`backdrop-blur-xl p-6 rounded-3xl shadow-xl relative overflow-hidden group text-white ${todayStats.net >= 0 ? "bg-gradient-to-br from-[#1B4332] to-[#0d261b]" : "bg-red-800"}`}
        >
          <div className="absolute -right-4 -top-4 opacity-10">
            <DollarSign size={100} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center">
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

      {/* LIVE FEED TABEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
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
                Pesanan Masuk (Live Cloud)
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
              <Activity size={14} className="text-blue-500" /> Real-time Feed
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
            {incomingOrders.length === 0 ? (
              <div className="p-16 text-center text-gray-500">
                <Store size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-bold text-xl text-[#1B4332] mb-1">
                  Toko Terhubung Cloud!
                </p>
                <p className="text-sm">
                  Belum ada pesanan masuk hari ini. Gunakan HP untuk mengetes
                  orderan.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                  <tr className="border-b border-gray-200 text-sm text-gray-600">
                    <th className="p-4 font-bold">Waktu</th>
                    <th className="p-4 font-bold">Detail Pesanan</th>
                    <th className="p-4 font-bold text-right">Total Bayar</th>
                  </tr>
                </thead>
                <tbody>
                  {incomingOrders.map((order: any, index: number) => (
                    <tr
                      key={order.id}
                      className={`border-b border-gray-100 transition-colors ${index === 0 ? "bg-green-50/50" : "hover:bg-white/60"}`}
                    >
                      <td className="p-4 whitespace-nowrap text-gray-600 text-sm">
                        <span className="font-bold text-gray-900 bg-white shadow-sm border px-2 py-1 rounded-md">
                          {new Date(order.created_at).toLocaleTimeString(
                            "id-ID",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-gray-800">
                          {order.description.replace("Pesanan Pelanggan: ", "")}
                        </p>
                      </td>
                      <td className="p-4 text-right font-black text-lg text-[#1B4332] whitespace-nowrap">
                        Rp {Number(order.amount).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* PINDAH KE HALAMAN LAIN */}
        <div className="space-y-6">
          <div className="bg-black/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/10 text-white relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-20 text-white">
              <Store size={150} />
            </div>
            <h3 className="font-bold text-lg mb-2">Status Sistem Cloud</h3>
            <div className="flex items-center gap-3 mb-6">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
              </span>
              <span className="font-bold text-green-400">
                SUPABASE LIVE STREAM
              </span>
            </div>

            <a
              href="/order"
              target="_blank"
              className="w-full bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-transform active:scale-95 shadow-md"
            >
              Buka Layar Kasir / Order <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
