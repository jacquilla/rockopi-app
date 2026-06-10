"use client";

import { useState, useEffect } from "react";
import {
  ChefHat,
  CreditCard,
  Trash2,
  Clock,
  Activity,
  Receipt,
  Users,
  CheckSquare,
  Loader2,
  BellDot,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import PoweredByFooter from "../../components/PoweredByFooter";

function getCustomerName(desc: string) {
  const m = desc.match(/A\/N \[(.*?)\]/);
  return m ? m[1] : "Pelanggan Umum";
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="hidden sm:flex items-center gap-3 bg-white/5 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 shadow-lg">
      <Clock className="text-green-400" size={20} />
      <div>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
          Waktu Live
        </p>
        <p className="text-white font-black text-lg tabular-nums">
          {time.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  const fetchOrders = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data } = await supabase
      .from("orders")
      .select("*")
      .gte("created_at", today.toISOString())
      .neq("status", "PAID") // Hanya memuat antrean aktif
      .order("created_at", { ascending: true });

    if (data) setOrders(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Sinkronisasi otomatis setiap 5 detik
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (order: any) => {
    setIsUpdating(order.id);
    // Mengubah PENDING menjadi READY (Siap diantar), dan READY menjadi PAID (Selesai/Lunas)
    const nextStatus = order.status === "PENDING" ? "READY" : "PAID";
    await supabase
      .from("orders")
      .update({ status: nextStatus })
      .eq("id", order.id);
    await fetchOrders();
    setIsUpdating(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Hapus pesanan ini dari antrean dapur?")) {
      await supabase.from("orders").delete().eq("id", id);
      fetchOrders();
    }
  };

  const activeOrders = orders.filter(
    (o) => o.type === "IN" && (o.status === "PENDING" || o.status === "READY"),
  );

  return (
    <div className="min-h-full flex flex-col font-sans bg-[#07110a]/90 backdrop-blur-md">
      <div className="flex-1 p-4 md:p-7 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Activity className="text-green-400" /> Live Kitchen
            </h2>
            <p className="text-white/40 text-xs mt-1">
              Pantau pesanan masuk secara real-time dari kasir
            </p>
          </div>
          <LiveClock />
        </div>

        {/* Quick Stats UI Figma */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col">
            <Users size={16} className="text-blue-400 mb-2" />
            <p className="text-white/40 text-[10px] font-bold uppercase">
              Antrean Baru
            </p>
            <p className="text-2xl font-black text-white">
              {activeOrders.filter((o) => o.status === "PENDING").length}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col">
            <CheckSquare size={16} className="text-green-400 mb-2" />
            <p className="text-white/40 text-[10px] font-bold uppercase">
              Siap Diantar
            </p>
            <p className="text-2xl font-black text-white">
              {activeOrders.filter((o) => o.status === "READY").length}
            </p>
          </div>
        </div>

        {/* Order Grid UI Figma */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-green-400" size={32} />
            <p className="text-green-400/60 text-xs font-bold uppercase tracking-widest">
              Sinkronisasi Dapur...
            </p>
          </div>
        ) : activeOrders.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
            <BellDot className="text-white/20 mb-3" size={40} />
            <p className="text-white/60 font-bold">Belum Ada Antrean</p>
            <p className="text-white/40 text-xs mt-1">
              Pesanan pelanggan akan otomatis muncul di sini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeOrders.map((order) => {
              const isPending = order.status === "PENDING";
              return (
                <div
                  key={order.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden group flex flex-col gap-4"
                >
                  {/* Decorative blob */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 blur-3xl rounded-full" />

                  <div className="flex justify-between items-start z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <Users size={14} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
                          Pemesan
                        </p>
                        <p className="text-sm font-black text-white">
                          {getCustomerName(order.description)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="text-white/20 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="bg-black/20 rounded-xl p-3 border border-white/5 z-10">
                    <p className="text-[10px] text-white/40 font-bold uppercase mb-1 flex items-center gap-1">
                      <Receipt size={10} /> Detail Pesanan
                    </p>
                    <p className="text-white font-bold text-sm leading-snug">
                      {order.description.split(" - ")[1] || order.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-end z-10">
                    <div>
                      {!isPending && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/15 border border-green-400/20 rounded-lg text-green-300 text-[10px] font-bold mb-1">
                          ✓ Siap Diantar
                        </span>
                      )}
                      <p className="text-white/40 text-[10px] font-bold uppercase flex items-center gap-1">
                        <Clock size={10} /> {formatTime(order.created_at)}
                      </p>
                    </div>
                    <span className="text-white/60 font-black text-base">
                      Rp {order.amount.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAction(order)}
                    disabled={isUpdating === order.id}
                    className={`z-10 w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95 border disabled:opacity-50 ${
                      isPending
                        ? "bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/30 text-blue-300"
                        : "bg-green-500 hover:bg-green-400 border-green-400 text-black"
                    }`}
                  >
                    {isUpdating === order.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : isPending ? (
                      <>
                        <ChefHat size={15} /> Selesai Dibuat
                      </>
                    ) : (
                      <>
                        <CreditCard size={15} /> Tandai Lunas
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-auto pt-4">
          <PoweredByFooter />
        </div>
      </div>
    </div>
  );
}
