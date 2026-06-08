"use client";

import { Package, Plus, Coffee, IceCream, Utensils } from "lucide-react";

const currentProducts = [
  {
    id: 1,
    name: "Hot Rockopi ⭐",
    category: "Hot Coffee",
    price: 25000,
    status: "Aktif",
  },
  {
    id: 2,
    name: "Iced Rockopi ⭐",
    category: "Iced Coffee",
    price: 25000,
    status: "Aktif",
  },
  {
    id: 3,
    name: "Brown Sugar Rockopi",
    category: "Iced Coffee",
    price: 25000,
    status: "Aktif",
  },
  {
    id: 4,
    name: "Hot Chocolate ⭐",
    category: "Non Coffee",
    price: 25000,
    status: "Aktif",
  },
  {
    id: 5,
    name: "Iced Matcha",
    category: "Non Coffee",
    price: 30000,
    status: "Aktif",
  },
];

export default function ProductsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* HEADER UTAMA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <header className="flex items-center gap-3">
          <div className="p-3 bg-white/80 backdrop-blur-sm text-[#1B4332] rounded-lg shadow-sm border border-white/50">
            <Package size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 drop-shadow-sm">
              Master Produk
            </h2>
            <p className="text-gray-700 font-medium">
              Kelola daftar menu dan harga jual cafe.
            </p>
          </div>
        </header>

        <button className="w-full sm:w-auto bg-[#1B4332] hover:bg-green-900 text-white font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 text-sm">
          <Plus size={18} /> Tambah Menu Baru
        </button>
      </div>

      {/* STRUKTUR TABEL MENU */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 overflow-hidden mt-8">
        <div className="p-5 border-b border-gray-200/60 bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Daftar Menu Aktif</h3>
          <span className="text-xs font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full">
            {currentProducts.length} Produk Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200 text-sm text-gray-600">
                <th className="p-4 font-bold">Nama Menu</th>
                <th className="p-4 font-bold">Kategori</th>
                <th className="p-4 font-bold">Harga Jual</th>
                <th className="p-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100/50 hover:bg-white/60 transition-colors"
                >
                  <td className="p-4 font-bold text-gray-800 flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg text-[#1B4332]">
                      {product.category.includes("Hot") ? (
                        <Coffee size={18} />
                      ) : (
                        <IceCream size={18} />
                      )}
                    </div>
                    {product.name}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-600">
                    {product.category}
                  </td>
                  <td className="p-4 font-bold text-gray-900">
                    Rp {product.price.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4 text-center">
                    <span className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
