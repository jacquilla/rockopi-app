"use client";

import { useState, useEffect } from "react";
import {
  Minus,
  Plus,
  ShoppingCart,
  Send,
  X,
  UserCircle2,
  Loader2,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import PoweredByFooter from "../../components/PoweredByFooter";

const CATEGORIES = ["Hot Coffee", "Iced Coffee", "Non Coffee"];
const CATEGORY_LABELS: Record<string, string> = {
  "Hot Coffee": "☕ Hot Coffee",
  "Iced Coffee": "🧊 Iced Coffee",
  "Non Coffee": "🍵 Non Coffee",
};

export default function OrderPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<Record<number, number>>({});
  const [activeCategory, setActiveCategory] = useState("Hot Coffee");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // MENGAMBIL DATA MENU REAL DARI DATABASE
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("products").select("*").order("id");
      if (data) setProducts(data);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  const handleIncrease = (id: number) =>
    setOrderItems((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
  const handleDecrease = (id: number) =>
    setOrderItems((p) => {
      const next = { ...p, [id]: Math.max((p[id] || 0) - 1, 0) };
      if (next[id] === 0) delete next[id];
      return next;
    });

  const totalItems = Object.values(orderItems).reduce((a, b) => a + b, 0);
  const totalPrice = products.reduce(
    (sum, p) => sum + p.price * (orderItems[p.id] || 0),
    0,
  );

  // MENGIRIM PESANAN KE DAPUR
  const handleSubmit = async () => {
    if (totalItems === 0) return;
    if (!customerName.trim()) {
      alert('Mohon isi "Nama Anda" terlebih dahulu! ☕');
      return;
    }

    setIsSubmitting(true);
    const activeOrderedItems = products.filter(
      (item) => orderItems[item.id] > 0,
    );
    const detailPesanan = activeOrderedItems
      .map((item) => `${orderItems[item.id]}x ${item.name}`)
      .join(" & ");

    try {
      const { error } = await supabase.from("orders").insert([
        {
          description: `A/N [${customerName.toUpperCase()}] - ${detailPesanan}`,
          type: "IN",
          amount: totalPrice,
          status: "PENDING",
        },
      ]);
      if (error) throw error;
      alert("Pesanan berhasil dikirim ke dapur!");
      setOrderItems({});
      setCustomerName("");
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[url('/bg-rockopi.avif')] bg-cover bg-fixed bg-center flex flex-col font-sans">
      {/* Gambar Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative w-full max-w-lg mx-auto flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-14 right-0 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
              onClick={() => setPreviewImage(null)}
            >
              <X size={24} />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}

      {/* Konten Utama dari Figma */}
      <div className="flex-1 bg-[#07110a]/85 backdrop-blur-md p-4 md:p-6 pb-28 flex flex-col">
        <div className="max-w-4xl mx-auto w-full space-y-6">
          {/* HEADER (Mempertahankan identitas Rockopi) */}
          <header className="flex flex-col items-center text-center space-y-4 mb-2 pt-4">
            <img
              src="/rockopi.png"
              alt="Rockopi Est 2019"
              className="w-24 h-24 object-cover rounded-full shadow-2xl border-[3px] border-green-500/50"
            />
            <img
              src="/logo.png"
              alt="Logo Rockopi"
              className="h-8 object-contain drop-shadow-xl"
            />
            <p className="text-gray-400 font-medium text-xs">
              Pilih menu favoritmu, santai, dan nikmati harimu.
            </p>
          </header>

          {/* Form Nama */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl max-w-md mx-auto w-full">
            <label className="text-xs font-bold text-green-400 flex items-center gap-2 mb-2 uppercase tracking-widest">
              <UserCircle2 size={16} /> Nama Pemesan
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Contoh: Budi (Meja 4)"
              className="w-full bg-black/40 text-white font-bold px-4 py-3 rounded-xl border border-white/10 focus:border-green-400 outline-none transition-all text-sm placeholder-white/20"
              maxLength={25}
              required
            />
          </div>

          {/* Kategori UI Figma */}
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide justify-start md:justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border ${
                  activeCategory === cat
                    ? "bg-green-500 text-black border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                    : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Grid Menu UI Figma */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-green-400" size={32} />
              <p className="text-green-400/60 text-xs font-bold uppercase tracking-widest">
                Memuat Menu...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => {
                const qty = orderItems[p.id] || 0;
                return (
                  <div
                    key={p.id}
                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-green-400/30 transition-all group"
                  >
                    <div
                      className="h-32 bg-black/40 relative cursor-pointer overflow-hidden"
                      onClick={() => setPreviewImage(p.image_url)}
                    >
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <p className="text-white font-black text-sm">
                          {p.name}
                        </p>
                        <p className="text-green-400 font-bold text-xs">
                          Rp {p.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                      <p className="text-white/40 text-[10px] leading-relaxed line-clamp-2">
                        {p.description}
                      </p>
                      <div className="flex items-center justify-between bg-black/40 rounded-xl p-1.5 border border-white/5">
                        <button
                          onClick={() => handleDecrease(p.id)}
                          disabled={qty === 0}
                          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 transition-all"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-black text-sm w-8 text-center text-white">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleIncrease(p.id)}
                          className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500/30 transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-8">
            <PoweredByFooter />
          </div>
        </div>
      </div>

      {/* Floating Keranjang Belanja UI Figma */}
      {totalItems > 0 && (
        <div className="fixed bottom-5 left-0 right-0 px-4 z-50 animate-in slide-in-from-bottom-5">
          <div className="max-w-md mx-auto">
            <div
              className="flex items-center justify-between p-3 pr-2 rounded-2xl shadow-2xl border border-green-400/20"
              style={{
                background: "linear-gradient(135deg, #1B4332, #0f2318)",
              }}
            >
              <div className="flex items-center gap-3 ml-2">
                <div className="relative">
                  <ShoppingCart size={22} className="text-white" />
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-lg">
                    {totalItems}
                  </span>
                </div>
                <div>
                  <p className="text-green-300 text-[10px] font-bold uppercase tracking-wider">
                    Total Pesanan
                  </p>
                  <p className="text-white font-black text-sm">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-400 text-black px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-green-300 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Send size={14} /> Pesan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
