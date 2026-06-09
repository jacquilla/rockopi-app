"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Send, X, UserCircle2 } from "lucide-react";
import { supabase } from "../../lib/supabase"; // Ingat aturan ../../ chat ini!
// IMPOR KOMPONEN BARU
import PoweredByFooter from "../../components/PoweredByFooter";

const mockMenu = [
  // --- HOT COFFEE ---
  {
    id: 1,
    category: "Hot Coffee",
    name: "Hot Coffee Milk",
    price: 20000,
    description:
      "Kopi susu panas klasik dengan perpaduan espresso dan susu segar yang lembut.",
    imageUrl: "/Hot Menu.avif",
  },
  {
    id: 2,
    category: "Hot Coffee",
    name: "Hot Rockopi ⭐",
    price: 25000,
    description:
      "Signature kami. Paduan rahasia kopi pekat dan rasa manis karamel bernuansa nusantara.",
    imageUrl: "/Hot Menu.avif",
  },
  {
    id: 3,
    category: "Hot Coffee",
    name: "Hot Americano",
    price: 20000,
    description:
      "Ekstraksi espresso murni yang diseduh sempurna dengan air panas. Bold dan mantap.",
    imageUrl: "/Hot Menu.avif",
  },
  {
    id: 4,
    category: "Hot Coffee",
    name: "Cappucinno",
    price: 25000,
    description:
      "Kopi dengan rasio seimbang antara espresso, susu panas, dan busa susu tebal di atasnya.",
    imageUrl: "/Hot Menu.avif",
  },
  {
    id: 5,
    category: "Hot Coffee",
    name: "V60 Coffee",
    price: 25000,
    description:
      "Seduhan manual V60 yang menghasilkan notes rasa kopi yang bersih, ringan, dan aromatik.",
    imageUrl: "/Hot Menu.avif",
  },
  {
    id: 6,
    category: "Hot Coffee",
    name: "Vietnam Drip",
    price: 25000,
    description:
      "Kopi pekat ala Vietnam yang menetes perlahan ke dalam kental manis. Manis dan kuat!",
    imageUrl: "/Hot Menu.avif",
  },

  // --- ICED COFFEE ---
  {
    id: 7,
    category: "Iced Coffee",
    name: "Iced Rockopi ⭐",
    price: 25000,
    description:
      "Es kopi susu andalan Rockopi. Segar, creamy, dengan rasa kopi yang nendang banget!",
    imageUrl: "/Iced Rockopi.avif",
  },
  {
    id: 8,
    category: "Iced Coffee",
    name: "Brown Sugar Rockopi",
    price: 25000,
    description:
      "Es kopi susu dengan manisnya gula aren asli kualitas premium. Sangat menyegarkan.",
    imageUrl: "/Brown Sugar.avif",
  },
  {
    id: 9,
    category: "Iced Coffee",
    name: "Iced Americano",
    price: 25000,
    description:
      "Es kopi hitam murni tanpa gula. Pilihan tepat untuk penyegar di cuaca panas.",
    imageUrl: "/Iced Americano.avif",
  },
  {
    id: 10,
    category: "Iced Coffee",
    name: "Pandan Iced Coffee",
    price: 28000,
    description:
      "Kopi susu dingin dengan sentuhan sirup pandan yang wangi dan eksotis khas Asia.",
    imageUrl: "/Iced Pandan Coffee.avif",
  },
  {
    id: 11,
    category: "Iced Coffee",
    name: "Banana Iced Coffee",
    price: 28000,
    description:
      "Unik! Sensasi es kopi susu berpadu dengan manis dan wanginya buah pisang.",
    imageUrl: "/Banana Iced Coffee.avif",
  },
  {
    id: 12,
    category: "Iced Coffee",
    name: "Butterscotch Iced Coffee",
    price: 30000,
    description:
      "Kopi dingin dengan sirup butterscotch yang legit, manis, dan buttery.",
    imageUrl: "/Butterscotch.avif",
  },
  {
    id: 13,
    category: "Iced Coffee",
    name: "Caramel Macchiato ⭐",
    price: 30000,
    description:
      "Paduan es, susu, vanilla, espresso, dengan siraman saus karamel lumer di atasnya.",
    imageUrl: "/Caramel Macchiato.avif",
  },
  {
    id: 14,
    category: "Iced Coffee",
    name: "Japanese Iced Coffee",
    price: 30000,
    description:
      "Seduhan filter yang langsung diteteskan ke atas es batu. Karakter rasa cerah dan fruity.",
    imageUrl: "/Iced Americano.avif",
  },
  {
    id: 15,
    category: "Iced Coffee",
    name: "Iced Hazelnut Latte",
    price: 30000,
    description:
      "Es latte klasik dengan sentuhan sirup hazelnut yang nutty dan menenangkan.",
    imageUrl: "/Caramel Macchiato.avif",
  },

  // --- NON COFFEE ---
  {
    id: 16,
    category: "Non Coffee",
    name: "Hot Chocolate ⭐",
    price: 25000,
    description:
      "Cokelat panas premium yang tebal dan memanjakan lidah. Cocok untuk mood booster.",
    imageUrl: "/Hot Menu.avif",
  },
  {
    id: 17,
    category: "Non Coffee",
    name: "Iced Chocolate ⭐",
    price: 28000,
    description:
      "Cokelat dingin spesial Rockopi. Manisnya pas, cokelatnya sangat terasa!",
    imageUrl: "/Iced Chocolate.avif",
  },
  {
    id: 18,
    category: "Non Coffee",
    name: "Hot Matcha",
    price: 28000,
    description: "Teh hijau matcha Jepang otentik diseduh hangat bersama susu.",
    imageUrl: "/Hot Menu.avif",
  },
  {
    id: 19,
    category: "Non Coffee",
    name: "Iced Matcha",
    price: 30000,
    description:
      "Es matcha latte ala Jepang yang manis, wangi, dan menyejukkan hati.",
    imageUrl: "/Iced Matcha.avif",
  },
  {
    id: 20,
    category: "Non Coffee",
    name: "Hot Taro",
    price: 28000,
    description:
      "Minuman hangat rasa talas ungu yang legit, creamy, dan sangat comforting.",
    imageUrl: "/Hot Menu.avif",
  },
  {
    id: 21,
    category: "Non Coffee",
    name: "Iced Taro",
    price: 30000,
    description:
      "Es taro manis yang lembut dan segar, favorit untuk yang tidak minum kopi.",
    imageUrl: "/Iced Vanilla.avif",
  },
  {
    id: 22,
    category: "Non Coffee",
    name: "Hot Vanilla",
    price: 25000,
    description:
      "Susu panas dengan ekstrak vanilla alami. Sangat menenangkan dimasum sore hari.",
    imageUrl: "/Hot Menu.avif",
  },
  {
    id: 23,
    category: "Non Coffee",
    name: "Iced Vanilla",
    price: 28000,
    description:
      "Kesegaran susu dingin dan vanilla manis yang simpel namun bikin nagih.",
    imageUrl: "/Iced Vanilla.avif",
  },
  {
    id: 24,
    category: "Non Coffee",
    name: "Hot Lemon Tea",
    price: 20000,
    description:
      "Seduhan teh hitam hangat dengan perasan lemon asli. Menghangatkan tenggorokan.",
    imageUrl: "/Hot Menu.avif",
  },
  {
    id: 25,
    category: "Non Coffee",
    name: "Iced Lemon Tea",
    price: 23000,
    description:
      "Es teh lemon klasik, pelepas dahaga nomor satu setelah lelah beraktivitas.",
    imageUrl: "/Iced Lemon Tea.avif",
  },
];

