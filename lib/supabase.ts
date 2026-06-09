import { createClient } from "@supabase/supabase-js";

console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

console.log(
  "SUPABASE KEY EXISTS:",
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xyz-placeholder.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "kunci-placeholder-untuk-build";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
