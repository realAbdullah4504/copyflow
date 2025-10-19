export const env = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL!,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY!,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL!,
  NODE_ENV: import.meta.env.MODE,
};

// Optional: validate missing vars in dev
if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
  console.warn("⚠️ Missing Supabase env vars. Check your .env file.");
}
