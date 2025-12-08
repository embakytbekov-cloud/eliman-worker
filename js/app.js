// ELIMAN WORKER – Uber-style registration

const tg = window.Telegram?.WebApp;
if (tg) {
  tg.expand();
  tg.disableVerticalSwipes?.();
}

// DOM элементы
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const doneScreen = document.getElementById("doneScreen");

const headerTitle = document.getElementById("headerTitle");
const closeBtn = document.getElementById("closeBtn");

const toStep2Btn = document.getElementById("toStep2Btn");
const toStep3Btn = document.getElementById("toStep3Btn");
const finishBtn = document.getElementById("finishBtn");

const fullNameInput = document.getElementById("fullName");
const phoneInput = document.getElementById("phone");
const addressLine1Input = document.getElementById("addressLine1");
const addressLine2Input = document.getElementById("addressLine2");
const cityInput = document.getElementById("city");
const stateInput = document.getElementById("state");
const zipInput = document.getElementById("zip");
const languageSelect = document.getElementById("language");

const photoPreview = document.getElementById("photoPreview");
const photoInput = document.getElementById("photoInput");

const serviceCards = document.querySelectorAll(".category-card");
const selectedServices = new Set();

// Выбор сервисов (мультивыбор)
serviceCards.forEach(card => {
  card.addEventListener("click", () => {
    const service = card.dataset.service;
    if (!service) return;

    if (selectedServices.has(service)) {
      selectedServices.delete(service);
      card.classList.remove("selected");
    } else {
      selectedServices.add(service);
      card.classList.add("selected");
    }
  });
});

// Фото профиля – открыть селектор
photoPreview.addEventListener("click", () => {
  photoInput.click();
});

// Фото профиля – превью
photoInput.addEventListener("change", event => {
  const file = event.target.files?.[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  photoPreview.style.backgroundImage = `url(${url})`;
  photoPreview.style.backgroundSize = "cover";
  photoPreview.style.backgroundPosition = "center";
  photoPreview.style.borderStyle = "solid";
  photoPreview.textContent = "";
});

// Кнопка "Закрыть"
closeBtn.addEventListener("click", () => {
  if (tg) {
    tg.close();
  } else {
    window.close();
  }
});

// Валидация шага 1
function validateStep1() {
  const fullName = fullNameInput.value.trim();
  const phone = phoneInput.value.trim();
  const address1 = addressLine1Input.value.trim();
  const city = cityInput.value.trim();
  const zip = zipInput.value.trim();

  if (!fullName || !phone || !address1 || !city || !zip) {
    alert("Заполните имя, телефон, улицу, город и ZIP.");
    return false;
  }
  return true;
}

// Переход на шаг 2
toStep2Btn.addEventListener("click", () => {
  if (!validateStep1()) return;

  step1.classList.add("hidden");
  step2.classList.remove("hidden");
  headerTitle.textContent = "Услуги";
});

// Переход на шаг 3
toStep3Btn.addEventListener("click", () => {
  if (selectedServices.size === 0) {
    alert("Выберите хотя бы одну услугу.");
    return;
  }

  step2.classList.add("hidden");
  step3.classList.remove("hidden");
  headerTitle.textContent = "Фото профиля";
});

// Завершение регистрации
finishBtn.addEventListener("click", () => {
  const worker = {
    full_name: fullNameInput.value.trim(),
    phone: phoneInput.value.trim(),
    address_line1: addressLine1Input.value.trim(),
    address_line2: addressLine2Input.value.trim(),
    city: cityInput.value.trim(),
    state: stateInput.value.trim(),
    zip: zipInput.value.trim(),
    language: languageSelect.value || null,
    services: Array.from(selectedServices),
    // фото мы пока не заливаем, только факт наличия
    has_photo: !!photoInput.files?.[0]
  };

  console.log("Worker registration:", worker);

  if (tg) {
    try {
      tg.sendData(JSON.stringify(worker));
    } catch (e) {
      console.error("Telegram sendData error:", e);
    }
  }

  step1.classList.add("hidden");
  step2.classList.add("hidden");
  step3.classList.add("hidden");
  doneScreen.classList.remove("hidden");
  headerTitle.textContent = "Готово";
});
