// ---- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ----
let currentLang = "ru";
let selectedCategory = null;
let uploadedPhotoFile = null;

// Telegram WebApp
const tg = window.Telegram && window.Telegram.WebApp
  ? window.Telegram.WebApp
  : null;

if (tg) {
  try { tg.ready(); } catch (_) {}
}

const telegramId = tg && tg.initDataUnsafe && tg.initDataUnsafe.user
  ? String(tg.initDataUnsafe.user.id)
  : null;

// ---- МУЛЬТИЯЗЫК ----
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
    formAlert: "Please fill profile and select category",
    saveError: "Save error",
    uploadError: "Photo upload error",
    dbError: "Database connection error",
    tgError: "Open mini-app inside Telegram"
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
    formAlert: "Заполните профиль и выберите категорию",
    saveError: "Ошибка сохранения",
    uploadError: "Ошибка загрузки фото",
    dbError: "Ошибка подключения к базе",
    tgError: "Откройте мини-приложение внутри Telegram"
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
    formAlert: "Completa el perfil y elige categoría",
    saveError: "Error al guardar",
    uploadError: "Error al subir la foto",
    dbError: "Error de conexión con la base de datos",
    tgError: "Abre el mini-app dentro de Telegram"
  }
};

// ---- ПРИМЕНИТЬ ПЕРЕВОД ----
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

// язык
document.querySelectorAll(".lang").forEach(btn => {
  btn.addEventListener("click", () => {
    currentLang = btn.dataset.lang;
    applyTranslations();
    document.getElementById("stepLang").classList.add("hidden");
    document.getElementById("step1").classList.remove("hidden");
  });
});

// step1 → step2
document.getElementById("next1").addEventListener("click", () => {
  document.getElementById("step1").classList.add("hidden");
  document.getElementById("step2").classList.remove("hidden");
});

// категории
document.querySelectorAll(".category").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".category").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    selectedCategory = card.dataset.cat;
  });
});

// step2 → step3
document.getElementById("next2").addEventListener("click", () => {
  if (!selectedCategory) {
    alert(i18n[currentLang].categoryAlert);
    return;
  }
  document.getElementById("step2").classList.add("hidden");
  document.getElementById("step3").classList.remove("hidden");
});

// фото (preview)
document.getElementById("photoBox").addEventListener("click", () => {
  document.getElementById("photoInput").click();
});

document.getElementById("photoInput").addEventListener("change", e => {
  const file = e.target.files[0];
  uploadedPhotoFile = file;
  if (!file) return;
  const url = URL.createObjectURL(file);
  const box = document.getElementById("photoBox");
  box.style.backgroundImage = `url(${url})`;
  box.style.backgroundSize = "cover";
  box.style.backgroundPosition = "center";
  box.style.color = "transparent";
  box.style.border = "none";
});

// FINISH
document.getElementById("finishBtn").addEventListener("click", async () => {
  const t = i18n[currentLang];

  if (!window.db) {
    alert(t.dbError);
    return;
  }

  if (!telegramId) {
    alert(t.tgError);
    return;
  }

  const full_name = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const street = document.getElementById("street").value.trim();
  const apartment = document.getElementById("apt").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const zipcode = document.getElementById("zip").value.trim();

  if (!full_name || !phone || !city || !state || !zipcode || !selectedCategory) {
    alert(t.formAlert);
    return;
  }

  let photoUrl = null;

  if (uploadedPhotoFile) {
    try {
      const fileExt = uploadedPhotoFile.name.split(".").pop();
      const fileName = `worker_${telegramId}.${fileExt || "jpg"}`;
      const filePath = fileName;

      const { error: uploadError } = await window.db.storage
        .from("workers_photos")
        .upload(filePath, uploadedPhotoFile, {
          upsert: true,
          contentType: uploadedPhotoFile.type
        });

      if (uploadError) {
        console.error(uploadError);
        alert(t.uploadError);
        return;
      }

      const { data: publicData } = window.db.storage
        .from("workers_photos")
        .getPublicUrl(filePath);

      photoUrl = publicData?.publicUrl || null;
    } catch (e) {
      console.error(e);
      alert(t.uploadError);
      return;
    }
  }

  try {
    const { data, error } = await window.db
      .from("workers")
      .insert({
        telegram_id: telegramId,
        full_name,
        phone,
        street,
        apartment,
        city,
        state,
        zipcode,
        category: selectedCategory,
        language: currentLang,
        photo: photoUrl,
        accepted_terms: false,
        accepted_privacy: false,
        accepted_work_agreement: false
      })
      .select("id")
      .single();

    if (error) {
      console.error(error);
      alert(t.saveError);
      return;
    }

    const workerId = data.id;
    window.location.href = `terms.html?id=${workerId}&lang=${currentLang}`;
  } catch (e) {
    console.error(e);
    alert(t.saveError);
  }
});

// старт
applyTranslations();