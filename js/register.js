// ----------------------------
// LANGUAGE + CATEGORY
// ----------------------------
let currentLang = "ru";
let selectedCategory = null;

// ----------------------------
// i18n TRANSLATIONS
// ----------------------------
const i18n = {
  en: {
    langTitle: "Choose language",
    langSubtitle: "Select your language. Registration will appear in this language.",

    step1Title: "Profile",
    step1Subtitle: "Enter your personal and address information.",
    fullName: "Full name",
    phone: "Phone number",
    street: "Street, house",
    apt: "Apartment / office (optional)",
    city: "City",
    state: "State",
    zip: "ZIP code",
    next: "Next",

    step2Title: "Category",
    step2Subtitle: "Please choose your main working category.",
    next2: "Next",

    step3Title: "Profile photo",
    photoHint: "Click to upload",
    finish: "Finish",

    categoryAlert: "Please select a category",
    finishAlert: "Registration completed!",
    dbError: "Database error",
    saveError: "Error while saving data",
    uploadError: "Error while uploading photo"
  },

  ru: {
    langTitle: "Выберите язык",
    langSubtitle: "Выберите язык. Регистрация будет показана на нём.",

    step1Title: "Профиль",
    step1Subtitle: "Введите ваши данные и адрес.",
    fullName: "Полное имя",
    phone: "Телефон",
    street: "Улица, дом",
    apt: "Квартира / офис (необязательно)",
    city: "Город",
    state: "Штат",
    zip: "ZIP код",
    next: "Далее",

    step2Title: "Категория",
    step2Subtitle: "Выберите вашу категорию для обслуживания клиентов.",
    next2: "Далее",

    step3Title: "Фото профиля",
    photoHint: "Нажмите, чтобы загрузить",
    finish: "Завершить",

    categoryAlert: "Выберите категорию",
    finishAlert: "Регистрация завершена!",
    dbError: "Ошибка базы данных",
    saveError: "Ошибка при сохранении данных",
    uploadError: "Ошибка при загрузке фото"
  },

  es: {
    langTitle: "Elige tu idioma",
    langSubtitle: "La registración aparecerá en este idioma.",

    step1Title: "Perfil",
    step1Subtitle: "Ingresa tu información personal y dirección.",
    fullName: "Nombre completo",
    phone: "Teléfono",
    street: "Calle, número",
    apt: "Departamento / oficina (opcional)",
    city: "Ciudad",
    state: "Estado",
    zip: "Código ZIP",
    next: "Siguiente",

    step2Title: "Categoría",
    step2Subtitle: "Elige tu categoría principal de trabajo.",
    next2: "Siguiente",

    step3Title: "Foto de perfil",
    photoHint: "Toca para subir foto",
    finish: "Finalizar",

    categoryAlert: "Por favor elige una categoría",
    finishAlert: "¡Registro completado!",
    dbError: "Error de base de datos",
    saveError: "Error al guardar datos",
    uploadError: "Error al subir la foto"
  }
};


// ----------------------------
// APPLY TRANSLATIONS
// ----------------------------
function applyTranslations() {
  const t = i18n[currentLang];

  // step 0
  document.getElementById("langTitle").textContent = t.langTitle;
  document.getElementById("langSubtitle").textContent = t.langSubtitle;

  // step 1
  document.getElementById("step1Title").textContent = t.step1Title;
  document.getElementById("step1Subtitle").textContent = t.step1Subtitle;
  document.getElementById("fullName").placeholder = t.fullName;
  document.getElementById("phone").placeholder = t.phone;
  document.getElementById("street").placeholder = t.street;
  document.getElementById("apt").placeholder = t.apt;
  document.getElementById("city").placeholder = t.city;
  document.getElementById("state").placeholder = t.state;
  document.getElementById("zip").placeholder = t.zip;
  document.getElementById("next1").textContent = t.next;

  // step 2
  document.getElementById("step2Title").textContent = t.step2Title;
  document.getElementById("step2Subtitle").textContent = t.step2Subtitle;
  document.getElementById("next2").textContent = t.next2;

  // step 3
  document.getElementById("step3Title").textContent = t.step3Title;
  document.getElementById("photoBox").textContent = t.photoHint;
  document.getElementById("finishBtn").textContent = t.finish;
}


