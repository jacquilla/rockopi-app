"use server";

import { createClient } from "@supabase/supabase-js";

export async function verifyAdminPin(inputPin: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("admin_settings")
    .select("value")
    .eq("key", "admin_pin")
    .single();

  if (error || !data) {
    return { success: false, message: "Terjadi kesalahan sistem server." };
  }

  if (data.value === inputPin) {
    return { success: true };
  }

  return { success: false, message: "PIN Akses Salah. Otorisasi Ditolak!" };
}
