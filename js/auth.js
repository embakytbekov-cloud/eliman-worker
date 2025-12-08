import { supabase } from "./config.js";

// Telegram
const tg = window.Telegram.WebApp;

// === Проверка, зарегистрирован ли работник ===
export async function checkExistingWorker() {
    const telegramId = tg.initDataUnsafe?.user?.id;
    if (!telegramId) return false;

    const { data } = await supabase
        .from("workers")
        .select("*")
        .eq("telegram_id", telegramId)
        .single();

    return data || false;
}

// === Регистрация ===
export async function registerWorker() {
    const telegramId = tg.initDataUnsafe?.user?.id;

    const fullName = document.getElementById("fullName").value;
    const phone = document.getElementById("phone").value;
    const city = document.getElementById("city").value;
    const language = document.getElementById("language").value;
    const category = document.getElementById("category").value;

    const { data, error } = await supabase
        .from("workers")
        .insert([{
            telegram_id: telegramId,
            full_name: fullName,
            phone: phone,
            city: city,
            language: language,
            category: category
        }])
        .single();

    if (error) {
        console.log("Error:", error);
        tg.showAlert("Ошибка регистрации");
        return false;
    }

    return data;
}