// ----------------------------
// TELEGRAM ID (если есть)
// ----------------------------
let telegramId = null;
let workerKey = null;

(function detectTelegram() {
  const tg = window.Telegram && window.Telegram.WebApp
    ? window.Telegram.WebApp
    : null;

  if (tg) {
    try { tg.ready(); } catch (_) {}
    if (tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.id) {
      telegramId = String(tg.initDataUnsafe.user.id);
    }
  }

  // окончательный идентификатор работника:
  // если есть telegramId → используем его
  // если нет → всё равно генерируем стабильный ID для записи
  workerKey = telegramId || `anon_${Date.now()}`;
})();


// ----------------------------
// STEP SWITCHING
// ----------------------------
document.querySelectorAll(".lang").forEach(btn => {
  btn.addEventListener("click", () => {
    currentLang = btn.dataset.lang;
    applyTranslations();

    document.getElementById("stepLang").classList.add("hidden");
    document.getElementById("step1").classList.remove("hidden");
  });
});

document.getElementById("next1").addEventListener("click", () => {
  document.getElementById("step1").classList.add("hidden");
  document.getElementById("step2").classList.remove("hidden");
});

document.querySelectorAll(".category").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".category").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    selectedCategory = card.dataset.cat;
  });
});

document.getElementById("next2").addEventListener("click", () => {
  if (!selectedCategory) {
    alert(i18n[currentLang].categoryAlert);
    return;
  }
  document.getElementById("step2").classList.add("hidden");
  document.getElementById("step3").classList.remove("hidden");
});


// ----------------------------
// PHOTO UPLOAD PREVIEW
// ----------------------------
document.getElementById("photoBox").addEventListener("click", () => {
  document.getElementById("photoInput").click();
});

document.getElementById("photoInput").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  const box = document.getElementById("photoBox");

  box.style.backgroundImage = `url(${url})`;
  box.style.backgroundSize = "cover";
  box.style.color = "transparent";
  box.style.border = "none";
});


// ----------------------------
// FINISH BUTTON → SUPABASE
// ----------------------------
document.getElementById("finishBtn").addEventListener("click", async () => {
  const t = i18n[currentLang];

  if (!window.db) {
    alert(t.dbError);
    return;
  }

  // form data
  const full_name = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const street = document.getElementById("street").value.trim();
  const apt = document.getElementById("apt").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const zip = document.getElementById("zip").value.trim();

  // upload photo
  const file = document.getElementById("photoInput").files[0];
  let photo_url = null;

  if (file) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const filePath = `worker_${workerKey}.${ext}`;

    const { error: uploadErr } = await db.storage
      .from("workers_photos")
      .upload(filePath, file, {
        upsert: true
      });

    if (uploadErr) {
      alert(t.uploadError);
      console.log(uploadErr);
      return;
    }

    photo_url = db.storage
      .from("workers_photos")
      .getPublicUrl(filePath).data.publicUrl;
  }

  // save to database
  const { error: insertErr } = await db.from("workers").insert({
    telegram_id: workerKey,          // если есть реальный telegramId – он здесь
    full_name,
    phone,
    street,
    apartment: apt,
    city,
    state,
    zipcode: zip,
    category: selectedCategory,
    language: currentLang,
    lang: currentLang,
    photo: photo_url,
    accepted_terms: false,
    accepted_privacy: false,
    accepted_work_agreement: false
  });

  if (insertErr) {
    alert(t.saveError);
    console.log(insertErr);
    return;
  }

  // успешная регистрация → дальше terms
  window.location.href = "terms.html?lang=" + currentLang;
});


// ----------------------------
// INITIAL TEXT
// ----------------------------
applyTranslations();