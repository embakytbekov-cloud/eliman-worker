let currentLang = "ru";
let selectedCategory = null;

const i18n = {
  en: {
    langTitle: "Choose language",
    langSubtitle: "Select your language for registration.",
    step1Title: "Profile",
    step1Subtitle: "Enter your personal and address information.",
    fullName: "Full name",
    phone: "Phone",
    street: "Street, house",
    apt: "Apartment / office",
    city: "City",
    state: "State",
    zip: "ZIP code",
    next: "Next",
    step2Title: "Category",
    step2Subtitle: "Please choose your main working category.",
    next2: "Next",
    step3Title: "Profile photo",
    photoHint: "Click to upload",
    next3: "Continue",
    categoryAlert: "Please select a category"
  },

  ru: {
    langTitle: "Выберите язык",
    langSubtitle: "Выберите язык регистрации.",
    step1Title: "Профиль",
    step1Subtitle: "Введите ваши данные и адрес.",
    fullName: "Полное имя",
    phone: "Телефон",
    street: "Улица, дом",
    apt: "Квартира / офис",
    city: "Город",
    state: "Штат",
    zip: "ZIP код",
    next: "Далее",
    step2Title: "Категория",
    step2Subtitle: "Выберите вашу рабочую категорию.",
    next2: "Далее",
    step3Title: "Фото профиля",
    photoHint: "Нажмите, чтобы загрузить",
    next3: "Продолжить",
    categoryAlert: "Выберите категорию"
  },

  es: {
    langTitle: "Elige idioma",
    langSubtitle: "Selecciona tu idioma.",
    step1Title: "Perfil",
    step1Subtitle: "Ingresa tu información.",
    fullName: "Nombre completo",
    phone: "Teléfono",
    street: "Calle, número",
    apt: "Departamento / oficina",
    city: "Ciudad",
    state: "Estado",
    zip: "Código ZIP",
    next: "Siguiente",
    step2Title: "Categoría",
    step2Subtitle: "Elige tu categoría principal.",
    next2: "Siguiente",
    step3Title: "Foto de perfil",
    photoHint: "Toca para subir",
    next3: "Continuar",
    categoryAlert: "Por favor elige una categoría"
  }
};

function applyTranslations() {
  const t = i18n[currentLang];

  // language
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
  document.getElementById("next3").textContent = t.next3;
}

/* LANG SELECT */
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

/* STEP 3 → TERMS PAGE */
document.getElementById("next3").addEventListener("click", () => {
  window.location.href = "terms.html?lang=" + currentLang;
});

/* INIT */
applyTranslations();
