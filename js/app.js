console.log("App.js loaded");

// ------------------------------
//  ЭЛЕМЕНТЫ
// ------------------------------
const step1 = document.getElementById("step1");
const categoriesStep = document.getElementById("categoriesStep");
const photoStep = document.getElementById("photoStep");

const toCategoriesBtn = document.getElementById("toCategories");
const toPhotoBtn = document.getElementById("toPhoto");
const finishBtn = document.getElementById("finishBtn");

const photoPreview = document.getElementById("photoPreview");
const photoInput = document.getElementById("photoInput");

let selectedCategory = null;
let uploadedPhotoFile = null;

// ------------------------------
//  ШАГ 1 → ШАГ КАТЕГОРИЙ
// ------------------------------
toCategoriesBtn.onclick = () => {
    const name = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const street = document.getElementById("street").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const zip = document.getElementById("zip").value.trim();

    if (!name || !phone || !street || !city || !state || !zip) {
        alert("Пожалуйста заполните все обязательные поля");
        return;
    }

    // Переход
    step1.classList.add("hidden");
    categoriesStep.classList.remove("hidden");
};

// ------------------------------
//  ВЫБОР КАТЕГОРИИ
// ------------------------------
document.querySelectorAll(".category-card").forEach(card => {
    card.onclick = () => {
        // Удалить выделение у всех
        document.querySelectorAll(".category-card")
            .forEach(c => c.classList.remove("selected"));

        // Выделить выбранную
        card.classList.add("selected");
        selectedCategory = card.dataset.cat;

        console.log("Category selected:", selectedCategory);
    };
});

// ------------------------------
//  ШАГ КАТЕГОРИЙ → ШАГ ФОТО
// ------------------------------
toPhotoBtn.onclick = () => {
    if (!selectedCategory) {
        alert("Выберите категорию");
        return;
    }

    categoriesStep.classList.add("hidden");
    photoStep.classList.remove("hidden");
};

// ------------------------------
//  ВЫБОР ФОТО
// ------------------------------
photoPreview.onclick = () => {
    photoInput.click();
};

photoInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        uploadedPhotoFile = file;
        const url = URL.createObjectURL(file);

        photoPreview.style.backgroundImage = `url(${url})`;
        photoPreview.style.backgroundSize = "cover";
        photoPreview.style.border = "none";
        photoPreview.textContent = "";
    }
};

// ------------------------------
//  ФИНИШ
// ------------------------------
finishBtn.onclick = () => {
    if (!uploadedPhotoFile) {
        alert("Выберите фото профиля");
        return;
    }

    alert("Регистрация завершена! 🎉");

    // TODO: Здесь мы подключим Supabase
    // upload photo → insert worker → redirect to main app
};
