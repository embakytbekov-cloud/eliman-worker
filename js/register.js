
let currentLang = "ru";
let selectedCategory = null;

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
    finishAlert: "Registration completed!"
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
    finishAlert: "Регистрация завершена!"
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
    finishAlert: "¡Registro completado!"
  }
};


function applyTranslations() {
  const t = i18n[currentLang];

  // Step 0
  document.getElementById("langTitle").textContent = t.langTitle;
  document.getElementById("langSubtitle").textContent = t.langSubtitle;

  // Step 1
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

  // Step 2
  document.getElementById("step2Title").textContent = t.step2Title;
  document.getElementById("step2Subtitle").textContent = t.step2Subtitle;
  document.getElementById("next2").textContent = t.next2;

  // Step 3
  document.getElementById("step3Title").textContent = t.step3Title;
  document.getElementById("photoBox").textContent = t.photoHint;
  document.getElementById("finishBtn").textContent = t.finish;
}


/* LANGUAGE SELECT */
document.querySelectorAll(".lang").forEach(btn => {
  btn.addEventListener("click", () => {
    currentLang = btn.dataset.lang;

    applyTranslations();

    document.getElementById("stepLang").classList.add("hidden");
    document.getElementById("step1").classList.remove("hidden");
  });
});


/* STEP 1 → STEP 2 */
document.getElementById("next1").addEventListener("click", () => {
  document.getElementById("step1").classList.add("hidden");
  document.getElementById("step2").classList.remove("hidden");
});


/* CATEGORY SELECT */
document.querySelectorAll(".category").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".category").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    selectedCategory = card.dataset.cat;
  });
});


/* STEP 2 → STEP 3 */
document.getElementById("next2").addEventListener("click", () => {
  if (!selectedCategory) {
    alert(i18n[currentLang].categoryAlert);
    return;
  }

  document.getElementById("step2").classList.add("hidden");
  document.getElementById("step3").classList.remove("hidden");
});


/* PHOTO UPLOAD */
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


/* 🔥 FINISH — SAFE SUPABASE INSERT */
document.getElementById("finishBtn").addEventListener("click", async () => {

  // Сначала проверяем, существует ли Supabase клиент
  if (!window.db) {
    console.error("Supabase client not loaded");
    alert("Ошибка подключения к базе.");
    return;
  }

  // Собираем данные
  const full_name = document.getElementById("fullName").value;
  const phone = document.getElementById("phone").value;
  const street = document.getElementById("street").value;
  const apt = document.getElementById("apt").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const zip = document.getElementById("zip").value;

  // Запись в базу
  const { error } = await window.db.from("workers").insert({
    full_name,
    phone,
    street,
    apt,
    city,
    state,
    zip,
    category: selectedCategory,
    lang: currentLang,
    accepted_terms: true,
    accepted_privacy: true,
    accepted_work_agreement: true,
    created_at: new Date().toISOString()
  });

  if (error) {
    console.error(error);
    alert("Ошибка при сохранении данных");
    return;
  }

  // Если всё успешно → отправляем на terms
  window.location.href = "terms.html?lang=" + currentLang;
});


/* DEFAULT TEXT LOAD */
applyTranslations();
