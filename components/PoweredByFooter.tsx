// components/PoweredByFooter.tsx
import React from "react";

export default function PoweredByFooter() {
  return (
    <footer className="w-full flex items-center justify-center pb-8 pt-12 px-4 mt-auto">
      {/* Bungkus teks dan logo dengan tag <a> untuk link */}
      <a
        href="https://instagram.com/hellodigi.id"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 group cursor-pointer"
      >
        <span className="text-xs text-gray-500 font-medium tracking-wide group-hover:text-[#1B4332] transition-colors duration-300">
          Powered by
        </span>

        <img
          src="/digi-logo.png"
          alt="Digi Business Logo"
          className="h-5 md:h-6 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
        />
      </a>
    </footer>
  );
}
