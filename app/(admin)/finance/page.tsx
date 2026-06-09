"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase"; // 3 titik karena berada di dalam subfolder finance
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PlusCircle,
  Trash2,
  Loader2,
  Calendar,
  FileText,
} from "lucide-react";
import PoweredByFooter from "../../../components/PoweredByFooter";

export const dynamic = "force-dynamic";

export default function FinancePage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({ omset: 0, expense: 0, net: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Form State untuk Input Pengeluaran Manual
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchFinanceData = async () => {
    setIsLoading(true);
    try {
      // Ambil seluruh data transaksi orders hari ini
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .gte("created_at", startOfDay.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;

      // LOGIKA KUNCI:
      // 1. Jika Pemasukan (IN), WAJIB yang berstatus 'PAID' (Sudah Bayar)
      // 2. Jika Pengeluaran (OUT), langsung dimasukkan tanpa syarat status
      const validTransactions = (data || []).filter((item: any) => {
        if (item.type === "IN" && item.status !== "PAID") return false;
        return true;
      });

      setTransactions(validTransactions);

      // Hitung kalkulasi keuangan harian
      let totalOmset = 0;
      let totalExpense = 0;

      validTransactions.forEach((item: any) => {
        if (item.type === "IN") {
          totalOmset += Number(item.amount);
        } else if (item.type === "OUT") {
          totalExpense += Number(item.amount);
        }
      });

      setStats({
        omset: totalOmset,
        expense: totalExpense,
        net: totalOmset - totalExpense,
      });
    } catch (err: any) {
      console.error("Gagal memuat pembukuan:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();

    // Sinkronisasi Real-time Pembukuan saat kasir menekan tombol lunas
    const realtimeSubscription = supabase
      .channel("finance-live-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          fetchFinanceData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(realtimeSubscription);
    };
  }, []);

  // Tambah Pengeluaran Toko Manual (Beli susu, biji kopi, cup, dll)
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;
    setIsSaving(true);

    try {
      const { error } = await supabase.from("orders").insert([
        {
          description: `[PENGELUARAN] - ${description}`,
          type: "OUT",
          amount: Number(amount),
          status: "PAID", // Pengeluaran langsung dianggap lunas terbayar
        },
      ]);

      if (error) throw error;

      alert("Catatan pengeluaran berhasil disimpan!");
      setDescription("");
      setAmount("");
      fetchFinanceData();
    } catch (err: any) {
      alert(`Gagal menyimpan: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (window.confirm("Hapus catatan pembukuan ini?")) {
      await supabase.from("orders").delete().eq("id", id);
      fetchFinanceData();
    }
  };

  return (
    <div className="min-h-screen bg-[url('/bg-rockopi.avif')] bg-cover bg-fixed bg-center flex flex-col text-white font-sans">
      <div className="flex-1 bg-black/50 backdrop-blur-sm p-4 md:p-8 pt-6 flex flex-col">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col space-y-8 pb-10">
          {/* HEADER SERAGAM DENGAN DASHBOARD */}
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
            <div>
              <h2 className="text-3xl font-black drop-shadow-lg flex items-center gap-3 text-white">
                Pembukuan Keuangan Rockopi
              </h2>
              <p className="text-gray-200 font-medium mt-1 drop-shadow-md">
                Laporan finansial otomatis dari transaksi pesanan lunas harian.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-2xl border border-white/25 flex items-center gap-3">
              <Calendar className="text-green-300" size={20} />
              <span className="font-bold text-sm tracking-wide">Hari Ini</span>
            </div>
          </header>

          {/* KARTU STATISTIK GLASSMORPHISM SERAGAM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/40 text-gray-900">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <TrendingUp size={18} />
                </div>
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
                  Total Omset (PAID)
                </h3>
              </div>
              <p className="text-3xl font-black text-[#1B4332]">
                Rp {stats.omset.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/40 text-gray-900">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <TrendingDown size={18} />
                </div>
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
                  Total Pengeluaran
                </h3>
              </div>
              <p className="text-3xl font-black text-red-600">
                Rp {stats.expense.toLocaleString("id-ID")}
              </p>
            </div>

            <div
              className={`p-6 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl text-white ${stats.net >= 0 ? "bg-gradient-to-br from-[#1B4332]/95 to-[#0d261b]/95" : "bg-red-900/95"}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center text-white">
                  <DollarSign size={18} />
                </div>
                <h3 className="text-xs font-bold text-green-200 uppercase tracking-wider">
                  Laba Bersih Hari Ini
                </h3>
              </div>
              <p className="text-3xl font-black drop-shadow-md">
                {stats.net < 0 ? "-" : ""} Rp{" "}
                {Math.abs(stats.net).toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* TABEL MUTASI KEUANGAN LIVE */}
            <div className="lg:col-span-2 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/40 text-gray-900 flex flex-col">
              <div className="border-b border-gray-100 p-5 flex items-center justify-between bg-white/50">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <FileText size={20} className="text-[#1B4332]" /> Arus Kas
                  Masuk & Keluar
                </h3>
                <span className="text-xs font-bold text-gray-500 bg-white border px-3 py-1 rounded-full shadow-sm">
                  {transactions.length} Entri Tercatat
                </span>
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center p-20 gap-2">
                    <Loader2
                      className="animate-spin text-[#1B4332]"
                      size={28}
                    />
                    <p className="text-xs font-bold text-gray-500">
                      Membuka lembar buku kas...
                    </p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="p-16 text-center text-gray-400 font-medium">
                    Belum ada mutasi keuangan tunai hari ini.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/80 border-b border-gray-100 sticky top-0 backdrop-blur-md text-xs font-bold text-gray-500">
                      <tr>
                        <th className="p-4 w-24">Waktu</th>
                        <th className="p-4">Keterangan</th>
                        <th className="p-4 text-right w-36">Jumlah</th>
                        <th className="p-4 text-center w-16">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {transactions.map((tx) => {
                        const isIncome = tx.type === "IN";
                        return (
                          <tr
                            key={tx.id}
                            className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors bg-transparent"
                          >
                            <td className="p-4 text-gray-500 font-bold">
                              {new Date(tx.created_at).toLocaleTimeString(
                                "id-ID",
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </td>
                            <td className="p-4">
                              <p className="font-bold text-gray-800 leading-tight">
                                {tx.description}
                              </p>
                            </td>
                            <td
                              className={`p-4 text-right font-black text-base whitespace-nowrap ${isIncome ? "text-[#1B4332]" : "text-red-600"}`}
                            >
                              {isIncome ? "+" : "-"} Rp{" "}
                              {Number(tx.amount).toLocaleString("id-ID")}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleDeleteTransaction(tx.id)}
                                className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* INPUT PENGELUARAN TOKO MANUAL */}
            <div className="bg-black/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20 text-white">
              <h3 className="font-black text-lg mb-1 tracking-wide">
                Input Pengeluaran
              </h3>
              <p className="text-xs text-gray-300 mb-5">
                Catat pengeluaran mendadak toko (operasional, susu, es, dll).
              </p>

              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">
                    Keterangan Biaya
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Contoh: Beli Susu Diamond 2 Karton"
                    className="w-full bg-white/10 text-white font-bold px-4 py-3 rounded-xl border border-white/10 focus:border-green-400 outline-none transition-all text-sm"
                    maxLength={50}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">
                    Jumlah Uang (Rp)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Contoh: 320000"
                    className="w-full bg-white/10 text-white font-bold px-4 py-3 rounded-xl border border-white/10 focus:border-green-400 outline-none transition-all text-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-white hover:bg-gray-100 text-[#1B4332] font-black py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 text-sm mt-2"
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <PlusCircle size={18} />
                  )}
                  Simpan Pengeluaran
                </button>
              </form>
            </div>
          </div>

          <div className="pt-4">
            <PoweredByFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
