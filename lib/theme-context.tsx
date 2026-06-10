"use client";

import React, { createContext, useContext, useState } from "react";

// Koleksi Eksklusif Palet Warna Barista & Dunia Kopi
export const THEMES = [
  {
    name: "Rockopi Original",
    primary: "#4ade80", // Neon Emerald (Identitas hijau legendaris Rockopi)
    bodyBg: "#07110a", // Hitam dengan aura hijau pekat
  },
  {
    name: "Golden Macchiato",
    primary: "#fbbf24", // Rich Gold/Amber (Mewah, hangat, dan kontras tinggi)
    bodyBg: "#0f0a00", // Hitam dengan aura cokelat espresso
  },
  {
    name: "Crimson Robusta",
    primary: "#f87171", // Soft Crimson (Karakter berani, premium, dan elegan)
    bodyBg: "#0f0505", // Hitam dengan aura marun pekat
  },
  {
    name: "Caramel Crema",
    primary: "#fb923c", // Warm Caramel (Lembut, retro, dan estetik)
    bodyBg: "#0f0700", // Hitam dengan aura karamel bakar
  },
  {
    name: "Midnight Brew",
    primary: "#60a5fa", // Electric Blue (Sangat futuristik ala kedai kopi modern)
    bodyBg: "#00050f", // Hitam dengan aura navy malam
  },
  {
    name: "Velvet Espresso",
    primary: "#c084fc", // Amethyst Purple (Eksklusif, misterius, dan artistik)
    bodyBg: "#0a000f", // Hitam dengan aura taro pekat
  },
  {
    name: "Matcha Affogato",
    primary: "#a3e635", // Luminous Lime (Segar, earthy, mirip es krim matcha premium)
    bodyBg: "#081000", // Hitam dengan aura teh hijau pekat
  },
  {
    name: "Mint Peppermint",
    primary: "#2dd4bf", // Deep Teal/Cyan (Adem, bersih, terinspirasi sirup mint)
    bodyBg: "#00100d", // Hitam dengan aura batu giok / mint pekat
  },
  {
    name: "Berry Cold Foam",
    primary: "#f472b6", // Soft Fuchsia/Pink (Manis, modern, mencolok di malam hari)
    bodyBg: "#100007", // Hitam dengan aura buah beri gelap
  },
  {
    name: "Charcoal Cold Brew",
    primary: "#9ca3af", // Industrial Platinum (Sangat minimalis, bersih, profesional)
    bodyBg: "#0e0f11", // Hitam abu-abu besi atau arang aktif
  },
];

export type Theme = (typeof THEMES)[0];

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeIndex: number;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(THEMES[0]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const themeIndex = THEMES.findIndex((t) => t.name === theme.name);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeIndex }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
