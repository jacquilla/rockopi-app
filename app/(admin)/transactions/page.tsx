"use client";

import { useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Save,
  PackagePlus,
} from "lucide-react";

export default function TransactionsPage() {
  const [type, setType] = useState<"IN" | "OUT">("IN");
  const [itemName, setItemName] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [cost, setCost] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemName || !qty) {
      alert("Nama barang dan jumlah wajib diisi!");
      return;
    }

    const timestamp = new Date().toISOString();

    // 1. BUAT DATA LOG STOK UNTUK RIWAYAT
    const newLog = {
      id: Date.now(),
      date: timestamp,
      type: type, // 'IN' (Masuk) atau 'OUT' (Keluar)
      name: itemName,
      qty: Number(qty),
      unit: unit,
      cost: type === "IN" ? Number(cost) : 0,
      note:
        note || (type === "IN" ? "Restock Bahan Baku" : "Pemakaian / Keluar"),
    };

    // Ambil data riwayat lama, tambahkan yang baru, simpan lagi
    const existingLogs = JSON.parse(
      localStorage.getItem("rockopi_inventory_logs") || "[]",
    );
    localStorage.setItem(
      "rockopi_inventory_logs",
      JSON.stringify([newLog, ...existingLogs]),
    );

    // 2. INTEGRASI OTOMATIS KE PEMBUKUAN (KHUSUS BARANG MASUK / BELANJA)
    if (type === "IN" && Number(cost) > 0) {
      const expenseData = {
        id: Date.now() + 1, // Beda 1 milidetik agar ID unik
        date: timestamp,
        desc: `Belanja Stok: ${itemName} (${qty} ${unit})`,
        type: "OUT", // Di Pembukuan, belanja adalah 'OUT' (Pengeluaran)
        amount: Number(cost),
      };

      const existingFinance = JSON.parse(
        localStorage.getItem("rockopi_orders") || "[]",
      );
      localStorage.setItem(
        "rockopi_orders",
        JSON.stringify([expenseData, ...existingFinance]),
      );
    }

    alert(
      `Berhasil!\nStok ${type === "IN" ? "Masuk" : "Keluar"} untuk "${itemName}" telah dicatat di Riwayat.`,
    );

    // Reset Form
    setItemName("");
    setQty("");
    setCost("");
    setNote("");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-white/80 backdrop-blur-sm text-[#1B4332] rounded-lg shadow-sm border border-white/50">
          <PackagePlus size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 drop-shadow-sm">
            In/Out Stok
          </h2>
          <p className="text-gray-700 font-medium">
            Catat pergerakan bahan baku secara manual.
          </p>
        </div>
      </header>

      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/60 overflow-hidden">
        {/* TOGGLE IN / OUT */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setType("IN")}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-colors ${type === "IN" ? "bg-green-50 text-green-700 border-b-2 border-green-600" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <ArrowDownCircle size={20} /> Barang Masuk (Belanja)
          </button>
          <button
            onClick={() => setType("OUT")}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-colors ${type === "OUT" ? "bg-red-50 text-red-700 border-b-2 border-red-600" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <ArrowUpCircle size={20} /> Barang Keluar (Terpakai)
          </button>
        </div>

        {/* FORM INPUT MANUAL */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="bg-blue-50/50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100 flex items-start gap-3">
            <span className="text-xl">💡</span>
            <p>
              {type === "IN"
                ? "Catat bahan baku yang baru dibeli (Contoh: Susu UHT, Es Batu, Galon, Gula Aren). Jika Anda mengisi Total Harga, sistem akan otomatis memasukkannya sebagai Pengeluaran di menu Pembukuan!"
                : "Catat bahan baku yang terpakai, rusak, atau kadaluarsa."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Nama Barang (Bahan Baku)
              </label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Contoh: Susu UHT Diamond"
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1B4332] outline-none bg-white/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Jumlah & Satuan
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  required
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="0"
                  className="w-2/3 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1B4332] outline-none bg-white/50"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-1/3 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1B4332] outline-none bg-white/50 font-medium"
                >
                  <option value="pcs">Pcs</option>
                  <option value="liter">Liter</option>
                  <option value="kg">Kg</option>
                  <option value="gram">Gram</option>
                  <option value="galon">Galon</option>
                  <option value="pack">Pack</option>
                  <option value="karung">Karung</option>
                </select>
              </div>
            </div>

            {type === "IN" && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Total Harga Beli (Rp) - Opsional
                </label>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="Contoh: 150000"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1B4332] outline-none bg-white/50"
                />
              </div>
            )}

            <div
              className={`space-y-2 ${type === "OUT" ? "md:col-span-2" : ""}`}
            >
              <label className="text-sm font-bold text-gray-700">
                Keterangan (Opsional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  type === "IN"
                    ? "Contoh: Beli di Indomaret"
                    : "Contoh: Tumpah / Expired / Terpakai shift pagi"
                }
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1B4332] outline-none bg-white/50"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 ${type === "IN" ? "bg-[#1B4332] hover:bg-green-900" : "bg-red-600 hover:bg-red-700"}`}
            >
              <Save size={20} />
              Simpan Data {type === "IN" ? "Barang Masuk" : "Barang Keluar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
