console.log("APP JS LOADED");

// TELEGRAM
const tg = window.Telegram?.WebApp;
tg?.expand();

// DOM ELEMENTS
const headerTitle = document.getElementById("headerTitle");

const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const doneScreen = document.getElementById("doneScreen");

const toStep2Btn = document.getElementById("toStep2Btn");
const toStep3Btn = document.getElementById("toStep3Btn");
const finishBtn = document.getElementById("finishBtn");

// INPUTS
const fullName = document.getElementById("fullName");
const phone = document.getElementById("phone");
const addressLine1 = document.getElementById("addressLine1");
const addressLine2 = document.getElementById("addressLine2");
const city = document.getElementById("city");
const state = document.getElementById("state");
const zip = document.getElementById("zip");
const language = document.getElementById("language");

// PHOTO
const photoPreview = document.getElementById("photoPreview");
const photoInput = document.getElementById("photoInput");

// SERVICES (multiple)
const serviceCards = document.querySelectorAll(".category-card");
let selectedServices = new Set();

/* -----------------------------
      STEP: SERVICE SELECT
--------------------------------*/
serviceCards.forEach(card => {
    card.addEventListener("click", () => {
        const key = card.dataset.service;

        if (selectedServices.has(key)) {
            selectedServices.delete(key);
            card.classList.remove("selected");
        } else {
            selectedServices.add(key);
            card.classList.add("selected");
        }
    });
});

/* -----------------------------
      STEP 1 → STEP 2
--------------------------------*/
toStep2Btn.addEventListener("click", () => {
    if (
        fullName.value.trim() === "" ||
        phone.value.trim() === "" ||
        addressLine1.value.trim() === "" ||
        city.value.trim() === "" ||
        zip.value.trim() === ""
    ) {
        alert("Заполните обязательные поля");
        return;
    }

    step1.classList.add("hidden");
    step2.classList.remove("hidden");
    headerTitle.textContent = "Услуги";
});

/* -----------------------------
      STEP 2 → STEP 3
--------------------------------*/
toStep3Btn.addEventListener("click", () => {
    if (selectedServices.size === 0) {
        alert("Выберите минимум одну услугу");
        return;
    }

    step2.classList.add("hidden");
    step3.classList.remove("hidden");
    headerTitle.textContent = "Фото профиля";
});

/* -----------------------------
      PHOTO UPLOAD
--------------------------------*/
photoPreview.addEventListener("click", () => photoInput.click());

photoInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    photoPreview.style.backgroundImage = `url(${url})`;
    photoPreview.style.backgroundSize = "cover";
    photoPreview.textContent = "";
});

/* -----------------------------
      FINISH REGISTRATION
--------------------------------*/
finishBtn.addEventListener("click", () => {
    const data = {
        fullName: fullName.value,
        phone: phone.value,
        addressLine1: addressLine1.value,
        addressLine2: addressLine2.value,
        city: city.value,
        state: state.value,
        zip: zip.value,
        language: language.value,
        services: Array.from(selectedServices),
        hasPhoto: !!photoInput.files[0]
    };

    console.log("FINAL DATA:", data);

    step3.classList.add("hidden");
    doneScreen.classList.remove("hidden");
    headerTitle.textContent = "Готово 🎉";

    tg?.sendData(JSON.stringify(data));
});
