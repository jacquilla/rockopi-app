"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import {
  ClipboardList,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
  Trash2,
  Search,
} from "lucide-react";
import PoweredByFooter from "../../../components/PoweredByFooter";

export const dynamic = "force-dynamic";

export default function InventoryLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("inventory_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-[url('/bg-rockopi.avif')] bg-cover bg-fixed bg-center flex flex-col text-white">
      <div className="flex-1 bg-black/50 backdrop-blur-sm p-4 md:p-8 pt-6 flex flex-col">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col space-y-8 pb-10">
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
            <div>
              <h2 className="text-3xl font-black drop-shadow-lg flex items-center gap-3">
                Log Inventori Rockopi
              </h2>
              <p className="text-gray-200 font-medium mt-1">
                Pantau riwayat pergerakan stok bahan baku Kafe secara real-time.
              </p>
            </div>
            <button
              onClick={fetchLogs}
              className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-white/20 transition-all"
            >
              <RefreshCw
                size={20}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
          </header>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden flex-1 text-gray-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#1B4332] text-white">
                  <tr className="text-sm">
                    <th className="p-4 w-40">Waktu</th>
                    <th className="p-4 w-32">Status</th>
                    <th className="p-4">Item & Catatan</th>
                    <th className="p-4 text-right w-32">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-20 text-center font-bold text-gray-400"
                      >
                        Memuat log cloud...
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b border-gray-100 hover:bg-gray-50/80"
                      >
                        <td className="p-4 text-gray-500 font-bold">
                          {new Date(log.created_at).toLocaleDateString("id-ID")}{" "}
                          {new Date(log.created_at).toLocaleTimeString(
                            "id-ID",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 w-fit ${log.type === "IN" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                          >
                            {log.type === "IN" ? (
                              <ArrowUpCircle size={12} />
                            ) : (
                              <ArrowDownCircle size={12} />
                            )}{" "}
                            {log.type}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-gray-800">{log.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5 italic">
                            {log.note || "Tanpa catatan"}
                          </p>
                        </td>
                        <td
                          className={`p-4 text-right font-black ${log.type === "IN" ? "text-green-600" : "text-red-600"}`}
                        >
                          {log.type === "IN" ? "+" : "-"} {log.qty} {log.unit}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <PoweredByFooter />
        </div>
      </div>
    </div>
  );
}
