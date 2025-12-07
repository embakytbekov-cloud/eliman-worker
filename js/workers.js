import { supabase } from "./config.js";

export async function getWorkerByTelegramId(telegramId) {
  const { data, error } = await supabase
    .from("workers")
    .select("*")
    .eq("telegram_id", telegramId)
    .maybeSingle();

  if (error) console.error("getWorker error:", error);
  return data;
}

export async function createWorker(workerData) {
  const { data, error } = await supabase
    .from("workers")
    .insert(workerData)
    .select()
    .single();

  if (error) {
    console.error("createWorker error:", error);
    return null;
  }

  return data;
}
