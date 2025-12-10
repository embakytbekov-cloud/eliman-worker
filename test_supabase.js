import { supabase } from "./supabase.js";

async function testConnection() {
    console.log("🔄 Testing Supabase connection...");

    const { data, error } = await supabase.from("test_table").select("*").limit(1);

    if (error) {
        console.error("❌ Connection Failed:", error);
    } else {
        console.log("✅ Supabase Connected Successfully!");
    }
}

testConnection();
