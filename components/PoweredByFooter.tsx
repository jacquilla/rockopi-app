// components/PoweredByFooter.tsx
import React from "react";

export default function PoweredByFooter() {
  return (
    <footer className="w-full flex items-center justify-center pb-8 pt-12 px-4 mt-auto">
      <a
        href="https://instagram.com/username_instagram_anda"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 group cursor-pointer"
      >
        <span className="text-sm text-gray-500 font-medium tracking-wide group-hover:text-[#1B4332] transition-colors duration-300">
          Powered by
        </span>

        {/* UKURAN LOGO DIPERBESAR DI SINI: h-8 untuk HP, md:h-10 untuk Laptop/Tablet */}
        <img
          src="/digi-logo.png"
          alt="Digi Business Logo"
          className="h-8 md:h-10 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
        />
      </a>
    </footer>
  );
}
