"use client";

import { useState, useEffect } from "react";
import { Store, Edit3, Save, X, RefreshCw } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import PoweredByFooter from "../../../components/PoweredByFooter";

export const dynamic = "force-dynamic";

export default function MasterProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newDescription, setNewDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("category", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      alert(`Gagal mengambil data produk: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const startEditing = (id: number, currentDesc: string) => {
    setEditingId(id);
    setNewDescription(currentDesc);
  };

  const handleUpdateDescription = async (id: number) => {
    if (!newDescription.trim()) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("products")
        .update({ description: newDescription })
        .eq("id", id);

      if (error) throw error;

      alert("Deskripsi menu berhasil diperbarui!");
      setEditingId(null);
      fetchProducts();
    } catch (err: any) {
      alert(`Gagal memperbarui deskripsi: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-4rem)] pb-12 px-4 md:px-0">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 backdrop-blur-md text-white rounded-lg shadow-sm border border-white/30">
            <Store size={24} />
          </div>
          <div>
            {/* WARNA TEKS DAN NAMA SUDAH DIPERBAIKI DI SINI */}
            <h2 className="text-3xl font-bold text-white drop-shadow-md">
              Master Produk Rockopi
            </h2>
            <p className="text-gray-200 font-medium text-sm mt-0.5 drop-shadow-sm">
              Kelola informasi menu dan sinkronisasikan langsung ke device
              pelanggan.
            </p>
          </div>
        </div>
        <button
          onClick={fetchProducts}
          className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-[#1B4332] hover:bg-gray-50 flex items-center gap-2 text-sm font-bold transition-all active:scale-95"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </header>

      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-[#1B4332] text-white">
              <tr className="text-sm">
                <th className="p-4 font-bold w-32">Kategori</th>
                <th className="p-4 font-bold w-48">Nama Menu</th>
                <th className="p-4 font-bold w-32">Harga</th>
                <th className="p-4 font-bold">Deskripsi Menu (Live di HP)</th>
                <th className="p-4 font-bold text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-12 text-center text-gray-500 font-bold"
                  >
                    Sinkronisasi produk cloud...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    Belum ada data produk di database.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="p-4 text-sm font-bold text-gray-500">
                      {product.category}
                    </td>
                    <td className="p-4 font-bold text-gray-900">
                      {product.name}
                    </td>
                    <td className="p-4 font-black text-[#1B4332]">
                      Rp {Number(product.price).toLocaleString("id-ID")}
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      {editingId === product.id ? (
                        <textarea
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                          className="w-full border-2 border-blue-400 focus:border-[#1B4332] p-3 rounded-xl outline-none shadow-inner bg-gray-50 font-medium text-gray-900"
                          rows={3}
                        />
                      ) : (
                        <p className="line-clamp-3 font-medium leading-relaxed">
                          {product.description}
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {editingId === product.id ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleUpdateDescription(product.id)}
                            disabled={isSaving}
                            className="p-2.5 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 flex items-center justify-center transition-colors active:scale-95"
                            title="Simpan Deskripsi"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 flex items-center justify-center transition-colors active:scale-95"
                            title="Batal"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            startEditing(product.id, product.description)
                          }
                          className="px-3 py-2 bg-white border border-gray-200 text-[#1B4332] rounded-xl font-bold text-xs shadow-sm hover:bg-gray-50 flex items-center gap-1.5 mx-auto transition-all active:scale-95"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <PoweredByFooter />
    </div>
  );
}
