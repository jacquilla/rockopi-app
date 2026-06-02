"use client";

import { useState, useEffect } from "react";
import {
  History,
  ArrowDownCircle,
  ArrowUpCircle,
  ShoppingCart,
  Package,
} from "lucide-react";

export default function LogsPage() {
  const [activeTab, setActiveTab] = useState<"STOK" | "ORDER">("STOK");
  const [inventoryLogs, setInventoryLogs] = useState<any[]>([]);
  const [orderLogs, setOrderLogs] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  // FUNGSI UNTUK MEMUAT KEDUA DATA SEKALIGUS
  const loadMasterData = () => {
    // 1. Ambil data manual bahan baku (Dari menu In/Out Stok)
    const savedInventory = JSON.parse(
      localStorage.getItem("rockopi_inventory_logs") || "[]",
    );
    setInventoryLogs(savedInventory);

    // 2. Ambil data pesanan otomatis (Dari halaman Order Pelanggan)
    const savedOrders = JSON.parse(
      localStorage.getItem("rockopi_orders") || "[]",
    );

    // Filter khusus: Kita hanya mengambil yang berlabel "Pesanan Pelanggan"
    // agar data "Belanja Stok" yang masuk ke pembukuan tidak ikut muncul di tab order.
    const customerOrders = savedOrders.filter((o: any) =>
      o.desc.includes("Pesanan Pelanggan"),
    );
    setOrderLogs(customerOrders);
  };

  useEffect(() => {
    setIsClient(true);
    loadMasterData();

    // INTEGRASI REAL-TIME: Halaman ini akan otomatis refresh jika ada
    // pesanan masuk baru ATAU ada input stok bahan baku baru di tab lain!
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "rockopi_inventory_logs" || e.key === "rockopi_orders") {
        loadMasterData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (!isClient) return null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* HEADER & PUSAT KENDALI TAB */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <header className="flex items-center gap-3">
          <div className="p-3 bg-white/80 backdrop-blur-sm text-[#1B4332] rounded-lg shadow-sm border border-white/50">
            <History size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 drop-shadow-sm">
              Pusat Riwayat
            </h2>
            <p className="text-gray-700 font-medium">
              Kontrol penuh aktivitas bahan baku dan penjualan harian.
            </p>
          </div>
        </header>

        {/* Tab Switcher Premium */}
        <div className="flex bg-white/50 backdrop-blur-md rounded-xl p-1.5 shadow-sm border border-white/60">
          <button
            onClick={() => setActiveTab("STOK")}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all duration-200 ${
              activeTab === "STOK"
                ? "bg-[#1B4332] text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            <Package size={18} /> Bahan Baku (In/Out)
          </button>
          <button
            onClick={() => setActiveTab("ORDER")}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all duration-200 ${
              activeTab === "ORDER"
                ? "bg-[#1B4332] text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            <ShoppingCart size={18} /> Penjualan (Order)
          </button>
        </div>
      </div>

      {/* KONTEN TAB: RIWAYAT STOK BAHAN BAKU */}
      {activeTab === "STOK" && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="p-5 border-b border-gray-200/60 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-800">
              Catatan Input Manual Back-End
            </h3>
            <span className="text-xs font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>{" "}
              Live Terhubung
            </span>
          </div>

          {inventoryLogs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Package size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold text-xl text-gray-700 mb-1">
                Belum Ada Riwayat Stok
              </p>
              <p className="text-sm">
                Silakan catat barang masuk/keluar di menu In/Out Stok.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-gray-50/80 border-b border-gray-200">
                  <tr className="text-sm text-gray-600">
                    <th className="p-4 font-bold">Waktu</th>
                    <th className="p-4 font-bold text-center">Status</th>
                    <th className="p-4 font-bold">Nama Bahan Baku</th>
                    <th className="p-4 font-bold">Jumlah</th>
                    <th className="p-4 font-bold">Keterangan / Biaya</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryLogs.map((log: any) => {
                    const d = new Date(log.date);
                    const dateStr = d.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });
                    const timeStr = d.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    const isIN = log.type === "IN";

                    return (
                      <tr
                        key={log.id}
                        className="border-b border-gray-100/50 hover:bg-white/60 transition-colors"
                      >
                        <td className="p-4 text-sm font-medium text-gray-500 whitespace-nowrap">
                          {dateStr} <br />
                          <span className="text-xs font-bold text-gray-400">
                            {timeStr}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${isIN ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}
                          >
                            {isIN ? (
                              <ArrowDownCircle size={14} />
                            ) : (
                              <ArrowUpCircle size={14} />
                            )}
                            {isIN ? "MASUK" : "KELUAR"}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-gray-800 text-lg">
                          {log.name}
                        </td>
                        <td className="p-4 font-bold text-gray-900 whitespace-nowrap">
                          {log.qty}{" "}
                          <span className="text-sm font-medium text-gray-500">
                            {log.unit}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-700 font-medium">
                            {log.note}
                          </p>
                          {isIN && log.cost > 0 && (
                            <p className="text-xs font-bold text-red-600 mt-1 flex items-center gap-1">
                              • Biaya Belanja: Rp{" "}
                              {log.cost.toLocaleString("id-ID")}
                            </p>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* KONTEN TAB: RIWAYAT PESANAN MASUK */}
      {activeTab === "ORDER" && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="p-5 border-b border-gray-200/60 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-800">
              Catatan Otomatis dari Pelanggan
            </h3>
            <span className="text-xs font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>{" "}
              Live Terhubung
            </span>
          </div>

          {orderLogs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <ShoppingCart size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold text-xl text-gray-700 mb-1">
                Belum Ada Pesanan Masuk
              </p>
              <p className="text-sm">
                Pesanan yang dibuat oleh pelanggan dari halaman order akan
                muncul di sini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-gray-50/80 border-b border-gray-200">
                  <tr className="text-sm text-gray-600">
                    <th className="p-4 font-bold">Waktu Pesanan</th>
                    <th className="p-4 font-bold">Detail Item Terjual</th>
                    <th className="p-4 font-bold text-right">
                      Pendapatan (Rp)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderLogs.map((log: any) => {
                    const d = new Date(log.date);
                    const dateStr = d.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });
                    const timeStr = d.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <tr
                        key={log.id}
                        className="border-b border-gray-100/50 hover:bg-white/60 transition-colors"
                      >
                        <td className="p-4 text-sm font-medium text-gray-500 whitespace-nowrap">
                          {dateStr} <br />
                          <span className="text-xs font-bold text-gray-400">
                            {timeStr}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-gray-800">
                            {log.desc.replace("Pesanan Pelanggan: ", "")}
                          </p>
                        </td>
                        <td className="p-4 text-right font-bold text-xl text-[#1B4332] whitespace-nowrap">
                          + {log.amount.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
