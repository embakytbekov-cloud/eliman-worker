const SUPABASE_URL = "ТВОЙ_URL";
const SUPABASE_KEY = "ТВОЙ_ANON_KEY";

const { createClient } = supabase;

window.db = createClient(SUPABASE_URL, SUPABASE_KEY);
