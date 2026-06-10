import { useLock } from "@/lib/lock-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lock } = useLock(); // Pastikan ini ada!

  return (
    // ... baris kode lainnya ...

    // Pastikan tombol Kunci (Lock) memiliki onClick={lock}
    <button
      onClick={lock}
      className="flex items-center justify-center gap-3 text-red-500 hover:text-red-400 hover:bg-red-500/10 px-4 py-3 w-full rounded-xl text-sm font-bold transition-colors active:scale-95"
    >
      <Lock size={18} /> Kunci (Lock)
    </button>
  );
}
