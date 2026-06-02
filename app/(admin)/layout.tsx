import {
  Package,
  ArrowDownUp,
  History,
  LayoutDashboard,
  Wallet,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Memasang background utama Rockopi
    <div className="flex min-h-screen bg-[url('/bg-rockopi.avif')] bg-cover bg-fixed bg-center">
      {/* SIDEBAR ADMIN - Efek Kaca Gelap (Dark Frosted Glass) */}
      <aside className="w-64 bg-black/80 backdrop-blur-xl text-white flex flex-col shadow-[5px_0_25px_rgba(0,0,0,0.5)] z-10 border-r border-white/10">
        <div className="p-6 border-b border-white/10 flex flex-col items-center text-center">
          <img
            src="/logo.png"
            alt="Logo Rockopi"
            className="w-32 object-contain mb-2 drop-shadow-lg"
          />
          <p className="text-xs text-gray-300 mt-1 font-medium tracking-widest uppercase">
            Warehouse
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <a
            href="/"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
          >
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a
            href="/products"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
          >
            <Package size={20} /> Master Produk
          </a>
          <a
            href="/transactions"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
          >
            <ArrowDownUp size={20} /> In/Out Stok
          </a>
          <a
            href="/logs"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
          >
            <History size={20} /> Riwayat
          </a>
          <a
            href="/finance"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
          >
            <Wallet size={20} /> Pembukuan
          </a>
        </nav>

        <div className="p-6 border-t border-white/10 flex flex-col items-center justify-center opacity-90 hover:opacity-100 transition-opacity">
          <img
            src="/rockopi.png"
            alt="Rockopi Badge"
            className="w-16 h-16 object-cover rounded-full shadow-2xl border-2 border-green-700/50 bg-transparent drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]"
          />
        </div>
      </aside>

      {/* MAIN CONTENT - Efek Kaca Putih Terang (Light Frosted Glass) */}
      <main className="flex-1 p-8 h-screen overflow-y-auto bg-slate-50/85 backdrop-blur-md relative shadow-inner">
        {/* Kotak-kotak (Cards) pembukuan dan tabel Anda akan melayang dengan indah di atas background ini */}
        {children}
      </main>
    </div>
  );
}
