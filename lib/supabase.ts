import { createClient } from "@supabase/supabase-js";

// Menggunakan placeholder agar Vercel sukses melewati fase 'npm run build'
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xyz-placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "kunci-placeholder-untuk-build";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
