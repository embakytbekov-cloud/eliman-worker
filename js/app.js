// STEP BLOCKS
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const doneScreen = document.getElementById("doneScreen");

// BUTTON 1 — Далее (О вас)
document.getElementById("step1NextBtn").addEventListener("click", () => {
    if (!fullName.value.trim() ||
        !phone.value.trim() ||
        !street.value.trim() ||
        !city.value.trim() ||
        !state.value.trim() ||
        !zip.value.trim()) {
        alert("Заполните все обязательные поля");
        return;
    }

    step1.classList.add("hidden");
    step2.classList.remove("hidden");
});


// CATEGORY SELECT
let selectedCategory = null;

document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
        document.querySelectorAll(".category-card")
            .forEach(c => c.classList.remove("ring-2", "ring-green-500"));

        card.classList.add("ring-2", "ring-green-500");
        selectedCategory = card.dataset.cat;
    });
});


// BUTTON 2 — Далее (Категории)
document.getElementById("toPhotoBtn").addEventListener("click", () => {
    if (!selectedCategory) {
        alert("Выберите категорию");
        return;
    }

    step2.classList.add("hidden");
    step3.classList.remove("hidden");
});


// PHOTO UPLOAD
const photoInput = document.getElementById("photoInput");
const photoPreview = document.getElementById("photoPreview");

photoPreview.onclick = () => photoInput.click();

photoInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    photoPreview.style.backgroundImage = url(${url});
    photoPreview.style.backgroundSize = "cover";
    photoPreview.style.backgroundPosition = "center";
    photoPreview.textContent = "";
};


// BUTTON 3 — Завершить
document.getElementById("finishBtn").addEventListener("click", () => {
    if (!photoInput.files[0]) {
        alert("Загрузите фото");
        return;
    }

    step3.classList.add("hidden");
    doneScreen.classList.remove("hidden");
});
