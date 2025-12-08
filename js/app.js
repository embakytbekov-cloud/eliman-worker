// js/app.js

document.addEventListener("DOMContentLoaded", () => {
  // --- элементы шапки ---
  const headerTitle = document.getElementById("headerTitle");
  const headerSubtitle = document.getElementById("headerSubtitle");

  // --- шаги ---
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");
  const doneScreen = document.getElementById("doneScreen");

  // --- кнопки ---
  const step1NextBtn = document.getElementById("step1NextBtn");
  const toPhotoBtn = document.getElementById("toPhotoBtn");
  const finishBtn = document.getElementById("finishBtn");

  // --- поля шага 1 ---
  const fullNameInput = document.getElementById("fullName");
  const phoneInput = document.getElementById("phone");
  const streetInput = document.getElementById("street");
  const cityInput = document.getElementById("city");
  const zipInput = document.getElementById("zip");
  const languageSelect = document.getElementById("language");

  // простая функция показать один шаг, скрыть остальные
  function showStep(stepNumber) {
    const all = [step1, step2, step3, doneScreen];
    all.forEach((el) => el && el.classList.add("hidden"));

    if (stepNumber === 1 && step1) {
      step1.classList.remove("hidden");
      headerTitle.textContent = "Регистрация";
      headerSubtitle.textContent = "О вас";
    }

    if (stepNumber === 2 && step2) {
      step2.classList.remove("hidden");
      headerTitle.textContent = "Регистрация";
      headerSubtitle.textContent = "Категория услуг";
    }

    if (stepNumber === 3 && step3) {
      step3.classList.remove("hidden");
      headerTitle.textContent = "Регистрация";
      headerSubtitle.textContent = "Фото профиля";
    }

    if (stepNumber === 4 && doneScreen) {
      doneScreen.classList.remove("hidden");
      headerTitle.textContent = "Готово";
      headerSubtitle.textContent = "";
    }
  }

  // сразу показываем шаг 1
  showStep(1);

  // --- КЛИК ПО "ДАЛЕЕ" НА ШАГЕ 1 ---
  if (step1NextBtn) {
    step1NextBtn.addEventListener("click", () => {
      const fullName = fullNameInput.value.trim();
      const phone = phoneInput.value.trim();
      const street = streetInput.value.trim();
      const city = cityInput.value.trim();
      const zip = zipInput.value.trim();
      const lang = languageSelect.value.trim();

      // простая проверка
      if (!fullName  !phone  !street  !city  !zip || !lang) {
        alert("Заполни все обязательные поля");
        return;
      }

      // здесь позже добавим отправку в Supabase
      console.log("STEP 1 DATA:", {
        fullName,
        phone,
        street,
        city,
        zip,
        lang,
      });

      showStep(2);
    });
  }

  // --- КЛИК ПО "ДАЛЕЕ К ФОТО" НА ШАГЕ 2 ---
  if (toPhotoBtn) {
    toPhotoBtn.addEventListener("click", () => {
      showStep(3);
    });
  }

  // --- КЛИК ПО "ЗАВЕРШИТЬ РЕГИСТРАЦИЮ" НА ШАГЕ 3 ---
  if (finishBtn) {
    finishBtn.addEventListener("click", () => {
      // тут потом будет загрузка фото + запись в Supabase
      console.log("registration finished (without Supabase yet)");
      showStep(4);
    });
  }
});
