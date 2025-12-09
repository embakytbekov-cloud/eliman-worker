let currentLang = "en";
let selectedCategory = null;

const i18n = {
  en: {
    // language screen
    langTitle: "Choose language",
    langSubtitle: "Select your language. We’ll show all steps in it.",

    step1Title: "Worker profile",
    step1Subtitle: "Tell us about you and your address so we can send jobs.",
    fullName: "Full name",
    phone: "Phone",
    street: "Street, house",
    apt: "Apartment / office (optional)",
    city: "City",
    state: "State",
    zip: "ZIP code",
    next: "Next",

    step2Title: "Category",
    step2Subtitle: "Please choose your main category to serve clients.",

    catApplianceTitle: "Appliance Repair",
    catApplianceSub: "Washer, dryer, refrigerator…",
    catCleaningTitle: "Cleaning",
    catCleaningSub: "Home, office, car…",
    catHandymanTitle: "Handyman",
    catHandymanSub: "Repair, painting, install…",
    catLocksmithTitle: "Locksmith",
    catLocksmithSub: "Locks, car locks…",
    catMovingTitle: "Moving",
    catMovingSub: "Packing, moving, lifting…",
    catSmartTitle: "Smart Home",
    catSmartSub: "Doorbell, camera…",
    catTireTitle: "Tire & Roadside",
    catTireSub: "Tire change, jump start…",

    step3Title: "Profile photo",
    photoHint: "Tap to choose a photo",
    finish: "Finish",

    categoryAlert: "Please select a category",
    finishAlert: "Registration completed!"
  },

  ru: {
    langTitle: "Выберите язык",
    langSubtitle: "Пожалуйста, выберите язык для продолжения.",

    step1Title: "Профиль работника",
    step1Subtitle: "Укажите данные и адрес, чтобы мы знали, куда отправлять заказы.",
    fullName: "Полное имя",
    phone: "Телефон",
    street: "Улица, дом",
    apt: "Квартира / офис (необязательно)",
    city: "Город",
    state: "Штат",
    zip: "ZIP код",
    next: "Далее",

    step2Title: "Категория услуг",
    step2Subtitle: "Пожалуйста выберите свою категорию для работы.",

    catApplianceTitle: "Ремонт техники",
    catApplianceSub: "Стиралка, сушилка, холодильник…",
    catCleaningTitle: "Уборка",
    catCleaningSub: "Дом, офис, авто…",
    catHandymanTitle: "Мастер на час",
    catHandymanSub: "Ремонт, покраска, монтаж…",
    catLocksmithTitle: "Слесарь",
    catLocksmithSub: "Замки, авто-замки…",
    catMovingTitle: "Переезд",
    catMovingSub: "Упаковка, перенос…",
    catSmartTitle: "Умный дом",
    catSmartSub: "Звонок, камеры…",
    catTireTitle: "Шины / помощь",
    catTireSub: "Замена колеса, прикурить…",

    step3Title: "Фото профиля",
    photoHint: "Нажмите чтобы выбрать",
    finish: "Завершить",

    categoryAlert: "Выберите категорию",
    finishAlert: "Регистрация завершена!"
  },

  es: {
    langTitle: "Elige idioma",
    langSubtitle: "Selecciona tu idioma para continuar.",

    step1Title: "Perfil del trabajador",
    step1Subtitle: "Cuéntanos sobre ti y tu dirección para enviarte trabajos.",
    fullName: "Nombre completo",
    phone: "Teléfono",
    street: "Calle, número",
    apt: "Apartamento / oficina (opcional)",
    city: "Ciudad",
    state: "Estado",
    zip: "Código ZIP",
    next: "Siguiente",

    step2Title: "Categoría",
    step2Subtitle: "Elige tu categoría principal para atender clientes.",

    catApplianceTitle: "Reparación de electrodomésticos",
    catApplianceSub: "Lavadora, secadora, refrigerador…",
    catCleaningTitle: "Limpieza",
    catCleaningSub: "Casa, oficina, auto…",
    catHandymanTitle: "Manitas",
    catHandymanSub: "Reparar, pintar, instalar…",
    catLocksmithTitle: "Cerrajero",
    catLocksmithSub: "Cerraduras, autos…",
    catMovingTitle: "Mudanza",
    catMovingSub: "Empaque, carga…",
    catSmartTitle: "Casa inteligente",
    catSmartSub: "Timbre, cámaras…",
    catTireTitle: "Neumáticos / asistencia",
    catTireSub: "Cambiar llanta, arrancar auto…",

    step3Title: "Foto de perfil",
    photoHint: "Toca para elegir foto",
    finish: "Finalizar",

    categoryAlert: "Selecciona una categoría",
    finishAlert: "¡Registro completado!"
  }
};

