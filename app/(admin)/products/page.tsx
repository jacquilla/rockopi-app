"use client";

import { useState, useEffect } from "react";
import { Edit3, Save, X, Search, Package, Loader2 } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import PoweredByFooter from "../../../components/PoweredByFooter";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDesc, setEditDesc] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data } = await supabase.from("products").select("*").order("id");
    if (data) setProducts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const startEdit = (id: number, desc: string) => {
    setEditingId(id);
    setEditDesc(desc);
  };

  const handleSave = async (id: number) => {
    if (!editDesc.trim()) return;
    setIsSaving(true);
    try {
      await supabase
        .from("products")
        .update({ description: editDesc })
        .eq("id", id);
      await fetchProducts();
      setEditingId(null);
    } catch (err) {
      alert("Gagal menyimpan deskripsi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col font-sans bg-[#07110a]/90 backdrop-blur-md">
      <div className="flex-1 p-4 md:p-7 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Package className="text-green-400" /> Master Produk
            </h2>
            <p className="text-white/40 text-xs mt-1">
              Kelola daftar menu dan deskripsi produk Rockopi
            </p>
          </div>
          <div className="relative w-full sm:w-auto">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="text"
              placeholder="Cari nama menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 bg-white/5 text-white pl-9 pr-4 py-2.5 rounded-xl border border-white/10 focus:border-green-400/50 outline-none text-xs transition-all placeholder:text-white/20"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-green-400" size={32} />
            <p className="text-green-400/60 text-xs font-bold uppercase tracking-widest">
              Memuat Menu...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col group"
              >
                <div className="flex items-center gap-4 p-4 border-b border-white/5 bg-black/20">
                  <div className="w-12 h-12 rounded-xl bg-black/40 overflow-hidden border border-white/10">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div>
                    <p className="font-black text-white text-sm">{p.name}</p>
                    <p className="text-green-400 font-bold text-xs">
                      Rp {p.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest bg-white/5 text-white/40 border border-white/10">
                      {p.category}
                    </span>
                  </div>

                  {editingId === p.id ? (
                    <div className="space-y-2 mt-auto">
                      <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full bg-black/40 text-white px-3 py-2 rounded-xl border border-green-400/30 outline-none text-xs resize-none"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(p.id)}
                          disabled={isSaving}
                          className="flex-1 py-2 bg-green-500 hover:bg-green-400 rounded-lg text-black text-xs font-bold transition-all disabled:opacity-50"
                        >
                          {isSaving ? "Menyimpan..." : "Simpan"}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 transition-all"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-white/40 text-xs leading-relaxed line-clamp-2">
                        {p.description}
                      </p>
                      <button
                        onClick={() => startEdit(p.id, p.description)}
                        className="w-full py-2 mt-auto bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/40 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Edit3 size={12} /> Edit Deskripsi
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-auto pt-4">
          <PoweredByFooter />
        </div>
      </div>
    </div>
  );
}
