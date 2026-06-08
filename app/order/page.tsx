"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Send, X } from "lucide-react";
import { supabase } from "../../lib/supabase"; // Import koneksi database cloud

const mockMenu = [
  // --- HOT COFFEE ---
  {
    id: 1,
    category: "Hot Coffee",
    name: "Hot Coffee Milk",
    price: 20000,
    description:
      "Kopi susu panas klasik dengan perpaduan espresso dan susu segar yang lembut.\n\nClassic hot milk coffee with a smooth blend of espresso and fresh milk.",
    imageUrl: "/Hot Menu.avif",
  },
  {
    id: 2,
    category: "Hot Coffee",
    name: "Hot Rockopi ⭐",
    price: 25000,
    description:
      "Signature kami. Paduan rahasia kopi pekat dan rasa manis karamel bernuansa nusantara.\n\nOur signature. A secret blend of bold coffee and archipelago-style caramel sweetness.",
    imageUrl: "/Hot Menu.avif",
  },
  {
    id: 3,
    category: "Hot Coffee",
    name: "Hot Americano",
    price: 20000,
    description:
      "Ekstraksi espresso murni yang diseduh sempurna dengan air panas. Bold dan mantap.\n\nPure espresso extraction perfectly brewed with hot water. Bold and steady.",
    imageUrl: "/Hot Menu.avif",
  },
  {
    id: 4,
    category: "Hot Coffee",
    name: "Cappucinno",
    price: 25000,
    description:
      "Kopi dengan rasio seimbang antara espresso, susu panas, dan busa susu tebal di atasnya.\n\nA balanced ratio of espresso, steamed milk, and thick milk foam on top.",
    imageUrl: "/Hot Menu.avif",
  },
  {
    id: 5,
    category: "Hot Coffee",
    name: "V60 Coffee",
    price: 25000,
    description:
      "Seduhan manual V60 yang menghasilkan notes rasa kopi yang bersih, ringan, dan aromatik.\n\nManual V60 brew delivering clean, light, and aromatic coffee tasting notes.",
    imageUrl: "/Hot Menu.avif",
  },
  {
    id: 6,
    category: "Hot Coffee",
    name: "Vietnam Drip",
    price: 25000,
    description:
      "Kopi pekat ala Vietnam yang menetes perlahan ke dalam kental manis. Manis dan kuat!\n\nStrong Vietnamese-style coffee dripping slowly into sweetened condensed milk. Sweet and bold!",
    imageUrl: "/Hot Menu.avif",
  },

  // --- ICED COFFEE ---
  {
    id: 7,
    category: "Iced Coffee",
    name: "Iced Rockopi ⭐",
    price: 25000,
    description:
      "Es kopi susu andalan Rockopi. Segar, creamy, dengan rasa kopi yang nendang banget!\n\nRockopi's flagship iced milk coffee. Refreshing, creamy, with a real coffee kick!",
    imageUrl: "/Iced Rockopi.avif",
  },
  {
    id: 8,
    category: "Iced Coffee",
    name: "Brown Sugar Rockopi",
    price: 25000,
    description:
      "Es kopi susu dengan manisnya gula aren asli kualitas premium. Sangat menyegarkan.\n\nIced milk coffee with the sweetness of premium quality palm sugar. Highly refreshing.",
    imageUrl: "/Brown Sugar.avif",
  },
  {
    id: 9,
    category: "Iced Coffee",
    name: "Iced Americano",
    price: 25000,
    description:
      "Es kopi hitam murni tanpa gula. Pilihan tepat untuk penyegar di cuaca panas.\n\nPure iced black coffee with no sugar. The perfect refresher for hot weather.",
    imageUrl: "/Iced Americano.avif",
  },
  {
    id: 10,
    category: "Iced Coffee",
    name: "Pandan Iced Coffee",
    price: 28000,
    description:
      "Kopi susu dingin dengan sentuhan sirup pandan yang wangi dan eksotis khas Asia.\n\nCold milk coffee with a touch of fragrant and exotic Asian pandan syrup.",
    imageUrl: "/Iced Pandan Coffee.avif",
  },
  {
    id: 11,
    category: "Iced Coffee",
    name: "Banana Iced Coffee",
    price: 28000,
    description:
      "Unik! Sensasi es kopi susu berpadu dengan manis dan wanginya buah pisang.\n\nUnique! The sensation of iced milk coffee blended with the sweet fragrance of banana.",
    imageUrl: "/Banana Iced Coffee.avif",
  },
  {
    id: 12,
    category: "Iced Coffee",
    name: "Butterscotch Iced Coffee",
    price: 30000,
    description:
      "Kopi dingin dengan sirup butterscotch yang legit, manis, dan buttery.\n\nCold coffee with rich, sweet, and buttery butterscotch syrup.",
    imageUrl: "/Butterscotch.avif",
  },
  {
    id: 13,
    category: "Iced Coffee",
    name: "Caramel Macchiato ⭐",
    price: 30000,
    description:
      "Paduan es, susu, vanilla, espresso, dengan siraman saus karamel lumer di atasnya.\n\nA blend of ice, milk, vanilla, espresso, topped with melting caramel sauce.",
    imageUrl: "/Caramel Macchiato.avif",
  },
  {
    id: 14,
    category: "Iced Coffee",
    name: "Japanese Iced Coffee",
    price: 30000,
    description:
      "Seduhan filter yang langsung diteteskan ke atas es batu. Karakter rasa cerah dan fruity.\n\nFilter brew dripped directly onto ice cubes. Bright and fruity flavor profile.",
    imageUrl: "/Iced Americano.avif",
  },
  {
    id: 15,
    category: "Iced Coffee",
    name: "Iced Hazelnut Latte",
    price: 30000,
    description:
      "Es latte klasik dengan sentuhan sirup hazelnut yang nutty dan menenangkan.\n\nClassic iced latte with a nutty and soothing touch of hazelnut syrup.",
    imageUrl: "/Caramel Macchiato.avif",
  },

  // --- NON COFFEE ---
  {
    id: 16,
    category: "Non Coffee",
    name: "Hot Chocolate ⭐",
    price: 25000,
    description:
      "Cokelat panas premium yang tebal dan memanjakan lidah. Cocok untuk mood booster.\n\nThick and pampering premium hot chocolate. Perfect for a mood booster.",
    imageUrl: "/Hot Menu.avif",
  },
  {
    id: 17,
    category: "Non Coffee",
    name: "Iced Chocolate ⭐",
    price: 28000,
    description:
      "Cokelat dingin spesial Rockopi. Manisnya pas, cokelatnya sangat terasa!\n\nRockopi's special iced chocolate. Perfectly sweet, extremely chocolatey!",
    imageUrl: "/Iced Chocolate.avif",
  },
  {
    id: 18,
    category: "Non Coffee",
    name: "Hot Matcha",
    price: 28000,
    description:
      "Teh hijau matcha Jepang otentik diseduh hangat bersama susu.\n\nAuthentic Japanese matcha green tea brewed warm with milk.",
    imageUrl: "/Hot Menu.avif",
  },
  {
    id: 19,
    category: "Non Coffee",
    name: "Iced Matcha",
    price: 30000,
    description:
      "Es matcha latte ala Jepang yang manis, wangi, dan menyejukkan hati.\n\nSweet, fragrant, and soothing Japanese-style iced matcha latte.",
    imageUrl: "/Iced Matcha.avif",
  },
  {
    id: 20,
    category: "Non Coffee",
    name: "Hot Taro",
    price: 28000,
    description:
      "Minuman hangat rasa talas ungu yang legit, creamy, dan sangat comforting.\n\nWarm purple yam drink that is sweet, creamy, and deeply comforting.",
    imageUrl: "/Hot Menu.avif",
  },
  {
    id: 21,
    category: "Non Coffee",
    name: "Iced Taro",
    price: 30000,
    description:
      "Es taro manis yang lembut dan segar, favorit untuk yang tidak minum kopi.\n\nSmooth and refreshing sweet iced taro, a favorite for non-coffee drinkers.",
    imageUrl: "/Iced Vanilla.avif",
  },
  {
    id: 22,
    category: "Non Coffee",
    name: "Hot Vanilla",
    price: 25000,
    description:
      "Susu panas dengan ekstrak vanilla alami. Sangat menenangkan diminum sore hari.\n\nHot milk with natural vanilla extract. Very soothing to drink in the afternoon.",
    imageUrl: "/Hot Menu.avif",
  },
  {
    id: 23,
    category: "Non Coffee",
    name: "Iced Vanilla",
    price: 28000,
    description:
      "Kesegaran susu dingin dan vanilla manis yang simpel namun bikin nagih.\n\nThe simple yet addictive freshness of cold milk and sweet vanilla.",
    imageUrl: "/Iced Vanilla.avif",
  },
  {
    id: 24,
    category: "Non Coffee",
    name: "Hot Lemon Tea",
    price: 20000,
    description:
      "Seduhan teh hitam hangat dengan perasan lemon asli. Menghangatkan tenggorokan.\n\nWarm brewed black tea with real lemon squeeze. Warms the throat.",
    imageUrl: "/Hot Menu.avif",
  },
  {
    id: 25,
    category: "Non Coffee",
    name: "Iced Lemon Tea",
    price: 23000,
    description:
      "Es teh lemon klasik, pelepas dahaga nomor satu setelah lelah beraktivitas.\n\nClassic iced lemon tea, the number one thirst quencher after a tiring day.",
    imageUrl: "/Iced Lemon Tea.avif",
  },
];

