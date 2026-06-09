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

export const dynamic = "force-dynamic";

export default function CustomerOrderPage() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<{ [key: number]: number }>({});
  const [expandedDesc, setExpandedDesc] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [activeCategory, setActiveCategory] = useState("Hot Coffee");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const categories = ["Hot Coffee", "Iced Coffee", "Non Coffee"];

  // Ambil data menu secara live dari database Supabase
  const fetchMenuFromCloud = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      setMenuItems(data || []);
    } catch (err: any) {
      console.error("Gagal memuat menu:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuFromCloud();
  }, []);

  const handleIncrease = (id: number) => {
    setOrderItems((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleDecrease = (id: number) => {
    setOrderItems((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const toggleDescription = (id: number) => {
    setExpandedDesc((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalBarang = Object.values(orderItems).reduce((a, b) => a + b, 0);
  const totalHarga = menuItems.reduce((total, item) => {
    return total + item.price * (orderItems[item.id] || 0);
  }, 0);

  const handleSubmitOrder = async () => {
    if (totalBarang === 0) return;

    if (!customerName.trim()) {
      alert('Mohon isi "Nama Anda" terlebih dahulu! ☕');
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const activeOrderedItems = menuItems.filter(
      (item) => orderItems[item.id] > 0,
    );
    const detailPesanan = activeOrderedItems
      .map((item) => `${orderItems[item.id]}x ${item.name}`)
      .join(" & ");

    try {
      const { error: orderError } = await supabase.from("orders").insert([
        {
          description: `A/N [${customerName.toUpperCase()}] - ${detailPesanan}`,
          type: "IN",
          amount: totalHarga,
        },
      ]);

      if (orderError) throw orderError;

      const inventoryPayload = activeOrderedItems.map((item) => ({
        type: "OUT",
        name: item.name,
        qty: orderItems[item.id],
        unit: "cup",
        cost: 0,
        note: `Terjual ke A/N [${customerName.toUpperCase()}]`,
      }));

      const { error: inventoryError } = await supabase
        .from("inventory_logs")
        .insert(inventoryPayload);
      if (inventoryError) throw inventoryError;

      alert(`Pesanan Berhasil dikirim!`);
      setOrderItems({});
      setCustomerName("");
    } catch (err: any) {
      alert(`Terjadi kesalahan sistem: ${err.message}`);
    }
  };

  const filteredMenu = menuItems.filter(
    (item) => item.category === activeCategory,
  );

  return (
    <div className="min-h-screen bg-[url('/bg-rockopi.avif')] bg-cover bg-fixed bg-center flex flex-col">
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
              className="absolute -top-14 right-0 text-white bg-black/40 p-2 rounded-full"
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

      <div className="flex-1 bg-black/30 pb-16 p-4 md:p-8 pt-6 md:pt-12 flex flex-col">
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-10 w-full flex-1 flex flex-col">
          {/* HEADER DENGAN LOGO ROCKOPI */}
          <header className="flex flex-col items-center text-center space-y-4 md:space-y-6 mb-2 md:mb-6">
            <img
              src="/rockopi.png"
              alt="Rockopi Est 2019"
              className="w-28 h-28 md:w-40 md:h-40 object-cover rounded-full shadow-2xl border-[3px] md:border-4 border-[#1B4332] bg-transparent"
            />
            <div className="drop-shadow-md flex flex-col items-center px-2">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
                  Welcome to
                </h1>
                <img
                  src="/logo.png"
                  alt="Logo Text Rockopi"
                  className="h-6 md:h-10 object-contain drop-shadow-xl"
                />
              </div>
              <p className="text-gray-200 font-medium text-sm md:text-base">
                Pilih menu favoritmu, santai, dan nikmati harimu.
              </p>
            </div>
          </header>

          <div className="w-full max-w-md mx-auto px-2">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border-t-4 border-[#1B4332] flex flex-col gap-2">
              <label
                htmlFor="customerName"
                className="text-sm font-black text-gray-800 flex items-center gap-2"
              >
                <UserCircle2 size={18} className="text-[#1B4332]" /> Siapa Nama
                Anda?
              </label>
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contoh: Budi (Meja 4)"
                className="w-full bg-gray-50 text-gray-900 font-bold px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1B4332] focus:bg-white outline-none transition-all text-sm"
                maxLength={25}
                required
              />
            </div>
          </div>

          <div className="flex justify-start md:justify-center gap-3 overflow-x-auto pb-2 w-full scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap border transition-all ${
                  activeCategory === category
                    ? "bg-white text-[#1B4332] scale-105 shadow-md"
                    : "bg-black/50 text-gray-200 backdrop-blur-sm"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20 text-white gap-3">
              <Loader2 className="animate-spin" size={36} />
              <p className="text-sm font-medium animate-pulse">
                Menyiapkan menu spesial untukmu...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1">
              {filteredMenu.map((item) => {
                const qty = orderItems[item.id] || 0;
                const isExpanded = expandedDesc[item.id];
                const isLongText = item.description.length > 80;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full hover:-translate-y-1 transition-transform duration-300"
                  >
                    <div
                      className="h-36 overflow-hidden bg-gray-100 relative cursor-pointer group"
                      onClick={() => setPreviewImage(item.image_url)}
                    >
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-base text-[#1B4332] mb-1">
                        {item.name}
                      </h3>
                      <p
                        className={`text-xs text-gray-600 ${isExpanded ? "" : "line-clamp-2"}`}
                      >
                        {item.description}
                      </p>
                      {isLongText && (
                        <button
                          onClick={() => toggleDescription(item.id)}
                          className="text-[10px] font-bold text-[#1B4332] mt-1 self-start hover:text-green-700"
                        >
                          {isExpanded ? "Kurangi" : "Selengkapnya..."}
                        </button>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="font-bold text-sm text-gray-900">
                          Rp {item.price.toLocaleString("id-ID")}
                        </span>
                        <div className="flex items-center gap-2 bg-gray-50 border rounded-full p-1">
                          <button
                            onClick={() => handleDecrease(item.id)}
                            className="w-7 h-7 rounded-full bg-white flex items-center justify-center font-bold text-gray-600 shadow-sm active:bg-gray-200"
                            disabled={qty === 0}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-4 text-center font-bold text-xs select-none">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleIncrease(item.id)}
                            className="w-7 h-7 rounded-full bg-[#1B4332] flex items-center justify-center text-white shadow-sm active:bg-green-800"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="w-full pt-10">
            <PoweredByFooter />
          </div>
        </div>
      </div>

      {totalBarang > 0 && (
        <div className="fixed bottom-4 left-0 right-0 px-4 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="max-w-4xl mx-auto bg-[#1B4332] text-white rounded-2xl p-3 shadow-2xl flex items-center justify-between border border-green-800">
            <div className="flex items-center gap-3 ml-2">
              <ShoppingCart size={22} />
              <div className="flex flex-col">
                <span className="text-[10px] text-green-200">
                  Total Harga ({totalBarang} item)
                </span>
                <span className="font-bold text-base">
                  Rp {totalHarga.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
            <button
              onClick={handleSubmitOrder}
              className="bg-white text-[#1B4332] px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 active:scale-95 transition-transform"
            >
              Pesan Sekarang <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
