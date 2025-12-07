import { tg } from "./config.js";
import { uploadWorkerPhoto } from "./storage.js";
import { getWorkerByTelegramId, createWorker } from "./workers.js";
import { showMainApp } from "./ui.js";

// Проверка наличия worker
export async function initAuth() {
  const user = tg?.initDataUnsafe?.user;

  if (!user) {
    alert("Open via Telegram bot");
    return;
  }

  const telegramId = user.id.toString();

  const worker = await getWorkerByTelegramId(telegramId);

  if (!worker) {
    document.getElementById("registerScreen").classList.remove("hidden");
  } else {
    showMainApp(worker);
  }
}

// РЕГИСТРАЦИЯ
export async function registerWorker() {
  const tgUser = tg.initDataUnsafe.user;
  const telegram_id = tgUser.id.toString();

  const full_name = regName.value.trim();
  const phone = regPhone.value.trim();
  const city = regCity.value.trim();
  const bio = regBio.value.trim();

  const categories = Array.from(regCategories.selectedOptions).map(o => o.value);
  const languages = Array.from(regLanguages.selectedOptions).map(o => o.value);

  const photoFile = regPhoto.files[0];
  let photo_url = null;

  if (photoFile) {
    photo_url = await uploadWorkerPhoto(photoFile, telegram_id);
  }

  const newWorker = await createWorker({
    telegram_id,
    full_name,
    phone,
    city,
    categories,
    languages,
    bio,
    photo_url,
    status: "online",
  });

  if (newWorker) {
    document.getElementById("registerScreen").classList.add("hidden");
    showMainApp(newWorker);
  }
}
