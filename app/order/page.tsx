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
  Sparkles,
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

  // State untuk animasi pop-up keranjang
  const [cartPop, setCartPop] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("products").select("*").order("id");
      if (data) setProducts(data);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  // FUNGSI GETARAN (Haptic Feedback) UNTUK HP MOBILE
  const vibrate = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50); // Getaran halus 50ms
    }
  };

  const triggerCartPop = () => {
    setCartPop(true);
    setTimeout(() => setCartPop(false), 300); // Reset animasi setelah 300ms
  };

  const handleIncrease = (id: number) => {
    vibrate();
    triggerCartPop();
    setOrderItems((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
  };

  const handleDecrease = (id: number) => {
    vibrate();
    triggerCartPop();
    setOrderItems((p) => {
      const next = { ...p, [id]: Math.max((p[id] || 0) - 1, 0) };
      if (next[id] === 0) delete next[id];
      return next;
    });
  };

  const totalItems = Object.values(orderItems).reduce((a, b) => a + b, 0);
  const totalPrice = products.reduce(
    (sum, p) => sum + p.price * (orderItems[p.id] || 0),
    0,
  );

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
      alert("Pesanan berhasil dikirim ke dapur! Silakan menuju kasir.");
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
    <div className="min-h-screen bg-[url('/bg-rockopi.avif')] bg-cover bg-fixed bg-center flex flex-col font-sans selection:bg-green-500/30">
      {/* Modal Preview Image (Dengan efek Zoom In yang lembut) */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07110a]/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative w-full max-w-lg mx-auto flex justify-center animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-14 right-0 text-white bg-white/10 hover:bg-white/20 hover:rotate-90 p-3 rounded-full transition-all duration-300 active:scale-75"
              onClick={() => setPreviewImage(null)}
            >
              <X size={24} />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="w-full max-h-[75vh] object-contain rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.1)] border border-white/10"
            />
          </div>
        </div>
      )}

      {/* Konten Utama */}
      <div className="flex-1 bg-gradient-to-b from-[#07110a]/80 to-[#07110a]/95 backdrop-blur-md p-4 md:p-6 pb-32 flex flex-col">
        <div className="max-w-4xl mx-auto w-full space-y-8">
          {/* HEADER (Floating Rockopi Logo) */}
          <header className="flex flex-col items-center text-center space-y-4 mb-2 pt-6">
            <div className="relative animate-float">
              <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
              <img
                src="/rockopi.png"
                alt="Rockopi Est 2019"
                className="relative w-24 h-24 object-cover rounded-full shadow-2xl border-[3px] border-green-400/40"
              />
            </div>
            <img
              src="/logo.png"
              alt="Logo Rockopi"
              className="h-8 object-contain drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            />
            <p className="text-white/60 font-medium text-xs flex items-center gap-2">
              <Sparkles size={14} className="text-green-400" /> Pilih menu
              favoritmu, santai, dan nikmati harimu.{" "}
              <Sparkles size={14} className="text-green-400" />
            </p>
          </header>

          {/* Form Nama (Glow saat difokuskan) */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-3xl shadow-xl max-w-md mx-auto w-full group focus-within:border-green-400/50 focus-within:shadow-[0_0_30px_rgba(34,197,94,0.15)] transition-all duration-500">
            <label className="text-xs font-bold text-green-400 flex items-center gap-2 mb-3 uppercase tracking-widest">
              <UserCircle2 size={18} /> Nama Pemesan
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Contoh: Budi (Meja 4)"
              className="w-full bg-black/40 text-white font-black px-5 py-3.5 rounded-2xl border border-white/10 focus:border-green-400 outline-none transition-all text-sm placeholder-white/20"
              maxLength={25}
              required
            />
          </div>

          {/* Kategori UI (Bouncy Tabs) */}
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide justify-start md:justify-center px-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-3 rounded-2xl font-black text-xs transition-all duration-300 active:scale-90 flex items-center gap-2 border ${
                  activeCategory === cat
                    ? "bg-green-500 text-black border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)] -translate-y-1"
                    : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Grid Menu UI (Floating Cards) */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-green-400" size={40} />
              <p className="text-green-400/60 text-xs font-bold uppercase tracking-widest animate-pulse">
                Menyiapkan Menu...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p) => {
                const qty = orderItems[p.id] || 0;
                return (
                  <div
                    key={p.id}
                    className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_-15px_rgba(34,197,94,0.3)] hover:border-green-400/30 group"
                  >
                    <div
                      className="h-36 bg-black/40 relative cursor-pointer overflow-hidden"
                      onClick={() => setPreviewImage(p.image_url)}
                    >
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07110a] via-[#07110a]/50 to-transparent" />
                      <div className="absolute bottom-3 left-4">
                        <p className="text-white font-black text-base tracking-wide">
                          {p.name}
                        </p>
                        <p className="text-green-400 font-bold text-sm mt-0.5">
                          Rp {p.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between gap-5">
                      <p className="text-white/50 text-[11px] leading-relaxed line-clamp-2 pr-2">
                        {p.description}
                      </p>

                      {/* Kontrol Kuantitas (Bouncy Buttons) */}
                      <div className="flex items-center justify-between bg-black/40 rounded-2xl p-1.5 border border-white/5 shadow-inner">
                        <button
                          onClick={() => handleDecrease(p.id)}
                          disabled={qty === 0}
                          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-red-500/20 hover:text-red-400 disabled:opacity-20 transition-all duration-200 active:scale-75"
                        >
                          <Minus size={16} />
                        </button>
                        <span
                          className={`font-black text-lg w-10 text-center transition-colors duration-200 ${qty > 0 ? "text-green-400" : "text-white"}`}
                        >
                          {qty}
                        </span>
                        <button
                          onClick={() => handleIncrease(p.id)}
                          className="w-10 h-10 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500 hover:text-black transition-all duration-200 active:scale-75 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                        >
                          <Plus size={16} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-8 opacity-60">
            <PoweredByFooter />
          </div>
        </div>
      </div>

      {/* Floating Keranjang Belanja (Glow & Pop Animation) */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-50 animate-in slide-in-from-bottom-10 duration-500 ease-out">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between p-3.5 pr-3 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-green-400/30 backdrop-blur-xl bg-[#0a1f16]/95">
              <div className="flex items-center gap-4 ml-3">
                <div className="relative">
                  {/* Ikon Keranjang yang akan membal (pop) saat item bertambah */}
                  <div
                    className={`transition-transform duration-300 ${cartPop ? "animate-pop text-green-400" : "text-white"}`}
                  >
                    <ShoppingCart size={26} />
                  </div>
                  <span
                    className={`absolute -top-2.5 -right-2.5 w-5 h-5 bg-green-500 text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.5)] ${cartPop ? "animate-pop" : ""}`}
                  >
                    {totalItems}
                  </span>
                </div>
                <div>
                  <p className="text-green-400/60 text-[10px] font-black uppercase tracking-widest">
                    Total Pesanan
                  </p>
                  <p className="text-white font-black text-base tracking-wide">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-500 text-black px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-green-400 active:scale-90 transition-all duration-300 disabled:opacity-50 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Send size={16} /> PESAN
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
