"use client";

import { useState, useEffect } from "react";
import { Store, Edit3, Save, X, RefreshCw } from "lucide-react";
// Folder ini 3 tingkat ke dalam, jadi menggunakan ../../../
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
      fetchProducts(); // Refresh tabel admin
    } catch (err: any) {
      alert(`Gagal memperbarui deskripsi: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-4rem)] pb-12">
      <header className="flex items-center justify-between gap-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white text-[#1B4332] rounded-lg shadow-sm border border-gray-100">
            <Store size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 shadow-sm">
              Master Produk Kafe
            </h2>
            <p className="text-gray-600 font-medium text-sm mt-0.5">
              Kelola informasi menu dan sinkronisasikan langsung ke device
              pelanggan.
            </p>
          </div>
        </div>
        <button
          onClick={fetchProducts}
          className="p-2.5 bg-white border rounded-xl shadow-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 text-sm font-bold"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </header>

      <div className="bg-white rounded-3xl shadow-xl border overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-[#1B4332] text-white">
              <tr className="text-sm">
                <th className="p-4 font-bold w-32">Kategori</th>
                <th className="p-4 font-bold w-48">Nama Menu</th>
                <th className="p-4 font-bold w-32">Harga</th>
                <th className="p-4 font-bold">
                  Deskripsi Menu (Live di HP Pelanggan)
                </th>
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
                    className="border-b hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4 text-sm font-bold text-gray-600">
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
                        <p className="line-clamp-3 font-medium">
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
                            className="p-2 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 flex items-center justify-center"
                            title="Simpan Deskripsi"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 flex items-center justify-center"
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
                          className="px-3 py-1.5 bg-white border border-gray-200 text-[#1B4332] rounded-xl font-bold text-xs shadow-sm hover:bg-gray-50 flex items-center gap-1.5 mx-auto"
                        >
                          <Edit3 size={12} /> Edit Deskripsi
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
