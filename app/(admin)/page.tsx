"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/lib/types";
import { ChefHat, Coffee, CreditCard, Trash2, Clock, BellDot, Activity, Receipt, Users, SquareCheck as CheckSquare, Loader as Loader2 } from "lucide-react";
import PoweredByFooter from "@/components/PoweredByFooter";

export const dynamic = "force-dynamic";

function getCustomerName(desc: string) {
  const match = desc.match(/A\/N \[(.*?)\]/);
  return match ? match[1] : "Pelanggan Umum";
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isRecapOpen, setIsRecapOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevOrderCount = useRef(0);

  const fetchOrders = async () => {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .gte("created_at", startOfDay.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;
      const newOrders = (data || []) as Order[];

      // Play sound on new orders
      if (newOrders.length > prevOrderCount.current && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      prevOrderCount.current = newOrders.length;
      setOrders(newOrders);
    } catch (e) {
      console.error("Gagal menarik data:", e);
    }
  };

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    audioRef.current = new Audio("/sounds/notification.mp3");
    audioRef.current.load();

    fetchOrders();

    const realtimeSubscription = supabase
      .channel("live-orders-channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      clearInterval(timer);
      supabase.removeChannel(realtimeSubscription);
    };
  }, []);

  const handleAction = async (order: Order) => {
    if (isUpdating === order.id) return;
    setIsUpdating(order.id);

    try {
      if (order.production_status === "PENDING") {
        const { error } = await supabase
          .from("orders")
          .update({ production_status: "DONE" })
          .eq("id", order.id);
        if (error) throw error;
      } else if (order.status === "PENDING") {
        const { error } = await supabase
          .from("orders")
          .update({ status: "PAID" })
          .eq("id", order.id);
        if (error) throw error;
      }
      await fetchOrders();
    } catch (err) {
      alert("Gagal memperbarui status");
      console.error(err);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus pesanan ini?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      alert("Gagal menghapus pesanan");
      return;
    }
    fetchOrders();
  };

  const unpaidReadyOrders = orders.filter(
    (o) => o.status === "PENDING" && o.production_status === "DONE"
  );

  const groupedBills = unpaidReadyOrders.reduce<Record<string, Order[]>>((acc, order) => {
    const name = getCustomerName(order.description);
    if (!acc[name]) acc[name] = [];
    acc[name].push(order);
    return acc;
  }, {});

  const handlePayGroup = async (customerName: string) => {
    const customerOrders = groupedBills[customerName];
    if (!window.confirm(`Lunas untuk tagihan ${customerName}?`)) return;
    const ids = customerOrders.map((o) => o.id);
    const { error } = await supabase.from("orders").update({ status: "PAID" }).in("id", ids);
    if (error) {
      alert("Gagal memperbarui status");
      return;
    }
    setSelectedCustomer(null);
    await fetchOrders();
  };

  if (!currentTime) return null;

  const activeOrders = orders.filter(
    (o) => o.status === "PENDING" || o.production_status === "PENDING"
  );

  return (
    <div className="min-h-screen bg-[url('/bg-rockopi.avif')] bg-cover bg-fixed bg-center flex flex-col text-white font-sans">
      {/* MODAL REKAP */}
      {isRecapOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white/10 backdrop-blur-2xl w-full max-w-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/40">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Receipt className="text-yellow-400" /> Rekap Tagihan
              </h3>
              <button
                onClick={() => { setIsRecapOpen(false); setSelectedCustomer(null); }}
                className="text-white/60 hover:text-white bg-white/10 p-2 rounded-full transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {Object.keys(groupedBills).length === 0 ? (
                <div className="text-center text-white/50 py-10">
                  Tidak ada tagihan yang menunggu pembayaran.
                </div>
              ) : (
                <div className="grid gap-4">
                  {Object.keys(groupedBills).map((name) => {
                    const totalTagihan = groupedBills[name].reduce((sum, o) => sum + o.amount, 0);
                    const isExpanded = selectedCustomer === name;

                    return (
                      <div key={name} className="bg-black/40 rounded-2xl border border-white/10 overflow-hidden">
                        <div
                          className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/5"
                          onClick={() => setSelectedCustomer(isExpanded ? null : name)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-500/20 text-yellow-400 rounded-full">
                              <Users size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-lg">{name}</p>
                              <p className="text-xs text-gray-400">{groupedBills[name].length} Item</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-xl text-yellow-400">
                              Rp {totalTagihan.toLocaleString("id-ID")}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1">Klik untuk lihat / bayar</p>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="bg-black/60 p-4 border-t border-white/10 space-y-3">
                            {groupedBills[name].map((item) => (
                              <div key={item.id} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                <span className="text-gray-300 w-2/3 truncate pr-2">
                                  {item.description.replace(`A/N [${name}] - `, "")}
                                </span>
                                <div className="flex items-center gap-3">
                                  <span className="font-bold">Rp {item.amount.toLocaleString("id-ID")}</span>
                                  <button
                                    onClick={() => handleAction(item)}
                                    className="p-1.5 bg-green-500 hover:bg-green-600 rounded-md text-white transition-all"
                                    title="Bayar Item Ini"
                                  >
                                    {isUpdating === item.id ? <Loader2 className="animate-spin" size={16} /> : <CheckSquare size={16} />}
                                  </button>
                                </div>
                              </div>
                            ))}
                            <button
                              onClick={() => handlePayGroup(name)}
                              className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-black py-3 rounded-xl transition-all shadow-lg active:scale-95"
                            >
                              LUNAS SEMUA (Rp {totalTagihan.toLocaleString("id-ID")})
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 bg-black/50 backdrop-blur-sm p-4 md:p-8 pt-6 flex flex-col">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col space-y-8">
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black drop-shadow-lg">Rockopi Command Center</h2>
              <p className="text-gray-200 font-medium mt-1 drop-shadow-md">
                Sistem operasional terpadu. Order First, Pay Later.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsRecapOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black backdrop-blur-xl px-5 py-3.5 rounded-2xl shadow-2xl font-black flex items-center gap-2 transition-all active:scale-95 border border-yellow-400"
              >
                <Receipt size={20} /> Rekap Tagihan
                {unpaidReadyOrders.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1 animate-pulse">
                    {Object.keys(groupedBills).length} Meja
                  </span>
                )}
              </button>

              <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-2xl border border-white/20 hidden sm:flex items-center gap-4">
                <Clock className="text-green-300" size={24} />
                <div>
                  <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Waktu Live</p>
                  <p className="text-xl font-black leading-none mt-0.5 tracking-wider">
                    {currentTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex-1 flex flex-col">
            <div className="border-b border-white/10 p-5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-3">
                <BellDot size={22} className="text-green-400 animate-pulse" />
                <h3 className="text-lg font-bold">Antrean Berjalan</h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-4 py-2 rounded-full shadow-inner border border-white/10">
                <Activity size={14} className="text-green-300" /> {activeOrders.length} Pesanan
              </div>
            </div>

            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-y-auto">
              {activeOrders.length === 0 ? (
                <div className="col-span-full py-20 text-center text-white/50">
                  <Coffee size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="font-bold text-xl mb-1">Dapur Bersih!</p>
                  <p className="text-sm">Belum ada pesanan masuk.</p>
                </div>
              ) : (
                activeOrders.map((order) => {
                  const isPendingProduction = order.production_status === "PENDING";
                  const cardStyle = isPendingProduction
                    ? "bg-blue-900/40 border-blue-400/40 hover:border-blue-300"
                    : "bg-green-900/40 border-green-400/40 hover:border-green-300";

                  return (
                    <div
                      key={order.id}
                      className={`${cardStyle} backdrop-blur-md p-5 rounded-2xl border shadow-xl flex flex-col gap-4 relative overflow-hidden group transition-all hover:-translate-y-1`}
                    >
                      <div className="absolute -right-4 -top-4 opacity-[0.07] pointer-events-none">
                        {isPendingProduction ? <ChefHat size={120} /> : <CreditCard size={120} />}
                      </div>

                      <div className="z-10 flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[11px] font-bold px-2.5 py-1 bg-black/50 rounded-md border border-white/10 shadow-inner">
                            {formatTime(order.created_at)}
                          </span>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="text-white/30 hover:text-red-400 transition-colors p-1 bg-black/20 rounded-md"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="font-bold text-lg leading-snug drop-shadow-md text-white/95">
                          {order.description}
                        </p>

                        {!isPendingProduction && (
                          <div className="mt-2 inline-block px-2.5 py-1 bg-green-500/20 border border-green-400/30 rounded text-[10px] font-bold text-green-300">
                            Siap Diantar / Menunggu Bayar
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleAction(order)}
                        disabled={isUpdating === order.id}
                        className={`z-10 w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg border disabled:opacity-60 ${
                          isPendingProduction
                            ? "bg-blue-500 hover:bg-blue-400 border-blue-300/50 text-white"
                            : "bg-green-500 hover:bg-green-400 border-green-300/50 text-white"
                        }`}
                      >
                        {isUpdating === order.id ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : isPendingProduction ? (
                          <>
                            <ChefHat size={18} /> Selesai Dibuat
                          </>
                        ) : (
                          <>
                            <CreditCard size={18} /> Tandai Lunas
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-2">
            <PoweredByFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
