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
  Trash2,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import PoweredByFooter from "../../components/PoweredByFooter";

export const dynamic = "force-dynamic";

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

  const fetchCloudDashboardData = async () => {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

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
          orderCount++;
          liveOrdersList.push(item);
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
      setIncomingOrders(liveOrdersList.slice(0, 15));
    } catch (e) {
      console.error("Gagal menarik data cloud dashboard:", e);
    }
  };

  const handleDeleteOrder = async (id: number, description: string) => {
    const konfirmasi = window.confirm(
      `Apakah Anda yakin ingin menghapus pesanan salah ini?\n\n"${description}"`,
    );
    if (!konfirmasi) return;

    try {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
      alert("Pesanan salah berhasil dihapus dari database!");
      fetchCloudDashboardData();
    } catch (err: any) {
      alert(`Gagal menghapus data: ${err.message}`);
    }
  };

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    audioRef.current = new Audio("/sounds/notification.mp3");
    audioRef.current.load();

    fetchCloudDashboardData();

    const realtimeSubscription = supabase
      .channel("live-orders-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          fetchCloudDashboardData();
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
    // MEMASANG BACKGROUND ROCKOPI DI MENU ADMIN
    <div className="min-h-screen bg-[url('/bg-rockopi.avif')] bg-cover bg-fixed bg-center flex flex-col">
      <div className="flex-1 bg-black/40 p-4 md:p-8 pt-6 flex flex-col">
        <div className="space-y-8 max-w-7xl mx-auto w-full flex-1 flex flex-col pb-10">
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              {/* WARNA TEKS DIBUAT PUTIH AGAR KONTRAST DENGAN BACKGROUND */}
              <h2 className="text-3xl font-bold text-white drop-shadow-md flex items-center gap-3">
                Dashboard Utama
                <span className="text-xs bg-black/60 backdrop-blur-sm text-green-300 font-bold px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Cloud Connected
                </span>
              </h2>
              <p className="text-gray-200 font-medium mt-1 drop-shadow-sm">
                Pantau performa Rockopi hari ini secara sekilas.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-white/40 flex items-center gap-4">
              <Clock className="text-[#1B4332]" size={24} />
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
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

          {/* STATS CARDS: Diberi efek kaca (Glassmorphism) agar sangat estetik */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/40 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <ShoppingCart size={20} />
                </div>
                <h3 className="text-sm font-bold text-gray-600">
                  Total Pesanan
                </h3>
              </div>
              <p className="text-4xl font-black text-gray-900">
                {todayStats.orderCount}{" "}
                <span className="text-lg text-gray-500 font-medium">Order</span>
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/40 relative overflow-hidden">
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

            <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/40 relative overflow-hidden">
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
              className={`backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 relative overflow-hidden text-white ${todayStats.net >= 0 ? "bg-gradient-to-br from-[#1B4332]/90 to-[#0d261b]/90" : "bg-red-800/90"}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center">
                  <DollarSign size={20} />
                </div>
                <h3 className="text-sm font-bold text-green-100">
                  Laba Hari Ini
                </h3>
              </div>
              <p className="text-3xl font-black drop-shadow-md">
                {todayStats.net < 0 ? "-" : ""} Rp{" "}
                {Math.abs(todayStats.net).toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* FEED TABEL LIVE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/40">
              <div className="border-b border-gray-100 p-5 flex items-center justify-between bg-white/50">
                <div className="flex items-center gap-3">
                  <BellDot size={22} className="text-red-500 animate-pulse" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Pesanan Masuk Live
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                  <Activity size={14} className="text-blue-500" /> Real-time
                  Feed
                </div>
              </div>

              <div className="max-h-[550px] overflow-y-auto">
                {incomingOrders.length === 0 ? (
                  <div className="p-16 text-center text-gray-500">
                    <Store size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-bold text-xl text-[#1B4332] mb-1">
                      Belum Ada Pesanan
                    </p>
                    <p className="text-sm">
                      Gunakan HP untuk mengetes sistem orderan baru.
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse min-w-[580px]">
                    <thead className="bg-gray-50/80 sticky top-0 z-10 border-b border-gray-100 shadow-sm backdrop-blur-md">
                      <tr className="text-sm text-gray-600">
                        <th className="p-4 font-bold">Waktu</th>
                        <th className="p-4 font-bold">Detail Pesanan</th>
                        <th className="p-4 font-bold text-right">
                          Total Bayar
                        </th>
                        <th className="p-4 font-bold text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomingOrders.map((order: any, index: number) => (
                        <tr
                          key={order.id}
                          className={`border-b border-gray-50 transition-colors ${index === 0 ? "bg-green-50/60" : "hover:bg-white bg-transparent"}`}
                        >
                          <td className="p-4 whitespace-nowrap text-gray-600 text-sm">
                            <span className="font-bold text-gray-900 bg-white border border-gray-100 px-2.5 py-1.5 rounded-md shadow-sm">
                              {new Date(order.created_at).toLocaleTimeString(
                                "id-ID",
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-gray-800 leading-tight">
                              {order.description}
                            </p>
                          </td>
                          <td className="p-4 text-right font-black text-lg text-[#1B4332] whitespace-nowrap">
                            Rp {Number(order.amount).toLocaleString("id-ID")}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() =>
                                handleDeleteOrder(order.id, order.description)
                              }
                              className="p-2.5 text-red-600 hover:bg-red-50 hover:scale-105 rounded-full transition-all inline-flex items-center justify-center shadow-sm border border-gray-100 bg-white"
                              title="Hapus Pesanan Salah"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="space-y-6 lg:sticky lg:top-4">
              <div className="bg-black/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl text-white border border-white/20 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 opacity-10 text-white">
                  <Store size={140} />
                </div>
                <h3 className="font-bold text-lg mb-2 z-10 relative">
                  Status Sistem Cloud
                </h3>
                <div className="flex items-center gap-3 mb-6 z-10 relative">
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                  </span>
                  <span className="font-bold text-green-400 drop-shadow-sm">
                    SUPABASE LIVE STREAM
                  </span>
                </div>
                <a
                  href="/order"
                  target="_blank"
                  className="w-full bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2.5 shadow-md hover:bg-gray-100 transition-colors active:scale-95 z-10 relative"
                >
                  Buka Layar Kasir / Order <ArrowRight size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
        <PoweredByFooter />
      </div>
    </div>
  );
}
