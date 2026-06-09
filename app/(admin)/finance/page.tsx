"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PlusCircle,
  Trash2,
  Loader2,
  Calendar,
  FileText,
  Award,
  AlertCircle,
} from "lucide-react";
import PoweredByFooter from "../../../components/PoweredByFooter";

export const dynamic = "force-dynamic";

export default function FinancePage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({ omset: 0, expense: 0, net: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Filter Laporan & Kalender
  const [filterType, setFilterType] = useState<"DAILY" | "WEEKLY" | "MONTHLY">(
    "DAILY",
  );

  // PERBAIKAN LOGIKA: Menggunakan penanggalan lokal Indonesia agar Pemasukan Harian langsung sinkron
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  // State Analisis Produk
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [leastSellers, setLeastSellers] = useState<any[]>([]);

  // Form State Pengeluaran Manual
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchFinanceData = async () => {
    setIsLoading(true);
    try {
      const [year, month, day] = selectedDate.split("-").map(Number);

      // Mengunci object tanggal murni berbasis waktu lokal zona Indonesia
      let start = new Date(year, month - 1, day, 0, 0, 0, 0);
      let end = new Date(year, month - 1, day, 23, 59, 59, 999);

      if (filterType === "DAILY") {
        // Rentang waktu harian lokal sudah pas
      } else if (filterType === "WEEKLY") {
        const dayOfWeek = start.getDay();
        const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Set ke hari Senin
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);

        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
      } else if (filterType === "MONTHLY") {
        start.setDate(1);
        start.setHours(0, 0, 0, 0);

        end = new Date(year, month, 0, 23, 59, 59, 999); // Akhir bulan murni
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;

      const validTransactions = (data || []).filter((item: any) => {
        if (item.type === "IN" && item.status !== "PAID") return false;
        return true;
      });

      setTransactions(validTransactions);

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

      const menuCounts: { [key: string]: number } = {};
      validTransactions.forEach((item: any) => {
        if (item.type === "IN") {
          const parts = item.description.split(" - ");
          if (parts.length > 1) {
            const orderContent = parts[1];
            const menuTokens = orderContent.split(" & ");
            menuTokens.forEach((token: string) => {
              const match = token.match(/(\d+)x\s+(.+)/);
              if (match) {
                const qty = parseInt(match[1], 10);
                const menuName = match[2].trim();
                menuCounts[menuName] = (menuCounts[menuName] || 0) + qty;
              }
            });
          }
        }
      });

      const sortedMenuProducts = Object.keys(menuCounts)
        .map((name) => ({ name, qty: menuCounts[name] }))
        .sort((a, b) => b.qty - a.qty);

      setBestSellers(sortedMenuProducts.slice(0, 4));
      setLeastSellers([...sortedMenuProducts].reverse().slice(0, 4));
    } catch (err: any) {
      console.error("Gagal sinkronisasi data pembukuan:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, [filterType, selectedDate]);

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
          status: "PAID",
          created_at: new Date().toISOString(),
        },
      ]);
      if (error) throw error;
      setDescription("");
      setAmount("");
      await fetchFinanceData();
      alert("Catatan biaya operasional berhasil disimpan!");
    } catch (err: any) {
      alert(`Gagal menyimpan data: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (window.confirm("Hapus catatan transaksi ini dari pembukuan?")) {
      await supabase.from("orders").delete().eq("id", id);
      await fetchFinanceData();
    }
  };

  return (
    <div className="min-h-screen bg-[url('/bg-rockopi.avif')] bg-cover bg-fixed bg-center flex flex-col text-white font-sans">
      <div className="flex-1 bg-black/50 backdrop-blur-sm p-4 md:p-8 pt-6 flex flex-col">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col space-y-6 pb-10">
          {/* HEADER DENGAN LOGO.PNG KEMBALI AKTIF */}
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Logo Text Rockopi"
                className="h-7 md:h-10 object-contain drop-shadow-xl"
              />
              <h2 className="text-2xl md:text-3xl font-black drop-shadow-lg text-white border-l-2 border-white/20 pl-3">
                Pembukuan Finansial
              </h2>
            </div>
          </header>

          <div className="bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
            <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded-2xl border border-white/5 w-full md:w-auto overflow-x-auto">
              <button
                onClick={() => setFilterType("DAILY")}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${filterType === "DAILY" ? "bg-[#1B4332] text-white shadow-lg border border-white/10" : "text-gray-300"}`}
              >
                Harian
              </button>
              <button
                onClick={() => setFilterType("WEEKLY")}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${filterType === "WEEKLY" ? "bg-[#1B4332] text-white shadow-lg border border-white/10" : "text-gray-300"}`}
              >
                Mingguan
              </button>
              <button
                onClick={() => setFilterType("MONTHLY")}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${filterType === "MONTHLY" ? "bg-[#1B4332] text-white shadow-lg border border-white/10" : "text-gray-300"}`}
              >
                Bulanan
              </button>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto bg-black/20 px-4 py-2 rounded-2xl border border-white/10">
              <Calendar className="text-yellow-400" size={18} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-white font-black text-sm outline-none cursor-pointer filter invert"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/40 text-gray-900">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                Total Pendapatan
              </h3>
              <p className="text-3xl font-black text-[#1B4332]">
                Rp {stats.omset.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/40 text-gray-900">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                Total Pengeluaran
              </h3>
              <p className="text-3xl font-black text-red-600">
                Rp {stats.expense.toLocaleString("id-ID")}
              </p>
            </div>
            <div
              className={`p-6 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl text-white ${stats.net >= 0 ? "bg-gradient-to-br from-[#1B4332]/95 to-[#0d261b]/95" : "bg-red-900/95"}`}
            >
              <h3 className="text-xs font-bold text-green-200 uppercase tracking-wider mb-3">
                Laba Bersih
              </h3>
              <p className="text-3xl font-black drop-shadow-md">
                Rp {stats.net.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-6">
              {/* PANEL ANALISIS PRODUK MENU TERLARIS */}
              <div className="bg-white/10 backdrop-blur-2xl p-5 md:p-6 rounded-3xl border border-white/20 shadow-2xl grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-black text-sm text-green-300 flex items-center gap-2 uppercase tracking-wider mb-4">
                    <Award size={18} /> Menu Terlaris (Best Seller)
                  </h4>
                  {bestSellers.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-4">
                      Belum ada data penjualan pada periode ini.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {bestSellers.map((item, index) => (
                        <div key={item.name} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="truncate w-3/4">
                              {index + 1}. {item.name}
                            </span>
                            <span className="text-green-300 font-black">
                              {item.qty} Cup
                            </span>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                              style={{
                                width: `${Math.min((item.qty / bestSellers[0].qty) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-black text-sm text-red-400 flex items-center gap-2 uppercase tracking-wider mb-4">
                    <AlertCircle size={18} /> Kurang Laku / Pasif
                  </h4>
                  {leastSellers.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-4">
                      Belum ada data produk terjual.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {leastSellers.map((item, index) => (
                        <div key={item.name} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="truncate w-3/4">
                              {index + 1}. {item.name}
                            </span>
                            <span className="text-red-400 font-black">
                              {item.qty} Cup
                            </span>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-red-500 to-pink-500"
                              style={{
                                width: `${Math.max((item.qty / bestSellers[0].qty) * 100, 10)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/40 text-gray-900 flex flex-col">
                <div className="border-b p-5 bg-white/50 font-black text-gray-900">
                  Daftar Aliran Dana Masuk & Keluar
                </div>
                <div className="max-h-[420px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase">
                      <tr>
                        <th className="p-4">Waktu</th>
                        <th className="p-4">Keterangan</th>
                        <th className="p-4 text-right">Jumlah</th>
                        <th className="p-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-gray-50">
                          <td className="p-4">
                            {new Date(tx.created_at).toLocaleTimeString(
                              "id-ID",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </td>
                          <td className="p-4">{tx.description}</td>
                          <td
                            className={`p-4 text-right font-black ${tx.type === "IN" ? "text-[#1B4332]" : "text-red-600"}`}
                          >
                            {tx.type === "IN" ? "+" : "-"} Rp{" "}
                            {Number(tx.amount).toLocaleString("id-ID")}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteTransaction(tx.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-black/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20 text-white lg:sticky lg:top-4">
              <h3 className="font-black text-lg mb-4">
                Input Pengeluaran Toko
              </h3>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi Pengeluaran"
                  className="w-full bg-white/10 p-3 rounded-xl border border-white/10 text-xs text-white"
                  required
                />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Jumlah Uang (Rp)"
                  className="w-full bg-white/10 p-3 rounded-xl border border-white/10 text-xs text-white"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-white text-[#1B4332] font-black py-3 rounded-xl text-xs shadow-lg transition-transform active:scale-95"
                >
                  Simpan Transaksi Keluar
                </button>
              </form>
            </div>
          </div>
          <PoweredByFooter />
        </div>
      </div>
    </div>
  );
}
