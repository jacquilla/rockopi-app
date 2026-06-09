"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/lib/types";
import { ReceiptText, Search, ListFilter as Filter, CircleCheck as CheckCircle, Clock, Loader as Loader2 } from "lucide-react";
import PoweredByFooter from "@/components/PoweredByFooter";

export const dynamic = "force-dynamic";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PAID" | "PENDING">("ALL");

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions((data || []) as Order[]);
    } catch (err) {
      console.error("Gagal memuat transaksi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filtered = transactions.filter((tx) => {
    const matchSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "ALL" ? true : tx.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[url('/bg-rockopi.avif')] bg-cover bg-fixed bg-center flex flex-col text-white font-sans">
      <div className="flex-1 bg-black/50 backdrop-blur-sm p-4 md:p-8 pt-6 flex flex-col">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col space-y-6 pb-10">
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
            <div>
              <h2 className="text-3xl font-black drop-shadow-lg text-white">Riwayat Transaksi</h2>
              <p className="text-gray-200 font-medium mt-1 drop-shadow-md">
                Pusat data seluruh riwayat pesanan dan mutasi Rockopi.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-2xl border border-white/25 flex items-center gap-3">
              <ReceiptText className="text-blue-300" size={20} />
              <span className="font-bold text-sm tracking-wide">{filtered.length} Transaksi</span>
            </div>
          </header>

          <div className="bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20 flex flex-col sm:flex-row items-center gap-4 shadow-xl">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="text"
                placeholder="Cari nama pelanggan atau menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 text-white font-medium pl-11 pr-4 py-3 rounded-2xl border border-white/10 focus:border-blue-400 outline-none placeholder-gray-400"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <Filter className="text-gray-300 ml-2" size={18} />
              {(["ALL", "PAID", "PENDING"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                    filterStatus === status
                      ? status === "ALL"
                        ? "bg-blue-500 text-white shadow-lg"
                        : status === "PAID"
                          ? "bg-green-500 text-white shadow-lg"
                          : "bg-yellow-500 text-black shadow-lg"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {status === "ALL" ? "Semua" : status === "PAID" ? "Lunas" : "Belum Bayar"}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden flex-1 text-gray-900 flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-[#1B4332] text-white sticky top-0 z-10">
                  <tr className="text-sm">
                    <th className="p-4 w-40 font-bold tracking-wide">Tanggal & Waktu</th>
                    <th className="p-4 font-bold tracking-wide">Detail Transaksi</th>
                    <th className="p-4 w-32 font-bold tracking-wide text-center">Status</th>
                    <th className="p-4 w-36 font-bold tracking-wide text-right">Total (Rp)</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="p-20 text-center">
                        <Loader2 className="animate-spin mx-auto text-[#1B4332]" size={32} />
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-16 text-center text-gray-500 font-medium">
                        Tidak ada transaksi yang sesuai.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((tx) => {
                      const isIncome = tx.type === "IN";
                      const isPaid = tx.status === "PAID";
                      return (
                        <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                          <td className="p-4 text-gray-500 font-bold whitespace-nowrap">
                            {new Date(tx.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })} <br />
                            <span className="text-xs text-gray-400 font-normal">
                              {new Date(tx.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-gray-900">{tx.description}</p>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full mt-1 inline-block ${
                              isIncome ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                            }`}>
                              {isIncome ? "Pemasukan" : "Pengeluaran"}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            {isPaid ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
                                <CheckCircle size={14} /> LUNAS
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full border border-yellow-200">
                                <Clock size={14} /> PENDING
                              </span>
                            )}
                          </td>
                          <td className={`p-4 text-right font-black text-base whitespace-nowrap ${isIncome ? "text-[#1B4332]" : "text-red-600"}`}>
                            {isIncome ? "+" : "-"} Rp {tx.amount.toLocaleString("id-ID")}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <PoweredByFooter />
        </div>
      </div>
    </div>
  );
}
