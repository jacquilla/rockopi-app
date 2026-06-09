import { createClient } from "@supabase/supabase-js";

// Kita beri nilai 'fallback' (cadangan) agar Vercel tidak panik saat proses Build.
// Jika Vercel sudah punya kunci aslinya, dia akan memakai yang asli.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "kunci-sementara-agar-vercel-tidak-error";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
