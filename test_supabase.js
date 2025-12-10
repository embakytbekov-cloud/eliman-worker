
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supabase = createClient(
    "ТВОЙ_SUPABASE_URL",
    "ТВОЙ_SUPABASE_ANON_KEY"
);
