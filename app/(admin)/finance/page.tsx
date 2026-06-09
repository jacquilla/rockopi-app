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
  BarChart3,
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
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
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
      // Tentukan rentang waktu berdasarkan filterType dan selectedDate
      const baseDate = new Date(selectedDate);
      let start = new Date(baseDate);
      let end = new Date(baseDate);

      if (filterType === "DAILY") {
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
      } else if (filterType === "WEEKLY") {
        // Tarik dari hari Senin minggu berjalan
        const day = baseDate.getDay();
        const diff = baseDate.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);

        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
      } else if (filterType === "MONTHLY") {
        // Tarik dari tanggal 1 sampai akhir bulan berjalan
        start.setDate(1);
        start.setHours(0, 0, 0, 0);

        end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
      }

      // Ambil seluruh data dari cloud Supabase sesuai rentang waktu filter
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Filter: Hanya hitung pemasukan yang berstatus 'PAID'
      const validTransactions = (data || []).filter((item: any) => {
        if (item.type === "IN" && item.status !== "PAID") return false;
        return true;
      });

      setTransactions(validTransactions);

      // 1. HITUNG KALKULASI FINANSIAL
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

      // 2. ALGORITMA EKSTRAKSI DAN ANALISIS MENU TERLARIS (IN-MEMORY PARSING)
      const menuCounts: { [key: string]: number } = {};

      validTransactions.forEach((item: any) => {
        if (item.type === "IN") {
          // Format string deskripsi: "A/N [BUDI] - 2x Hot Rockopi ⭐ & 1x Iced Matcha"
          const parts = item.description.split(" - ");
          if (parts.length > 1) {
            const orderContent = parts[1]; // "2x Hot Rockopi ⭐ & 1x Iced Matcha"
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

      // Konversi Map objek menjadi Array bersarang untuk sorting
      const sortedMenuProducts = Object.keys(menuCounts)
        .map((name) => ({
          name,
          qty: menuCounts[name],
        }))
        .sort((a, b) => b.qty - a.qty);

      // Ambil Top 4 Terlaris dan Bottom 4 Kurang Laku
      setBestSellers(sortedMenuProducts.slice(0, 4));
      setLeastSellers([...sortedMenuProducts].reverse().slice(0, 4));
    } catch (err: any) {
      console.error("Gagal sinkronisasi data pembukuan:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Ganti bagian useEffect agar memanggil data setiap kali halaman dimuat
  useEffect(() => {
    fetchFinanceData();
  }, [filterType, selectedDate]); // Data akan ter-update otomatis jika filter berubah

  // 2. Perbarui fungsi simpan agar memicu fetch ulang secara instan
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
          created_at: new Date().toISOString(), // Memastikan timestamp terbaca jelas
        },
      ]);

      if (error) throw error;

      // Bersihkan form
      setDescription("");
      setAmount("");

      // Panggil ulang data agar tabel langsung terupdate tanpa refresh
      await fetchFinanceData();

      alert("Catatan biaya operasional berhasil disimpan!");
    } catch (err: any) {
      alert(`Gagal menyimpan data: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/bg-rockopi.avif')] bg-cover bg-fixed bg-center flex flex-col text-white font-sans">
      <div className="flex-1 bg-black/50 backdrop-blur-sm p-4 md:p-8 pt-6 flex flex-col">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col space-y-6 pb-10">
          {/* HEADER DASHBOARD */}
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
            <div>
              <h2 className="text-3xl font-black drop-shadow-lg text-white">
                Pembukuan Finansial Rockopi
              </h2>
              <p className="text-gray-200 font-medium mt-1 drop-shadow-md">
                Laporan pendapatan pintar terintegrasi cloud database Supabase.
              </p>
            </div>
          </header>

          {/* ALAT KONTROL FILTER & KALENDER KALKULATOR (GLASSMORPHISM) */}
          <div className="bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
            {/* Pilihan Rentang Waktu */}
            <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded-2xl border border-white/5 w-full md:w-auto overflow-x-auto">
              <button
                onClick={() => setFilterType("DAILY")}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${filterType === "DAILY" ? "bg-[#1B4332] text-white shadow-lg border border-white/10" : "text-gray-300 hover:bg-white/5"}`}
              >
                Harian
              </button>
              <button
                onClick={() => setFilterType("WEEKLY")}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${filterType === "WEEKLY" ? "bg-[#1B4332] text-white shadow-lg border border-white/10" : "text-gray-300 hover:bg-white/5"}`}
              >
                Mingguan
              </button>
              <button
                onClick={() => setFilterType("MONTHLY")}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${filterType === "MONTHLY" ? "bg-[#1B4332] text-white shadow-lg border border-white/10" : "text-gray-300 hover:bg-white/5"}`}
              >
                Bulanan
              </button>
            </div>

            {/* Input Kalender Custom */}
            <div className="flex items-center gap-3 w-full md:w-auto bg-black/20 px-4 py-2 rounded-2xl border border-white/10">
              <Calendar className="text-yellow-400 flex-shrink-0" size={18} />
              <span className="text-xs font-bold text-gray-300 whitespace-nowrap">
                Pilih Tanggal Acuan:
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-white font-black text-sm outline-none cursor-pointer filter invert"
              />
            </div>
          </div>

          {/* CARD SUMMARY KEUANGAN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/40 text-gray-900">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <TrendingUp size={18} />
                </div>
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
                  Total Pendapatan
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
                  Laba Bersih
                </h3>
              </div>
              <p className="text-3xl font-black drop-shadow-md">
                {stats.net < 0 ? "-" : ""} Rp{" "}
                {Math.abs(stats.net).toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* SPLIT SCREEN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* KOLOM KIRI: ANALISIS PRODUK TERLARIS & DATA KAS */}
            <div className="lg:col-span-2 space-y-6">
              {/* PANEL ANALISIS PRODUK MENU TERLARIS */}
              <div className="bg-white/10 backdrop-blur-2xl p-5 md:p-6 rounded-3xl border border-white/20 shadow-2xl grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Bagian Best Seller */}
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

                {/* Bagian Kurang Laku */}
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

              {/* TABEL MUTASI KEUANGAN ARUS KAS */}
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/40 text-gray-900 flex flex-col">
                <div className="border-b border-gray-100 p-5 flex items-center justify-between bg-white/50">
                  <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                    <FileText size={18} className="text-[#1B4332]" /> Daftar
                    Aliran Dana Masuk & Keluar
                  </h3>
                  <span className="text-[11px] font-bold text-gray-500 bg-white border px-3 py-1 rounded-full shadow-sm">
                    {transactions.length} Mutasi
                  </span>
                </div>

                <div className="max-h-[420px] overflow-y-auto">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-16 gap-2">
                      <Loader2
                        className="animate-spin text-[#1B4332]"
                        size={24}
                      />
                      <p className="text-xs font-bold text-gray-500">
                        Membuka pembukuan cloud...
                      </p>
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="p-14 text-center text-gray-400 font-medium text-xs">
                      Tidak ada riwayat mutasi kas di rentang waktu ini.
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50/80 border-b border-gray-100 sticky top-0 backdrop-blur-md text-[11px] font-bold text-gray-500">
                        <tr>
                          <th className="p-4 w-24">Waktu</th>
                          <th className="p-4">Keterangan</th>
                          <th className="p-4 text-right w-32">Jumlah</th>
                          <th className="p-4 text-center w-14">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs">
                        {transactions.map((tx) => {
                          const isIncome = tx.type === "IN";
                          return (
                            <tr
                              key={tx.id}
                              className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                            >
                              <td className="p-4 text-gray-400 font-bold">
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
                                className={`p-4 text-right font-black text-sm whitespace-nowrap ${isIncome ? "text-[#1B4332]" : "text-red-600"}`}
                              >
                                {isIncome ? "+" : "-"} Rp{" "}
                                {Number(tx.amount).toLocaleString("id-ID")}
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleDeleteTransaction(tx.id)}
                                  className="p-2 text-gray-300 hover:text-red-500 rounded-full transition-colors"
                                >
                                  <Trash2 size={14} />
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
            </div>

            {/* KOLOM KANAN: INPUT PENYIMPANAN BIAYA MANUWAL */}
            <div className="bg-black/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20 text-white lg:sticky lg:top-4">
              <h3 className="font-black text-lg mb-1 tracking-wide">
                Input Pengeluaran Toko
              </h3>
              <p className="text-xs text-gray-300 mb-5">
                Catat pengeluaran operasional mendadak Rockopi di sini.
              </p>

              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">
                    Deskripsi Pengeluaran
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Contoh: Beli Es Batu & Cup Plastik"
                    className="w-full bg-white/10 text-white font-bold px-4 py-3 rounded-xl border border-white/10 focus:border-green-400 outline-none transition-all text-xs placeholder-gray-500"
                    maxLength={50}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">
                    Jumlah Dana (Rp)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Contoh: 150000"
                    className="w-full bg-white/10 text-white font-bold px-4 py-3 rounded-xl border border-white/10 focus:border-green-400 outline-none transition-all text-xs placeholder-gray-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-white hover:bg-gray-100 text-[#1B4332] font-black py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 text-xs font-bold mt-2"
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <PlusCircle size={16} />
                  )}
                  Simpan Transaksi Keluar
                </button>
              </form>
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