export default function CustomerOrderPage() {
  const [orderItems, setOrderItems] = useState<{ [key: number]: number }>({});
  const [expandedDesc, setExpandedDesc] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [activeCategory, setActiveCategory] = useState("Hot Coffee");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  // LOGIKA BARU: Kirim pesanan ke database cloud Supabase
  const handleSubmitOrder = async () => {
    if (totalBarang === 0) return;

    const detailPesanan = mockMenu
      .filter((item) => orderItems[item.id] > 0)
      .map((item) => `${orderItems[item.id]}x ${item.name}`)
      .join(" & ");

    // Jalankan query Insert ke cloud database
    const { error } = await supabase.from("orders").insert([
      {
        description: `Pesanan Pelanggan: ${detailPesanan}`,
        type: "IN",
        amount: totalHarga,
      },
    ]);

    if (error) {
      alert(`Terjadi kesalahan database: ${error.message}`);
    } else {
      alert(
        `Pesanan Berhasil Dibuat!\nTotal Item: ${totalBarang}\nTotal Bayar: Rp ${totalHarga.toLocaleString("id-ID")}`,
      );
      setOrderItems({});
    }
  };

  const filteredMenu = mockMenu.filter(
    (item) => item.category === activeCategory,
  );

  return (
    <div className="min-h-screen bg-[url('/bg-rockopi.avif')] bg-cover bg-fixed bg-center">
      {/* --- MODAL PREVIEW GAMBAR --- */}
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
              className="absolute -top-14 md:-top-10 right-0 text-white hover:text-white transition-colors bg-black/40 p-2 rounded-full backdrop-blur-md"
              onClick={() => setPreviewImage(null)}
            >
              <X size={24} />
            </button>
            <img
              src={previewImage}
              alt="Preview Menu"
              className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border-2 border-white/20"
            />
          </div>
        </div>
      )}

      {/* Kontainer Utama */}
      <div className="min-h-screen bg-black/30 pb-36 p-4 md:p-8 pt-6 md:pt-12">
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-10">
          <header className="flex flex-col items-center text-center space-y-4 md:space-y-6 mb-4 md:mb-8">
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

          {/* TAB KATEGORI RESPONSIF */}
          <div className="flex justify-start md:justify-center gap-3 mb-6 overflow-x-auto pb-4 pt-2 px-4 snap-x scrollbar-hide w-full">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 snap-center px-5 py-2.5 md:px-6 md:py-2.5 rounded-full font-bold text-sm md:text-base whitespace-nowrap transition-all duration-200 shadow-lg border border-white/10 ${
                  activeCategory === category
                    ? "bg-white text-[#1B4332] transform scale-105"
                    : "bg-black/50 text-gray-200 hover:bg-black/70 backdrop-blur-md"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* DAFTAR MENU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredMenu.map((item) => {
              const qty = orderItems[item.id] || 0;
              const isExpanded = expandedDesc[item.id];
              const isLongText = item.description.length > 80;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-xl border-none overflow-hidden flex flex-col transition-transform active:scale-[0.98] md:hover:-translate-y-1 md:hover:shadow-2xl"
                >
                  <div
                    className="h-36 md:h-40 overflow-hidden bg-gray-100 relative group cursor-pointer"
                    onClick={() => setPreviewImage(item.imageUrl)}
                  >
                    <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold text-[#1B4332] shadow-sm z-10">
                      {item.category}
                    </div>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover md:group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-4 md:p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-base md:text-lg leading-tight mb-1 md:mb-2 text-[#1B4332]">
                      {item.name}
                    </h3>
                    <div className="mb-4">
                      <p
                        className={`text-xs md:text-sm text-gray-600 whitespace-pre-line transition-all ${isExpanded ? "" : "line-clamp-2 md:line-clamp-3"}`}
                      >
                        {item.description}
                      </p>
                      {isLongText && (
                        <button
                          onClick={() => toggleDescription(item.id)}
                          className="text-[10px] md:text-xs font-bold text-[#1B4332] mt-1 md:mt-2 hover:text-green-700 transition-colors"
                        >
                          {isExpanded ? "Show less" : "Read more..."}
                        </button>
                      )}
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="font-bold text-sm md:text-base text-gray-900">
                        Rp {item.price.toLocaleString("id-ID")}
                      </span>
                      <div className="flex items-center gap-1.5 md:gap-2 bg-gray-50 border border-gray-200 rounded-full p-1">
                        <button
                          onClick={() => handleDecrease(item.id)}
                          className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center text-gray-600 shadow-sm active:bg-gray-100 transition-colors"
                          disabled={qty === 0}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-4 text-center font-bold text-xs md:text-sm select-none">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleIncrease(item.id)}
                          className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#1B4332] flex items-center justify-center text-white shadow-sm active:bg-green-800 transition-colors"
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
        </div>
      </div>

      {/* FLOATING CHECKOUT BUTTON */}
      {totalBarang > 0 && (
        <div className="fixed bottom-4 md:bottom-6 left-0 right-0 px-3 md:px-0 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1B4332] text-white rounded-2xl p-3 md:p-4 shadow-2xl border border-green-800 flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4 ml-1">
                <div className="relative">
                  <ShoppingCart size={22} className="md:w-6 md:h-6" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] md:text-xs font-bold w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full shadow-sm">
                    {totalBarang}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] md:text-xs text-green-200 leading-tight">
                    Total Harga
                  </span>
                  <span className="font-bold text-base md:text-lg leading-tight">
                    Rp {totalHarga.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
              <button
                onClick={handleSubmitOrder}
                className="flex items-center gap-1.5 md:gap-2 bg-white text-[#1B4332] px-4 py-2 md:px-6 md:py-2.5 rounded-xl text-sm md:text-base font-bold active:bg-gray-200 transition-transform active:scale-95 shadow-sm"
              >
                Pesan <Send size={16} className="md:w-[18px] md:h-[18px]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
