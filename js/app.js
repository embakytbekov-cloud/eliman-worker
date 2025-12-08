import { supabase } from "./config.js";

const tg = window.Telegram.WebApp;

// ШАГИ
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const headerTitle = document.getElementById("headerTitle");

let selectedCategory = null;
let uploadedPhoto = null;

// ---------- STEP 1 ----------
document.getElementById("nextBtn").onclick = () => {
    step1.classList.add("hidden");
    step2.classList.remove("hidden");
    headerTitle.textContent = "Категория";
};

// ---------- SELECT CATEGORY ----------
document.querySelectorAll(".category-card").forEach(card => {
    card.onclick = () => {
        document.querySelectorAll(".category-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        selectedCategory = card.dataset.cat;
    };
});

// ---------- STEP 2 ----------
document.getElementById("nextBtn2").onclick = () => {
    if (!selectedCategory) return alert("Выберите категорию");

    step2.classList.add("hidden");
    step3.classList.remove("hidden");
    headerTitle.textContent = "Фото профиля";
};

// ---------- PHOTO ----------
document.getElementById("photoPreview").onclick = () => {
    document.getElementById("photoInput").click();
};

document.getElementById("photoInput").onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    uploadedPhoto = file;

    const url = URL.createObjectURL(file);
    const preview = document.getElementById("photoPreview");
    preview.style.backgroundImage = url(${url});
    preview.style.backgroundSize = "cover";
    preview.textContent = "";
};

// ---------- FINISH ----------
document.getElementById("finishBtn").onclick = async () => {

    const fullName = document.getElementById("fullName").value;
    const phone = document.getElementById("phone").value;
    const street = document.getElementById("street").value;
    const apt = document.getElementById("apt").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const zip = document.getElementById("zip").value;
    const language = document.getElementById("language").value;

    if (!fullName  !phone  !street  !city  !state || !zip) {
        return alert("Заполните все обязательные поля");
    }

    // Upload Photo
    let photo_url = null;
    if (uploadedPhoto) {
        const filename = worker_${Date.now()}.jpg;
        const { data, error } = await supabase.storage
            .from("profiles")
            .upload(filename, uploadedPhoto);

        if (!error) {
            photo_url = supabase.storage.from("profiles").getPublicUrl(filename).data.publicUrl;
        }
    }

    // SAVE WORKER
    await supabase.from("workers").insert([
        {
            full_name: fullName,
            phone,
            street,
            apt,
            city,
            state,
            zip,
            language,
            category: selectedCategory,
            photo: photo_url,
            telegram_id: tg.initDataUnsafe.user?.id,
        }
    ]);

    tg.close();
};