function applyTranslations() {
  const t = i18n[currentLang];

  // language screen
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
  document.getElementById("next1Btn").textContent = t.next;

  // step 2
  document.getElementById("step2Title").textContent = t.step2Title;
  document.getElementById("step2Subtitle").textContent = t.step2Subtitle;

  document.getElementById("catApplianceTitle").textContent = t.catApplianceTitle;
  document.getElementById("catApplianceSub").textContent = t.catApplianceSub;

  document.getElementById("catCleaningTitle").textContent = t.catCleaningTitle;
  document.getElementById("catCleaningSub").textContent = t.catCleaningSub;

  document.getElementById("catHandymanTitle").textContent = t.catHandymanTitle;
  document.getElementById("catHandymanSub").textContent = t.catHandymanSub;

  document.getElementById("catLocksmithTitle").textContent = t.catLocksmithTitle;
  document.getElementById("catLocksmithSub").textContent = t.catLocksmithSub;

  document.getElementById("catMovingTitle").textContent = t.catMovingTitle;
  document.getElementById("catMovingSub").textContent = t.catMovingSub;

  document.getElementById("catSmartTitle").textContent = t.catSmartTitle;
  document.getElementById("catSmartSub").textContent = t.catSmartSub;

  document.getElementById("catTireTitle").textContent = t.catTireTitle;
  document.getElementById("catTireSub").textContent = t.catTireSub;

  document.getElementById("next2Btn").textContent = t.next;

  // step 3
  document.getElementById("step3Title").textContent = t.step3Title;
  document.getElementById("photoCircle").textContent = t.photoHint;
  document.getElementById("finishBtn").textContent = t.finish;
}

// LANGUAGE SELECT
document.querySelectorAll(".language-card").forEach(card => {
  card.onclick = () => {
    currentLang = card.dataset.lang;
    applyTranslations();

    document.getElementById("langStep").classList.add("hidden");
    document.getElementById("step1").classList.remove("hidden");
  };
});


// CATEGORY SELECT
document.querySelectorAll(".category-card").forEach(card => {
  card.onclick = () => {
    document.querySelectorAll(".category-card").forEach(c =>
      c.classList.remove("selected")
    );
    card.classList.add("selected");
    selectedCategory = card.dataset.cat;
  };
});

// STEP LOGIC
function goStep2() {
  document.getElementById("step1").classList.add("hidden");
  document.getElementById("step2").classList.remove("hidden");
}

function goStep3() {
  if (!selectedCategory) {
    alert(i18n[currentLang].categoryAlert);
    return;
  }

  document.getElementById("step2").classList.add("hidden");
  document.getElementById("step3").classList.remove("hidden");
}

// PHOTO PREVIEW
document.getElementById("photoCircle").onclick = () =>
  document.getElementById("photoInput").click();

document.getElementById("photoInput").onchange = e => {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  const circle = document.getElementById("photoCircle");

  circle.style.backgroundImage = `url(${url})`;
  circle.style.backgroundSize = "cover";
  circle.style.border = "none";
  circle.textContent = "";
};

// FINISH
function finishRegistration() {
  alert(i18n[currentLang].finishAlert);
}

applyTranslations();
