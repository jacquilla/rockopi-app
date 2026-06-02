"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar as CalendarIcon,
  SearchX,
  BarChart3,
  Award,
} from "lucide-react";

export default function FinanceUI() {
  const [isClient, setIsClient] = useState(false);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // STATE BARU UNTUK TAB LAPORAN ANALISIS
  const [reportTab, setReportTab] = useState<"MINGGUAN" | "BULANAN">(
    "MINGGUAN",
  );

  // Helper: Format Date ke YYYY-MM-DD
  const getLocalDateString = (dateObj: Date) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setIsClient(true);
    setSelectedDate(getLocalDateString(new Date()));

    const loadFinanceData = () => {
      const savedTransactions = JSON.parse(
        localStorage.getItem("rockopi_orders") || "[]",
      );
      setAllTransactions(savedTransactions);
    };

    loadFinanceData();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "rockopi_orders") loadFinanceData();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (!isClient) return null;

  // --- 1. LOGIKA HARIAN (Sesuai Kalender) ---
  const filteredDaily = allTransactions.filter(
    (trx: any) => getLocalDateString(new Date(trx.date)) === selectedDate,
  );

  const dailySummary = filteredDaily.reduce(
    (acc, trx) => {
      if (trx.type === "IN") {
        acc.income += trx.amount;
        acc.net += trx.amount;
      } else if (trx.type === "OUT") {
        acc.expense += trx.amount;
        acc.net -= trx.amount;
      }
      return acc;
    },
    { income: 0, expense: 0, net: 0 },
  );

  // --- 2. LOGIKA LAPORAN MINGGUAN & BULANAN (Analisis Item Laku) ---
  const selectedDateObj = new Date(selectedDate);

  // Filter transaksi untuk Mingguan (7 hari ke belakang dari kalender)
  const past7Days = new Date(selectedDateObj);
  past7Days.setDate(past7Days.getDate() - 6);

  // Filter transaksi untuk Bulanan (Bulan dan Tahun yang sama dengan kalender)
  const currentMonth = selectedDateObj.getMonth();
  const currentYear = selectedDateObj.getFullYear();

  const reportTransactions = allTransactions.filter((trx: any) => {
    const trxDate = new Date(trx.date);
    if (reportTab === "MINGGUAN") {
      return (
        trxDate >= past7Days &&
        trxDate <= new Date(selectedDateObj.setHours(23, 59, 59))
      );
    } else {
      return (
        trxDate.getMonth() === currentMonth &&
        trxDate.getFullYear() === currentYear
      );
    }
  });

  // Hitung Total Pendapatan Khusus Penjualan di periode tersebut
  const reportIncome = reportTransactions
    .filter((trx) => trx.type === "IN")
    .reduce((sum, trx) => sum + trx.amount, 0);

  // Ekstrak dan Hitung Menu Paling Laku (Best Sellers)
  const itemCounts: Record<string, number> = {};
  reportTransactions.forEach((trx) => {
    if (trx.type === "IN" && trx.desc.includes("Pesanan Pelanggan")) {
      // Menghilangkan awalan teks
      const cleanDesc = trx.desc.replace("Pesanan Pelanggan: ", "");
      // Memisahkan per item (contoh: "2x Hot Rockopi & 1x Iced Matcha")
      const items = cleanDesc.split(" & ");

      items.forEach((item: string) => {
        // Mencari pola Angka + 'x' + Nama Item (Contoh: "2x Hot Rockopi")
        const match = item.match(/(\d+)x\s+(.+)/);
        if (match) {
          const qty = parseInt(match[1]);
          const name = match[2];
          itemCounts[name] = (itemCounts[name] || 0) + qty;
        }
      });
    }
  });

  // Urutkan dari yang paling laku ke yang tidak laku
  const bestSellers = Object.entries(itemCounts)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty);

  // Mencari nilai tertinggi untuk membuat grafik proporsional
  const maxQty = bestSellers.length > 0 ? bestSellers[0].qty : 1;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* HEADER & KALENDER HARIAN */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <header className="flex items-center gap-3">
          <div className="p-3 bg-white/80 backdrop-blur-sm text-[#1B4332] rounded-lg shadow-sm border border-white/50">
            <Wallet size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 drop-shadow-sm">
              Pembukuan
            </h2>
            <p className="text-gray-700 font-medium">
              Laporan arus kas dan analisis penjualan.
            </p>
          </div>
        </header>

        <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md rounded-xl p-2 shadow-sm border border-white/60">
          <div className="bg-[#1B4332] text-white p-2 rounded-lg">
            <CalendarIcon size={18} />
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent border-none outline-none font-bold text-gray-800 cursor-pointer text-sm pr-2"
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. SEKSI HARIAN (Sesuai Kalender)                           */}
      {/* ========================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/50 relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-green-600">
            <TrendingUp size={64} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <TrendingUp size={16} />
            </div>
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
              Pemasukan Harian
            </h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            Rp {dailySummary.income.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/50 relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-red-600">
            <TrendingDown size={64} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <TrendingDown size={16} />
            </div>
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
              Pengeluaran Harian
            </h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            Rp {dailySummary.expense.toLocaleString("id-ID")}
          </p>
        </div>

        <div
          className={`backdrop-blur-lg p-6 rounded-2xl shadow-xl relative overflow-hidden text-white transition-all duration-500 ${dailySummary.net >= 0 ? "bg-[#1B4332]/90 border-green-800" : "bg-red-800/90 border-red-900"}`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-20 text-white">
            <DollarSign size={64} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-8 h-8 rounded-full bg-black/30 border flex items-center justify-center ${dailySummary.net >= 0 ? "border-green-700 text-green-300" : "border-red-700 text-red-300"}`}
            >
              <DollarSign size={16} />
            </div>
            <h3
              className={`text-sm font-bold uppercase tracking-wider ${dailySummary.net >= 0 ? "text-green-100" : "text-red-100"}`}
            >
              Laba Bersih Harian
            </h3>
          </div>
          <p className="text-3xl font-bold text-white mt-2 drop-shadow-md">
            {dailySummary.net < 0 ? "-" : ""} Rp{" "}
            {Math.abs(dailySummary.net).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 overflow-hidden mb-12">
        <div className="p-5 border-b border-gray-200/60 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">
            Rincian Arus Kas ({selectedDate})
          </h3>
        </div>

        {filteredDaily.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <SearchX size={40} className="mx-auto mb-3 opacity-20" />
            <p className="font-bold text-gray-700">
              Tidak Ada Transaksi Harian
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[300px]">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-gray-100/50 sticky top-0">
                <tr className="border-b border-gray-200/60 text-sm text-gray-600">
                  <th className="p-4 font-bold">Waktu</th>
                  <th className="p-4 font-bold">Keterangan Transaksi</th>
                  <th className="p-4 font-bold text-right">Nominal (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {filteredDaily.map((trx: any) => (
                  <tr
                    key={trx.id}
                    className="border-b border-gray-100/50 hover:bg-white/60"
                  >
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(trx.date).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td
                      className={`p-4 font-bold ${trx.desc.includes("Pesanan Pelanggan") ? "text-[#1B4332]" : "text-red-700"}`}
                    >
                      {trx.desc.replace("Pesanan Pelanggan: ", "")}
                    </td>
                    <td
                      className={`p-4 text-right font-bold whitespace-nowrap ${trx.type === "IN" ? "text-green-600" : "text-red-600"}`}
                    >
                      {trx.type === "IN" ? "+" : "-"}{" "}
                      {trx.amount.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. SEKSI LAPORAN & ANALISIS BEST SELLER (Mingguan/Bulanan)*/}
      {/* ========================================================= */}

      <div className="mt-12 bg-[#1B4332]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-800 overflow-hidden text-white">
        {/* Header Laporan */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-green-800/50 bg-black/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl border border-white/20">
              <BarChart3 size={28} className="text-green-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Analisis Penjualan Menu
              </h2>
              <p className="text-green-200 text-sm font-medium mt-1">
                Pantau tren dan performa produk terlaris Anda.
              </p>
            </div>
          </div>

          {/* Toggle Tab Mingguan / Bulanan */}
          <div className="flex bg-black/40 rounded-xl p-1.5 border border-white/10 shadow-inner">
            <button
              onClick={() => setReportTab("MINGGUAN")}
              className={`px-5 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${reportTab === "MINGGUAN" ? "bg-white text-[#1B4332] shadow-md" : "text-gray-300 hover:text-white"}`}
            >
              7 Hari Terakhir
            </button>
            <button
              onClick={() => setReportTab("BULANAN")}
              className={`px-5 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${reportTab === "BULANAN" ? "bg-white text-[#1B4332] shadow-md" : "text-gray-300 hover:text-white"}`}
            >
              Bulan Ini
            </button>
          </div>
        </div>

        {/* Konten Laporan */}
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <p className="text-green-200/80 text-sm uppercase tracking-widest font-bold mb-1">
              Total Omset Penjualan Kopi{" "}
              {reportTab === "MINGGUAN" ? "(7 Hari)" : "(Bulan Ini)"}
            </p>
            <h3 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">
              Rp {reportIncome.toLocaleString("id-ID")}
            </h3>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h4 className="flex items-center gap-2 font-bold text-lg mb-6 border-b border-white/10 pb-4">
              <Award className="text-yellow-400" size={20} /> Peringkat Menu
              Paling Laku (Best Sellers)
            </h4>

            {bestSellers.length === 0 ? (
              <p className="text-gray-400 text-center py-6 italic">
                Belum ada data penjualan pada periode ini.
              </p>
            ) : (
              <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {bestSellers.map((item, index) => {
                  // Hitung persentase untuk panjang bar grafik (minimal 5% agar bar tetap terlihat)
                  const percentage = Math.max((item.qty / maxQty) * 100, 5);
                  const isTop3 = index < 3;

                  return (
                    <div key={item.name} className="relative">
                      <div className="flex justify-between items-end mb-1.5">
                        <span
                          className={`font-bold text-sm flex items-center gap-2 ${isTop3 ? "text-white" : "text-green-100"}`}
                        >
                          {isTop3 && (
                            <span className="text-yellow-400 font-black text-xs">
                              #{index + 1}
                            </span>
                          )}
                          {item.name}
                        </span>
                        <span className="font-bold text-sm bg-white/10 px-2 py-0.5 rounded text-green-200">
                          {item.qty} Cup
                        </span>
                      </div>

                      {/* Grafik Batang Visual */}
                      <div className="w-full bg-black/40 rounded-full h-3 overflow-hidden shadow-inner flex">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${isTop3 ? "bg-gradient-to-r from-green-400 to-yellow-400" : "bg-green-500/60"}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
