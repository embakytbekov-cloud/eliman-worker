import { supabase } from "./config.js";

export async function uploadWorkerPhoto(file, telegramId) {
  try {
    const fileName = ${telegramId}.jpg;

    const { error } = await supabase.storage
      .from("workers")
      .upload(fileName, file, {
        upsert: true,
      });

    if (error) {
      console.error("Photo upload error:", error);
      return null;
    }

    const { data } = supabase.storage.from("workers").getPublicUrl(fileName);

    return data.publicUrl;
  } catch (e) {
    console.error("Upload exception:", e);
    return null;
  }
}
