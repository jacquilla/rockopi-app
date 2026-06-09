// components/PoweredByFooter.tsx
import React from "react";

export default function PoweredByFooter() {
  return (
    <footer className="w-full flex items-center justify-center pb-8 pt-12 px-4 mt-auto">
      <a
        href="https://instagram.com/hellodigi.id"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 group cursor-pointer"
      >
        <span className="text-lg text-gray-500 font-semibold tracking-wide group-hover:text-[#1B4332] transition-colors duration-300">
          Powered by
        </span>

        {/* LOGO DIPERBESAR 2X DARI UKURAN SEBELUMNYA */}
        <img
          src="/digi-logo.png"
          alt="Digi Business Logo"
          className="h-16 md:h-20 object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
        />
      </a>
    </footer>
  );
}
