/* ============================
      GLOBAL STATE
============================ */
let currentLang = "en";
let selectedCategory = null;

/* ============================
      TRANSLATIONS
============================ */
const i18n = {
    en: {
        langTitle: "Choose language",
        langSubtitle: "Please choose your language and we’ll display all registration steps in the language you prefer.",
        
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
        step2Subtitle: "Choose your main category to serve clients.",

        step3Title: "Profile photo",
        photoHint: "Tap to upload photo",
        finish: "Finish",

        alertCategory: "Please select a category",
        alertFinish: "Registration completed!"
    },

    ru: {
        langTitle: "Выберите язык",
        langSubtitle: "Пожалуйста, выберите язык. Все шаги будут на вашем языке.",

        step1Title: "Профиль работника",
        step1Subtitle: "Укажите свои данные и адрес, чтобы мы знали, куда отправлять заказы.",
        fullName: "Полное имя",
        phone: "Телефон",
        street: "Улица, дом",
        apt: "Квартира / офис (необязательно)",
        city: "Город",
        state: "Штат",
        zip: "ZIP код",
        next: "Далее",

        step2Title: "Категория услуг",
        step2Subtitle: "Выберите вашу категорию, чтобы обслуживать клиентов.",

        step3Title: "Фото профиля",
        photoHint: "Нажмите, чтобы загрузить фото",
        finish: "Завершить",

        alertCategory: "Выберите категорию",
        alertFinish: "Регистрация завершена!"
    },

    es: {
        langTitle: "Elige idioma",
        langSubtitle: "Selecciona tu idioma. Mostraremos todos los pasos en ese idioma.",

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

        step2Title: "Categoría de servicios",
        step2Subtitle: "Elige tu categoría principal para atender clientes.",

        step3Title: "Foto de perfil",
        photoHint: "Toca para subir foto",
        finish: "Finalizar",

        alertCategory: "Elige una categoría",
        alertFinish: "¡Registro completado!"
    }
};

/* ============================
        APPLY TRANSLATIONS
============================ */
function translate() {
    const t = i18n[currentLang];

    // lang
    document.getElementById("langTitle").textContent = t.langTitle;
    document.getElementById("langSubtitle").textContent = t.langSubtitle;

    // step1
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

    // step2
    document.getElementById("step2Title").textContent = t.step2Title;
    document.getElementById("step2Subtitle").textContent = t.step2Subtitle;
    document.getElementById("next2Btn").textContent = t.next;

    // step3
    document.getElementById("step3Title").textContent = t.step3Title;
    document.getElementById("photoCircle").textContent = t.photoHint;
    document.getElementById("finishBtn").textContent = t.finish;
}

/* ============================
      LANGUAGE SELECTION
============================ */
document.querySelectorAll(".language-card").forEach(card => {
    card.onclick = () => {
        currentLang = card.dataset.lang;
        translate();

        document.getElementById("langStep").classList.add("hidden");
        document.getElementById("step1").classList.remove("hidden");
    };
});

/* ============================
      CATEGORY SELECT
============================ */
document.querySelectorAll(".category-card").forEach(card => {
    card.onclick = () => {
        document.querySelectorAll(".category-card")
            .forEach(c => c.classList.remove("selected"));

        card.classList.add("selected");
        selectedCategory = card.dataset.cat;
    };
});

/* ============================
      STEP SWITCHERS
============================ */
document.getElementById("next1Btn").onclick = () => {
    document.getElementById("step1").classList.add("hidden");
    document.getElementById("step2").classList.remove("hidden");
};

document.getElementById("next2Btn").onclick = () => {
    if (!selectedCategory) {
        alert(i18n[currentLang].alertCategory);
        return;
    }

    document.getElementById("step2").classList.add("hidden");
    document.getElementById("step3").classList.remove("hidden");
};

/* ============================
           PHOTO UPLOAD
============================ */
document.getElementById("photoCircle").onclick = () =>
    document.getElementById("photoInput").click();

document.getElementById("photoInput").onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const circle = document.getElementById("photoCircle");

    circle.style.backgroundImage = `url(${url})`;
    circle.style.backgroundSize = "cover";
    circle.style.backgroundPosition = "center";
    circle.style.border = "none";
    circle.textContent = "";
};

/* ============================
      FINISH REGISTRATION
============================ */
document.getElementById("finishBtn").onclick = () => {
    alert(i18n[currentLang].alertFinish);

    // здесь позже добавим SUPABASE
};

/* ============================
     AUTOMATIC TRANSLATION
============================ */
translate();
