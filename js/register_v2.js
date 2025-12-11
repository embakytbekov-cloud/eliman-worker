// ----------------------------
// LANGUAGE + CATEGORY
// ----------------------------
let currentLang = "ru";
let selectedCategory = null;

// ----------------------------
// TRANSLATIONS (i18n)
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
    dbError: "Error de base de datos",
    saveError: "Error al guardar datos",
    uploadError: "Error al subir foto"
  }
};

// ----------------------------
// APPLY TRANSLATIONS
// ----------------------------
function applyTranslations() {
  const t = i18n[currentLang];

  document.getElementById("langTitle").textContent = t.langTitle;
  document.getElementById("langSubtitle").textContent = t.langSubtitle;

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

  document.getElementById("step2Title").textContent = t.step2Title;
  document.getElementById("step2Subtitle").textContent = t.step2Subtitle;
  document.getElementById("next2").textContent = t.next2;

  document.getElementById("step3Title").textContent = t.step3Title;
  document.getElementById("photoBox").textContent = t.photoHint;
  document.getElementById("finishBtn").textContent = t.finish;
}

// ----------------------------
// TELEGRAM ID (без ошибок → fallback работает)
// ----------------------------
let telegramId = null;
let workerKey = null;

(function () {
  try {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
      telegramId = String(window.Telegram.WebApp.initDataUnsafe.user.id);
    }
  } catch (_) {}

  workerKey = telegramId || `anon_${Date.now()}`;
})();

// ----------------------------
// STEP SWITCHING
// ----------------------------
document.querySelectorAll(".lang").forEach(btn => {
  btn.addEventListener("click", () => {
    currentLang = btn.dataset.lang;
    applyTranslations();
    stepLang.classList.add("hidden");
    step1.classList.remove("hidden");
  });
});

next1.onclick = () => {
  step1.classList.add("hidden");
  step2.classList.remove("hidden");
};

document.querySelectorAll(".category").forEach(card =>
  card.addEventListener("click", () => {
    document.querySelectorAll(".category").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    selectedCategory = card.dataset.cat;
  })
);

next2.onclick = () => {
  if (!selectedCategory) {
    alert(i18n[currentLang].categoryAlert);
    return;
  }
  step2.classList.add("hidden");
  step3.classList.remove("hidden");
};

// ----------------------------
// PHOTO PREVIEW
// ----------------------------
photoBox.onclick = () => photoInput.click();

photoInput.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  photoBox.style.backgroundImage = `url(${url})`;
  photoBox.style.backgroundSize = "cover";
  photoBox.style.color = "transparent";
  photoBox.style.border = "none";
};

// ----------------------------
// SAVE → SUPABASE
// ----------------------------
finishBtn.onclick = async () => {
  const t = i18n[currentLang];

  if (!window.db) {
    alert(t.dbError);
    return;
  }

  const file = photoInput.files[0];
  let photo_url = null;

  if (file) {
    const ext = file.name.split(".").pop();
    const filePath = `worker_${workerKey}.${ext}`;

    const { error: uploadErr } = await db.storage
      .from("workers_photos")
      .upload(filePath, file, { upsert: true });

    if (uploadErr) {
      alert(t.uploadError);
      console.log(uploadErr);
      return;
    }

    photo_url = db.storage.from("workers_photos").getPublicUrl(filePath).data.publicUrl;
  }

  const { error } = await db.from("workers").insert({
    telegram_id: workerKey,
    full_name: fullName.value,
    phone: phone.value,
    street: street.value,
    apartment: apt.value,
    city: city.value,
    state: state.value,
    zipcode: zip.value,
    category: selectedCategory,
    language: currentLang,
    lang: currentLang,
    photo: photo_url,
    accepted_terms: false,
    accepted_privacy: false,
    accepted_work_agreement: false
  });

  if (error) {
    alert(t.saveError);
    console.log(error);
    return;
  }

  window.location.href = `terms.html?lang=${currentLang}`;
};

// ----------------------------
applyTranslations();
