import { supabase } from "./supabase.js";
import { getTelegramUser } from "./auth.js";

Telegram.WebApp.ready();
Telegram.WebApp.expand();

document.getElementById("loginBtn").onclick = async () => {
    const user = getTelegramUser();

    if (!user) {
        document.getElementById("error").innerText = "Открой через Telegram!";
        document.getElementById("error").classList.remove("hidden");
        return;
    }

    console.log("TG USER:", user);

    let { data, error } = await supabase
        .from("workers")
        .select("*")
        .eq("telegram_id", user.telegram_id)
        .maybeSingle();

    if (error) {
        document.getElementById("error").innerText = "Ошибка Supabase";
        document.getElementById("error").classList.remove("hidden");
        return;
    }

    if (!data) {
        document.getElementById("error").innerText = "Работник не найден";
        document.getElementById("error").classList.remove("hidden");
        return;
    }

    document.getElementById("status").innerText = "ONLINE";
    document.getElementById("status").classList.remove("bg-red-500");
    document.getElementById("status").classList.add("bg-green-500");

    alert("Добро пожаловать: " + data.full_name);
};
