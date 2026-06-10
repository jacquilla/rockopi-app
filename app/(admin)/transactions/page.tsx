"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useTheme } from "@/lib/theme-context";
import {
  ReceiptText,
  Search,
  CheckCircle2,
  Clock,
  Loader2,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import PoweredByFooter from "../../../components/PoweredByFooter";

export const dynamic = "force-dynamic";

export default function TransactionsPage() {
  const { theme } = useTheme();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "PAID" | "PENDING" | "READY"
  >("ALL");
  const [filterType, setFilterType] = useState<"ALL" | "IN" | "OUT">("ALL");

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setOrders(data);
    } catch (err) {
      console.error("Gagal menarik riwayat transaksi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // REAL-TIME IN-MEMORY SEARCH & FILTERS FROM FIGMA SPEC
  const filtered = orders.filter((tx) => {
    const matchSearch = tx.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "ALL" || tx.status === filterStatus;
    const matchType = filterType === "ALL" || tx.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const totalIn = filtered
    .filter((t) => t.type === "IN" && t.status === "PAID")
    .reduce((s, t) => s + Number(t.amount), 0);
  const totalOut = filtered
    .filter((t) => t.type === "OUT")
    .reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div className="min-h-full flex flex-col font-sans bg-[#07110a]/90 backdrop-blur-md">
      <div className="flex-1 p-4 md:p-7 flex flex-col gap-6">
        {/* HEADER & SEARCH BAR COMPONENT */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <ReceiptText className="text-green-400" size={24} /> Log Aktivitas
              Jurnal
            </h2>
            <p className="text-white/40 text-xs mt-1">
              Audit menyeluruh seluruh aliran keuangan dan dapur produksi
              Rockopi
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="text"
              placeholder="Cari nama pemesan / item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/4 text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/8 focus:border-green-400/50 outline-none text-xs transition-all placeholder:text-white/20"
            />
          </div>
        </div>

        {/* DOUBLE-FILTER ROW CONTROLS DARI KODE FIGMA */}
        <div className="flex flex-wrap gap-4 items-center bg-white/2 p-3 rounded-2xl border border-white/5">
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">
              Jenis Aliran
            </span>
            <div className="flex gap-1 bg-black/30 p-1 rounded-xl border border-white/5">
              {/* Filter Jenis */}
              {(["ALL", "IN", "OUT"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${filterType === t ? "text-white" : "text-white/40"}`}
                  style={{
                    backgroundColor:
                      filterType === t
                        ? theme.primary || "#1B4332"
                        : "transparent",
                  }}
                >
                  {t === "ALL"
                    ? "Semua"
                    : t === "IN"
                      ? "Pemasukan"
                      : "Pengeluaran"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">
              Status Validasi
            </span>
            <div className="flex gap-1 bg-black/30 p-1 rounded-xl border border-white/5">
              {/* Filter Status */}
              {(["ALL", "PAID", "PENDING", "READY"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${filterStatus === s ? "text-white" : "text-white/40"}`}
                  style={{
                    backgroundColor:
                      filterStatus === s
                        ? theme.primary || "#1B4332"
                        : "transparent",
                  }}
                >
                  {s === "ALL"
                    ? "Semua"
                    : s === "PAID"
                      ? "Lunas"
                      : s === "PENDING"
                        ? "Antrean"
                        : "Dapur Siap"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MINI SUMMARY METRICS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/4 border border-white/8 rounded-xl p-4 flex items-center gap-3">
            <ArrowUpCircle className="text-green-400 flex-shrink-0" size={20} />
            <div>
              <p className="text-white/30 text-[9px] font-bold uppercase">
                Filter Pemasukan Lunas
              </p>
              <p className="text-base font-black text-white">
                Rp {totalIn.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
          <div className="bg-white/4 border border-white/8 rounded-xl p-4 flex items-center gap-3">
            <ArrowDownCircle className="text-red-400 flex-shrink-0" size={20} />
            <div>
              <p className="text-white/30 text-[9px] font-bold uppercase">
                Filter Total Pengeluaran
              </p>
              <p className="text-base font-black text-white">
                Rp {totalOut.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        {/* LOG DATA TABLE RESEP FIGMA */}
        <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden flex flex-col flex-1">
          <div className="max-w-full overflow-x-auto overflow-y-auto max-h-[500px] scrollbar-hide">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center py-24 gap-3">
                <Loader2 className="animate-spin text-green-400" size={28} />
                <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                  Audit Database...
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-16 text-center text-white/20 font-bold uppercase tracking-widest text-xs">
                Jurnal kosong / tidak ditemukan data
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-black/40 border-b border-white/5 text-[10px] font-black text-white/40 uppercase tracking-widest sticky top-0 backdrop-blur-xl z-10">
                  <tr>
                    <th className="px-5 py-4 w-32">Tanggal & Waktu</th>
                    <th className="px-5 py-4">Deskripsi Aktivitas</th>
                    <th className="px-5 py-4 text-center w-28">Status</th>
                    <th className="px-5 py-4 text-right w-36">Nominal Kas</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-white/80">
                  {filtered.map((tx) => {
                    const isIn = tx.type === "IN";
                    return (
                      <tr
                        key={tx.id}
                        className="border-b border-white/5 hover:bg-white/10 transition-colors"
                      >
                        <td className="px-5 py-4 font-mono text-white/40 whitespace-nowrap">
                          {new Date(tx.created_at).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                          })}
                          {" - "}
                          {new Date(tx.created_at).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-black text-white text-sm leading-tight">
                            {tx.description}
                          </p>
                          <span
                            className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md mt-1.5 inline-block border ${
                              isIn
                                ? "bg-blue-400/10 text-blue-400 border-blue-400/20"
                                : "bg-red-400/10 text-red-400 border-red-400/20"
                            }`}
                          >
                            {isIn ? "Pemasukan Kasir" : "Biaya Toko"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center whitespace-nowrap">
                          {tx.status === "PAID" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-400/10 text-green-400 text-[10px] font-black rounded-lg border border-green-400/20">
                              <CheckCircle2 size={11} /> LUNAS
                            </span>
                          ) : tx.status === "READY" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-400/10 text-blue-400 text-[10px] font-black rounded-lg border border-blue-400/20">
                              SIAP ANTAR
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-400/10 text-yellow-400 text-[10px] font-black rounded-lg border border-yellow-400/20">
                              <Clock size={11} /> ANTRIAN
                            </span>
                          )}
                        </td>
                        <td
                          className={`px-5 py-4 text-right font-black text-sm whitespace-nowrap ${isIn ? "text-green-400" : "text-red-400"}`}
                        >
                          {isIn ? "+" : "−"} Rp{" "}
                          {Number(tx.amount).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="mt-auto pt-4">
          <PoweredByFooter />
        </div>
      </div>
    </div>
  );
}
