import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pesan - Rockopi",
  description: "Pesan menu favorit Anda di Rockopi",
};

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
