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
  Coffee,
  Snowflake,
  Leaf,
  ChevronUp,
  Receipt,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import PoweredByFooter from "../../components/PoweredByFooter";

// Menggunakan Ikon Vektor Putih Polos
const CATEGORY_TABS = [
  { id: "Hot Coffee", label: "Hot Coffee", icon: Coffee },
  { id: "Iced Coffee", label: "Iced Coffee", icon: Snowflake },
  { id: "Non Coffee", label: "Non Coffee", icon: Leaf },
];

export default function OrderPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<Record<number, number>>({});
  const [activeCategory, setActiveCategory] = useState("Hot Coffee");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [cartPop, setCartPop] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // State untuk Modal Keranjang

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("products").select("*").order("id");
      if (data) setProducts(data);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  const totalItems = Object.values(orderItems).reduce((a, b) => a + b, 0);
  const totalPrice = products.reduce(
    (sum, p) => sum + p.price * (orderItems[p.id] || 0),
    0,
  );

  // Otomatis menutup modal jika keranjang tiba-tiba kosong
  useEffect(() => {
    if (totalItems === 0) setIsCartOpen(false);
  }, [totalItems]);

  const vibrate = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate)
      navigator.vibrate(50);
  };

  const triggerCartPop = () => {
    setCartPop(true);
    setTimeout(() => setCartPop(false), 300);
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

  const handleSubmit = async () => {
    if (totalItems === 0) return;
    if (!customerName.trim()) {
      alert('Mohon isi "Nama Pemesan" di atas terlebih dahulu ya! ☕');
      setIsCartOpen(false); // Tutup modal jika lupa isi nama
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
      alert(
        "Pesanan berhasil dikirim ke dapur! Silakan menuju kasir untuk pembayaran.",
      );
      setOrderItems({});
      setCustomerName("");
      setIsCartOpen(false);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[url('/bg-rockopi.avif')] bg-cover bg-fixed bg-center flex flex-col font-sans selection:bg-green-500/30">
      {/* Gambar Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#07110a]/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
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

      {/* MODAL KERANJANG (Bottom Sheet) */}
      {isCartOpen && totalItems > 0 && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-300"
          onClick={() => setIsCartOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#0a1f16] border border-green-400/20 rounded-t-[2rem] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5 relative">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full sm:hidden" />
              <h3 className="text-white font-black flex items-center gap-2 mt-2 sm:mt-0">
                <Receipt size={18} className="text-green-400" /> Rincian Pesanan
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-white/50 hover:text-white bg-white/5 p-2 rounded-full mt-2 sm:mt-0 transition-colors active:scale-90"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5 scrollbar-hide">
              {products
                .filter((p) => orderItems[p.id] > 0)
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5"
                  >
                    <div className="flex-1 pr-4">
                      <p className="text-white font-bold text-sm leading-tight mb-1">
                        {p.name}
                      </p>
                      <p className="text-green-400 font-bold text-xs">
                        Rp {p.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 bg-black/40 rounded-xl p-1.5 border border-white/5">
                      <button
                        onClick={() => handleDecrease(p.id)}
                        className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-red-400 active:scale-75 transition-all"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-white font-black text-sm w-4 text-center">
                        {orderItems[p.id]}
                      </span>
                      <button
                        onClick={() => handleIncrease(p.id)}
                        className="w-8 h-8 flex items-center justify-center text-green-400 hover:text-green-300 active:scale-75 transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="p-5 border-t border-white/10 bg-black/20 pb-8 sm:pb-5">
              <div className="flex justify-between items-center mb-5">
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
                  Total Bayar
                </span>
                <span className="text-white font-black text-xl">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-green-500 text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-green-400 active:scale-95 transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.2)] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Send size={18} /> Kirim ke Dapur
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Konten Utama Menu */}
      <div className="flex-1 bg-gradient-to-b from-[#07110a]/80 to-[#07110a]/95 backdrop-blur-md p-4 md:p-6 pb-36 flex flex-col">
        <div className="max-w-4xl mx-auto w-full space-y-8">
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
            <p className="text-white/60 font-medium text-xs flex items-center gap-2 tracking-wide">
              <Sparkles size={14} className="text-green-400" /> Pilih menu
              favoritmu, santai, dan nikmati harimu.{" "}
              <Sparkles size={14} className="text-green-400" />
            </p>
          </header>

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-3xl shadow-xl max-w-md mx-auto w-full group focus-within:border-green-400/50 focus-within:shadow-[0_0_30px_rgba(34,197,94,0.15)] transition-all duration-500">
            <label className="text-xs font-black text-green-400 flex items-center gap-2 mb-3 uppercase tracking-widest">
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

          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide justify-start md:justify-center px-1">
            {CATEGORY_TABS.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`whitespace-nowrap px-6 py-3.5 rounded-2xl font-black text-xs transition-all duration-300 active:scale-95 flex items-center gap-2 border ${
                    isActive
                      ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] -translate-y-1"
                      : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon
                    size={16}
                    strokeWidth={isActive ? 3 : 2}
                    className={isActive ? "text-black" : "text-white"}
                  />
                  {cat.label}
                </button>
              );
            })}
          </div>

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
                      className="h-40 bg-black/40 relative cursor-pointer overflow-hidden"
                      onClick={() => setPreviewImage(p.image_url)}
                    >
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07110a] via-[#07110a]/50 to-transparent" />
                      <div className="absolute bottom-3 left-4">
                        <p className="text-white font-black text-lg tracking-wide">
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

      {/* Tombol Melayang Pemicu Modal (Clickable Cart UX) */}
      {totalItems > 0 && !isCartOpen && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-50 animate-in slide-in-from-bottom-10 duration-500 ease-out">
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full flex items-center justify-between p-4 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-green-400/30 backdrop-blur-xl bg-[#0a1f16]/95 hover:bg-[#0a1f16] hover:border-green-400/60 active:scale-[0.98] transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 ml-2">
                <div className="relative">
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
                <div className="text-left flex flex-col justify-center">
                  <p className="text-green-400/80 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    Keranjang{" "}
                    <ChevronUp
                      size={12}
                      className="group-hover:-translate-y-1 transition-transform"
                    />
                  </p>
                  <p className="text-white font-black text-lg tracking-wide leading-tight">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="bg-green-500 text-black px-5 py-2.5 rounded-2xl text-xs font-black flex items-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                Cek Detail
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
