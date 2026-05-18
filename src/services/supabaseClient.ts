import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Prefer environment variables in production. These fallbacks use the values
// you provided — it's recommended to set them in your deployment env instead
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://khbqnxnjizdqmdijnjoz.supabase.co';
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoYnFueG5qaXpkcW1kaWpuam96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMDE1MTgsImV4cCI6MjA5NDY3NzUxOH0.wVC9tdzwHF-HL5E32BjxWgH2ERP1cUxfwqnB8IYmz18';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
