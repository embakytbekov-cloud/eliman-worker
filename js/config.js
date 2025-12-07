// ===========================
// SUPABASE CONFIG
// ===========================

export const SUPABASE_URL = "https://ccqldccmikwdjkbxmcsn.supabase.co";
export const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcWxkY2NtaWt3ZGprYnhtY3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMzIxODEsImV4cCI6MjA4MDcwODE4MX0.ce7CPoACHTU6ryGjoELPywa1rpGmDKG5TIZxPFbleuA";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// Telegram Mini App
export const tg = window.Telegram?.WebApp;

if (tg) {
  tg.expand();
  tg.disableVerticalSwipes();
}
