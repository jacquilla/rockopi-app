import { Plus } from "lucide-react";

// --- MOCK DATA 25 MENU ROCKOPI ---
const mockProducts = [
  {
    id: 1,
    sku: "RCK-HOT-001",
    name: "Hot Coffee Milk",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 2,
    sku: "RCK-HOT-002",
    name: "Hot Rockopi ⭐",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 3,
    sku: "RCK-HOT-003",
    name: "Hot Americano",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 4,
    sku: "RCK-HOT-004",
    name: "Cappucinno",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 5,
    sku: "RCK-HOT-005",
    name: "V60 Coffee",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 6,
    sku: "RCK-HOT-006",
    name: "Vietnam Drip",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 7,
    sku: "RCK-ICE-001",
    name: "Iced Rockopi ⭐",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 8,
    sku: "RCK-ICE-002",
    name: "Brown Sugar Rockopi",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 9,
    sku: "RCK-ICE-003",
    name: "Iced Americano",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 10,
    sku: "RCK-ICE-004",
    name: "Pandan Iced Coffee",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 11,
    sku: "RCK-ICE-005",
    name: "Banana Iced Coffee",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 12,
    sku: "RCK-ICE-006",
    name: "Butterscotch Iced Coffee",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 13,
    sku: "RCK-ICE-007",
    name: "Caramel Macchiato ⭐",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 14,
    sku: "RCK-ICE-008",
    name: "Japanese Iced Coffee",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 15,
    sku: "RCK-ICE-009",
    name: "Iced Hazelnut Latte",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 16,
    sku: "RCK-NON-001",
    name: "Hot Chocolate ⭐",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 17,
    sku: "RCK-NON-002",
    name: "Iced Chocolate ⭐",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 18,
    sku: "RCK-NON-003",
    name: "Hot Matcha",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 19,
    sku: "RCK-NON-004",
    name: "Iced Matcha",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 20,
    sku: "RCK-NON-005",
    name: "Hot Taro",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 21,
    sku: "RCK-NON-006",
    name: "Iced Taro",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 22,
    sku: "RCK-NON-007",
    name: "Hot Vanilla",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 23,
    sku: "RCK-NON-008",
    name: "Iced Vanilla",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 24,
    sku: "RCK-NON-009",
    name: "Hot Lemon Tea",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
  {
    id: 25,
    sku: "RCK-NON-010",
    name: "Iced Lemon Tea",
    current_stock: 99,
    min_stock: 20,
    unit: "Cup",
  },
];

export default function MasterProductsUI() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Master Produk</h2>
          <p className="text-gray-500">
            Kelola data menu dan stok di Gudang Rockopi.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#1B4332] text-white px-4 py-2 rounded-lg hover:bg-green-900 transition-colors">
          <Plus size={18} /> Tambah Produk
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="sticky top-0 bg-gray-50 shadow-sm">
              <tr className="border-b text-sm text-gray-500">
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium">Nama Menu</th>
                <th className="p-4 font-medium">Stok Saat Ini</th>
                <th className="p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mockProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-mono text-sm text-gray-500">
                    {product.sku}
                  </td>
                  <td className="p-4 font-bold text-gray-800">
                    {product.name}
                  </td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                      {product.current_stock} {product.unit}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:underline text-sm mr-3">
                      Edit
                    </button>
                    <button className="text-red-600 hover:underline text-sm">
                      Hapus
                    </button>
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
