import { createClient } from "@supabase/supabase-js";

// Claves PÚBLICAS (anon). Es seguro tenerlas en el código del frontend.
const SUPABASE_URL = "https://tnbckjgtzervunhkyrvc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuYmNramd0emVydnVuaGt5cnZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNTU0NjEsImV4cCI6MjA5NDczMTQ2MX0.mJKsnK9haVm59W8AtZrT37g5WOZWAAxN8etvdkJg36I";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

export const APP_DATA_ID = "main";
