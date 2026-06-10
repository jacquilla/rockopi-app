"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useTheme } from "@/lib/theme-context";
import {
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle,
  Calendar,
  Trash2,
  PlusCircle,
  DollarSign,
  Loader2,
} from "lucide-react";
import PoweredByFooter from "../../../components/PoweredByFooter";

export const dynamic = "force-dynamic";

export default function FinancePage() {
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({ omset: 0, expense: 0, net: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const [filterType, setFilterType] = useState<"DAILY" | "WEEKLY" | "MONTHLY">(
    "DAILY",
  );
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [leastSellers, setLeastSellers] = useState<any[]>([]);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchFinanceData = async () => {
    setIsLoading(true);
    try {
      const [year, month, day] = selectedDate.split("-").map(Number);
      let start = new Date(year, month - 1, day, 0, 0, 0, 0);
      let end = new Date(year, month - 1, day, 23, 59, 59, 999);

      if (filterType === "WEEKLY") {
        const dayOfWeek = start.getDay();
        const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
      } else if (filterType === "MONTHLY") {
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end = new Date(year, month, 0, 23, 59, 59, 999);
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

      // ALGORITMA PARSING MENU DARI FIGMA KODE
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
      alert("Catatan pengeluaran berhasil disimpan!");
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
    <div className="min-h-full flex flex-col font-sans bg-[#07110a]/90 backdrop-blur-md">
      <div className="flex-1 p-4 md:p-7 flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <DollarSign className="text-green-400" size={24} /> Pembukuan
              Finansial
            </h2>
            <p className="text-white/40 text-xs mt-1">
              Laporan arus kas dan performa penjualan real-time Supabase
            </p>
          </div>

          {/* KALENDER FIGMA */}
          <div className="flex items-center gap-3 bg-white/4 px-4 py-2.5 rounded-xl border border-white/8 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <Calendar className="text-green-400" size={16} />
              <span className="text-xs font-bold text-white/40">
                Tanggal Acuan:
              </span>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white font-black text-xs outline-none cursor-pointer filter invert"
            />
          </div>
        </div>

        {/* TABS SELECTOR DARI FIGMA UI */}
        <div className="flex gap-2 p-1 bg-black/20 border border-white/5 rounded-xl w-fit">
          {(["DAILY", "WEEKLY", "MONTHLY"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                filterType === type
                  ? "text-white"
                  : "text-white/40 hover:text-white/60"
              }`}
              style={{
                backgroundColor:
                  filterType === type
                    ? theme.primary || "#1B4332"
                    : "transparent",
              }}
            >
              {type === "DAILY"
                ? "Harian"
                : type === "WEEKLY"
                  ? "Mingguan"
                  : "Bulanan"}
            </button>
          ))}
        </div>

        {/* STATS CARD GRID DARI FIGMA */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
            <p className="text-white/40 text-[10px] font-black uppercase tracking-wider mb-1">
              Total Pendapatan
            </p>
            <p className="text-2xl font-black text-green-400">
              Rp {stats.omset.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
            <p className="text-white/40 text-[10px] font-black uppercase tracking-wider mb-1">
              Total Pengeluaran
            </p>
            <p className="text-2xl font-black text-red-400">
              Rp {stats.expense.toLocaleString("id-ID")}
            </p>
          </div>
          <div
            className="bg-white/4 border border-white/8 rounded-2xl p-5"
            style={{ borderLeftColor: theme.primary, borderLeftWidth: "4px" }}
          >
            <p className="text-white/40 text-[10px] font-black uppercase tracking-wider mb-1">
              Laba Bersih
            </p>
            <p
              className={`text-2xl font-black ${stats.net >= 0 ? "text-white" : "text-red-500"}`}
            >
              {stats.net < 0 ? "-" : ""}Rp{" "}
              {Math.abs(stats.net).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* SPLIT SCREEN LAYOUT FIGMA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            {/* BEST SELLER & LEAST SELLER GRID CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
                <h4 className="font-black text-xs text-green-400 flex items-center gap-2 uppercase tracking-wider mb-4">
                  <Award size={16} /> Menu Terlaris (Best Seller)
                </h4>
                {bestSellers.length === 0 ? (
                  <p className="text-xs text-white/30 italic py-2">
                    Belum ada penjualan periode ini.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {bestSellers.map((item, index) => (
                      <div
                        key={item.name}
                        className="flex justify-between items-center text-xs border-b border-white/5 pb-2"
                      >
                        <span className="text-white/80 font-medium truncate w-3/4">
                          {index + 1}. {item.name}
                        </span>
                        <span className="text-green-400 font-black whitespace-nowrap">
                          {item.qty} Cup
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
                <h4 className="font-black text-xs text-red-400 flex items-center gap-2 uppercase tracking-wider mb-4">
                  <AlertCircle size={16} /> Kurang Laku / Pasif
                </h4>
                {leastSellers.length === 0 ? (
                  <p className="text-xs text-white/30 italic py-2">
                    Belum ada data produk terjual.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {leastSellers.map((item, index) => (
                      <div
                        key={item.name}
                        className="flex justify-between items-center text-xs border-b border-white/5 pb-2"
                      >
                        <span className="text-white/60 font-medium truncate w-3/4">
                          {index + 1}. {item.name}
                        </span>
                        <span className="text-red-400 font-black whitespace-nowrap">
                          {item.qty} Cup
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* MUTASI KAS TABLE */}
            <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-white/5 bg-black/20 font-black text-sm text-white flex justify-between items-center">
                <span>Daftar Arus Kas Periode Ini</span>
                <span className="text-[10px] font-bold text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                  {transactions.length} Entri
                </span>
              </div>
              <div className="max-h-[300px] overflow-y-auto scrollbar-hide overflow-x-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2
                      className="animate-spin text-green-400"
                      size={20}
                    />
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="p-10 text-center text-white/20 text-xs font-bold uppercase tracking-widest">
                    Tidak ada catatan dana
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead className="bg-black/30 border-b border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                      <tr>
                        <th className="p-4 w-20">Jam</th>
                        <th className="p-4">Keterangan</th>
                        <th className="p-4 text-right w-28">Jumlah</th>
                        <th className="p-4 text-center w-14">Hapus</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs text-white/80">
                      {transactions.map((tx) => (
                        <tr
                          key={tx.id}
                          className="border-b border-white/5 hover:bg-white/20 transition-colors"
                        >
                          <td className="p-4 font-mono text-white/40">
                            {new Date(tx.created_at).toLocaleTimeString(
                              "id-ID",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </td>
                          <td className="p-4 font-bold">{tx.description}</td>
                          <td
                            className={`p-4 text-right font-black text-sm ${tx.type === "IN" ? "text-green-400" : "text-red-400"}`}
                          >
                            {tx.type === "IN" ? "+" : "-"} Rp{" "}
                            {Number(tx.amount).toLocaleString("id-ID")}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteTransaction(tx.id)}
                              className="text-white/20 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: INPUT FORM EXPENSE FIGMA */}
          <div className="bg-white/4 border border-white/8 rounded-2xl p-6 lg:sticky lg:top-4">
            <h3 className="text-white font-black text-sm mb-4 flex items-center gap-2">
              <PlusCircle size={16} className="text-green-400" /> Input
              Pengeluaran
            </h3>
            <form onSubmit={handleAddExpense} className="space-y-3">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi pengeluaran..."
                className="w-full bg-white/4 text-white placeholder-white/20 px-4 py-3 rounded-xl border border-white/8 focus:border-green-400/50 outline-none text-xs transition-all"
                required
              />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Jumlah (Rp)"
                className="w-full bg-white/4 text-white placeholder-white/20 px-4 py-3 rounded-xl border border-white/8 focus:border-green-400/50 outline-none text-xs transition-all"
                required
              />
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-300 font-black rounded-xl text-xs transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  "Simpan Transaksi Keluar"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <PoweredByFooter />
        </div>
      </div>
    </div>
  );
}
