import { supabase } from "./supabaseClient.js";

let selectedLanguage = null;
let selectedCategory = null;
let selectedPhotoFile = null;

// STEP BUTTONS
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");

// Language selection
document.querySelectorAll(".lang-card").forEach(card => {
    card.onclick = () => {
        document.querySelectorAll(".lang-card")
            .forEach(c => c.classList.remove("selected"));

        card.classList.add("selected");
        selectedLanguage = card.dataset.lang;
    };
});

// Continue to step 2
window.goStep2 = function () {
    if (!selectedLanguage) {
        alert("Пожалуйста, выберите язык");
        return;
    }
    step1.classList.add("hidden");
    step2.classList.remove("hidden");
};

// Category selection
document.querySelectorAll(".category-card").forEach(card => {
    card.onclick = () => {
        document.querySelectorAll(".category-card")
            .forEach(c => c.classList.remove("selected"));

        card.classList.add("selected");
        selectedCategory = card.dataset.cat;
    };
});

// Continue to step 3
window.goStep3 = function () {
    if (!selectedCategory) {
        alert("Выберите категорию");
        return;
    }
    step2.classList.add("hidden");
    step3.classList.remove("hidden");
};

// Photo preview
document.getElementById("photoInput").onchange = (e) => {
    selectedPhotoFile = e.target.files[0];
    if (!selectedPhotoFile) return;

    const url = URL.createObjectURL(selectedPhotoFile);
    const preview = document.getElementById("photoPreview");
    preview.style.backgroundImage = `url(${url})`;
    preview.style.backgroundSize = "cover";
    preview.style.border = "none";
};

// Final registration
window.finishRegistration = async function () {
    const fullName = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const city = document.getElementById("city").value.trim();
    const zipcode = document.getElementById("zipcode").value.trim();

    if (!fullName || !phone || !city || !zipcode) {
        alert("Заполните все поля");
        return;
    }

    let photoUrl = null;

    if (selectedPhotoFile) {
        const fileName = `profile_${Date.now()}.jpg`;

        const { data: storageData, error: storageError } = await supabase
            .storage
            .from("worker_photos")
            .upload(fileName, selectedPhotoFile);

        if (storageError) {
            alert("Ошибка загрузки фото");
            console.log(storageError);
            return;
        }

        photoUrl = `https://ccqldccmikwdjkbxmcsn.supabase.co/storage/v1/object/public/worker_photos/${fileName}`;
    }

    const { error } = await supabase.from("workers").insert({
        full_name: fullName,
        phone: phone,
        city: city,
        zipcode: zipcode,
        language: selectedLanguage,
        category: selectedCategory,
        photo_url: photoUrl
    });

    if (error) {
        alert("Ошибка регистрации");
        console.log(error);
        return;
    }

    alert("Регистрация завершена!");
};
