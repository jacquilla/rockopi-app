"use client";

import { useState } from "react";
import { useLock } from "./lock-context";
import { Shield } from "lucide-react";

export default function LockScreen() {
  const { isLocked, unlock, wrongPinCount } = useLock();
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [shake, setShake] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isLocked) return null;

  const handleDigit = (digit: string) => {
    const firstEmpty = pin.findIndex((p) => p === "");
    if (firstEmpty === -1) return;
    const next = [...pin];
    next[firstEmpty] = digit;
    setPin(next);

    if (firstEmpty === 5) {
      const enteredPin = next.join("");
      setIsVerifying(true);
      setTimeout(() => {
        const ok = unlock(enteredPin);
        setIsVerifying(false);
        if (!ok) {
          setShake(true);
          setPin(["", "", "", "", "", ""]);
          setTimeout(() => setShake(false), 400);
        }
      }, 300);
    }
  };

  const handleBackspace = () => {
    const lastFilled = pin.map((p, i) => (p !== "" ? i : -1)).filter((i) => i !== -1).pop();
    if (lastFilled === undefined) return;
    const next = [...pin];
    next[lastFilled] = "";
    setPin(next);
  };

  const handleClear = () => setPin(["", "", "", "", "", ""]);

  return (
    <div className="fixed inset-0 z-[999] bg-[url('/bg-rockopi.avif')] bg-cover bg-center flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div
        className={`relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center gap-6 ${
          shake ? "animate-shake" : ""
        }`}
      >
        <div className="w-16 h-16 rounded-full bg-[#1B4332] flex items-center justify-center shadow-lg border border-white/20">
          <Shield className="text-white" size={32} />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-black text-white mb-1">Rockopi Locked</h2>
          <p className="text-sm text-gray-300 font-medium">Masukkan PIN 6 digit untuk membuka</p>
        </div>

        {wrongPinCount > 0 && (
          <p className="text-red-400 text-xs font-bold animate-pulse">
            PIN salah ({wrongPinCount}x). Coba lagi.
          </p>
        )}

        <div className="flex items-center gap-3">
          {pin.map((digit, i) => (
            <div
              key={i}
              className={`w-10 h-12 rounded-xl flex items-center justify-center text-xl font-black border-2 transition-all ${
                digit
                  ? "bg-[#1B4332] border-[#1B4332] text-white"
                  : "bg-white/10 border-white/30 text-white/50"
              }`}
            >
              {digit ? "●" : ""}
            </div>
          ))}
        </div>

        {isVerifying && (
          <p className="text-xs text-green-300 font-bold animate-pulse">Memverifikasi...</p>
        )}

        <div className="grid grid-cols-3 gap-3 w-full">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((key, i) => (
            <button
              key={i}
              onClick={() => {
                if (key === "del") handleBackspace();
                else if (key !== "") handleDigit(key);
              }}
              className={`h-14 rounded-xl font-bold text-lg transition-all active:scale-95 ${
                key === "del"
                  ? "bg-white/20 text-white hover:bg-white/30"
                  : key === ""
                    ? "pointer-events-none"
                    : "bg-white/10 text-white hover:bg-[#1B4332] hover:border-[#1B4332]"
              }`}
            >
              {key === "del" ? "⌫" : key}
            </button>
          ))}
        </div>

        <button
          onClick={handleClear}
          className="text-xs text-gray-400 hover:text-white font-bold transition-colors"
        >
          Hapus Semua
        </button>
      </div>
    </div>
  );
}