export const dynamic = "force-dynamic";

export default function CustomerOrderPage() {
  const [orderItems, setOrderItems] = useState<{ [key: number]: number }>({});
  const [expandedDesc, setExpandedDesc] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [activeCategory, setActiveCategory] = useState("Hot Coffee");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");

  const categories = ["Hot Coffee", "Iced Coffee", "Non Coffee"];

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
  const totalHarga = mockMenu.reduce((total, item) => {
    return total + item.price * (orderItems[item.id] || 0);
  }, 0);

  const handleSubmitOrder = async () => {
    if (totalBarang === 0) return;

    if (!customerName.trim()) {
      alert(
        'Mohon isi "Nama Anda" terlebih dahulu agar barista kami mudah memanggil pesanan Anda! ☕',
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const activeOrderedItems = mockMenu.filter(
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

      alert(
        `Pesanan Berhasil!\n\nAtas Nama: ${customerName.toUpperCase()}\nTotal Item: ${totalBarang}\nTotal Bayar: Rp ${totalHarga.toLocaleString("id-ID")}\n\nStok otomatis terpotong di database.`,
      );
      setOrderItems({});
      setCustomerName("");
    } catch (err: any) {
      alert(`Terjadi kesalahan sistem: ${err.message}`);
    }
  };

  const filteredMenu = mockMenu.filter(
    (item) => item.category === activeCategory,
  );

  return (
    <div className="min-h-screen bg-[url('/bg-rockopi.avif')] bg-cover bg-fixed bg-center flex flex-col">
      {previewImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative w-full max-w-lg mx-auto flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-14 right-0 text-white bg-black/40 p-2 rounded-full backdrop-blur-md"
              onClick={() => setPreviewImage(null)}
            >
              <X size={24} />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border-2 border-white/20"
            />
          </div>
        </div>
      )}

      {/* Kontainer Overlay Transparan */}
      <div className="flex-1 bg-black/30 pb-16 p-4 md:p-8 pt-6 md:pt-12 flex flex-col">
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-10 w-full flex-1 flex flex-col">
          <header className="flex flex-col items-center text-center space-y-4 mb-2">
            <img
              src="/rockopi.png"
              alt="Rockopi Logo"
              className="w-28 h-28 md:w-40 md:h-40 object-cover rounded-full shadow-2xl border-[3px] border-[#1B4332]"
            />
            <div className="drop-shadow-md flex flex-col items-center">
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-1">
                Welcome to Rockopi App
              </h1>
              <p className="text-gray-200 text-sm">
                Pilih menu favoritmu, santai, dan nikmati harimu.
              </p>
            </div>
          </header>

          {/* INPUT NAMA */}
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

          {/* TAB KATEGORI */}
          <div className="flex justify-start md:justify-center gap-3 overflow-x-auto pb-2 w-full">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap border ${
                  activeCategory === category
                    ? "bg-white text-[#1B4332]"
                    : "bg-black/50 text-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* LIST MENU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1">
            {filteredMenu.map((item) => {
              const qty = orderItems[item.id] || 0;
              const isExpanded = expandedDesc[item.id];
              const isLongText = item.description.length > 80;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full"
                >
                  <div
                    className="h-36 overflow-hidden bg-gray-100 relative cursor-pointer"
                    onClick={() => setPreviewImage(item.imageUrl)}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
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
                        className="text-[10px] font-bold text-[#1B4332] mt-1 self-start hover:text-green-800"
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
                          className="w-7 h-7 rounded-full bg-white flex items-center justify-center font-bold text-gray-600 shadow-sm active:bg-gray-100"
                          disabled={qty === 0}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-4 text-center font-bold text-xs select-none">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleIncrease(item.id)}
                          className="w-7 h-7 rounded-full bg-[#1B4332] flex items-center justify-center text-white shadow-sm active:bg-green-900"
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

          {/* PASANG FOOTER DI BAGIAN BAWAH KONTEN ORDER */}
          <div className="w-full pt-10">
            <PoweredByFooter />
          </div>
        </div>
      </div>

      {/* FLOATING BOTTON */}
      {totalBarang > 0 && (
        <div className="fixed bottom-4 left-0 right-0 px-4 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="max-w-4xl mx-auto bg-[#1B4332] text-white rounded-2xl p-3 shadow-2xl flex items-center justify-between border border-green-800">
            <div className="flex items-center gap-3 ml-2">
              <ShoppingCart size={22} />
              <div className="flex flex-col">
                <span className="text-[10px] text-green-200">
                  Total Harga ({totalBarang} item)
                </span>
                <span className="font-bold text-base whitespace-nowrap">
                  Rp {totalHarga.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
            <button
              onClick={handleSubmitOrder}
              className="bg-white text-[#1B4332] px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 whitespace-nowrap active:bg-gray-100 transition-colors"
            >
              Pesan Sekarang <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
