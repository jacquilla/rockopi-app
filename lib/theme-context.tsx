"use client";

import { createContext, useContext, useState, useEffect } from "react";

export interface Theme {
  name: string;
  primary: string;
  primaryDark: string;
  bgDark: string;
  bgCard: string;
  bgOverlay: string;
  textAccent: string;
  textHeading: string;
  bodyBg: string;
  font: string;
  borderColor: string;
}

export const THEMES: Theme[] = [
  {
    name: "Rockopi Classic",
    primary: "#1B4332",
    primaryDark: "#0d261b",
    bgDark: "#0a1f16",
    bgCard: "white/10",
    bgOverlay: "black/50",
    textAccent: "green-400",
    textHeading: "white",
    bodyBg: "#0a1f16",
    font: "ui-sans-serif, system-ui, sans-serif",
    borderColor: "white/20",
  },
  {
    name: "Brewhaus Cream",
    primary: "#1B5E3D",
    primaryDark: "#123D28",
    bgDark: "#F5F0E0",
    bgCard: "#E8E0D0",
    bgOverlay: "#F5F0E0/95",
    textAccent: "#1B5E3D",
    textHeading: "#1B5E3D",
    bodyBg: "#F5F0E0",
    font: "'Playfair Display', Georgia, serif",
    borderColor: "#1B5E3D/20",
  },
  {
    name: "Midnight Espresso",
    primary: "#2C1A1A",
    primaryDark: "#1A0F0F",
    bgDark: "#1A0F0F",
    bgCard: "#2C1A1A/80",
    bgOverlay: "#1A0F0F/95",
    textAccent: "#D4A574",
    textHeading: "#F5F0E0",
    bodyBg: "#1A0F0F",
    font: "ui-sans-serif, system-ui, sans-serif",
    borderColor: "#D4A574/20",
  },
  {
    name: "Ocean Breeze",
    primary: "#0B3D4C",
    primaryDark: "#072A35",
    bgDark: "#0F2F3D",
    bgCard: "#0B3D4C/60",
    bgOverlay: "#0F2F3D/95",
    textAccent: "#5DADE2",
    textHeading: "#E8F4F8",
    bodyBg: "#0F2F3D",
    font: "ui-sans-serif, system-ui, sans-serif",
    borderColor: "#5DADE2/20",
  },
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeIndex: number;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: THEMES[0],
  setTheme: () => {},
  themeIndex: 0,
});

export const useTheme = () => useContext(ThemeContext);

const THEME_KEY = "rockopi_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeIndex, setThemeIndex] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      const idx = parseInt(stored, 10);
      if (idx >= 0 && idx < THEMES.length) setThemeIndex(idx);
    }
  }, []);

  const setTheme = (t: Theme) => {
    const idx = THEMES.indexOf(t);
    setThemeIndex(idx);
    localStorage.setItem(THEME_KEY, idx.toString());
  };

  return (
    <ThemeContext.Provider value={{ theme: THEMES[themeIndex], setTheme, themeIndex }}>
      {children}
    </ThemeContext.Provider>
  );
}
