import { supabase } from "./supabaseClient.js";

let selectedLanguage = null;
let selectedCategory = null;
let selectedPhotoFile = null;

// STEP SECTIONS
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");

// LANGUAGE SELECT
document.querySelectorAll(".lang-card").forEach(card => {
    card.onclick = () => {
        document.querySelectorAll(".lang-card")
            .forEach(c => c.classList.remove("selected"));

        card.classList.add("selected");
        selectedLanguage = card.dataset.lang;
    };
});

// GO TO STEP 2
window.goStep2 = function () {
    if (!selectedLanguage) {
        alert("Please select a language");
        return;
    }
    step1.classList.add("hidden");
    step2.classList.remove("hidden");
};

// CATEGORY SELECT
document.querySelectorAll(".category-card").forEach(card => {
    card.onclick = () => {
        document.querySelectorAll(".category-card")
            .forEach(c => c.classList.remove("selected"));

        card.classList.add("selected");
        selectedCategory = card.dataset.cat;
    };
});

// GO TO STEP 3
window.goStep3 = function () {
    if (!selectedCategory) {
        alert("Please select a service category");
        return;
    }
    step2.classList.add("hidden");
    step3.classList.remove("hidden");
};

// PHOTO PREVIEW
document.getElementById("photoInput").onchange = (e) => {
    selectedPhotoFile = e.target.files[0];
    if (!selectedPhotoFile) return;

    const url = URL.createObjectURL(selectedPhotoFile);
    const preview = document.getElementById("photoPreview");
    preview.style.backgroundImage = `url(${url})`;
    preview.style.backgroundSize = "cover";
    preview.style.backgroundPosition = "center";
    preview.style.border = "none";
};

// FINAL REGISTRATION
window.finishRegistration = async function () {
    const fullName = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const street = document.getElementById("street").value.trim();
    const apt = document.getElementById("apt").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const zipcode = document.getElementById("zipcode").value.trim();

    if (!fullName || !phone || !city || !zipcode) {
        alert("Please fill all required fields");
        return;
    }

    let photoUrl = null;

    // UPLOAD PHOTO
    if (selectedPhotoFile) {
        const fileName = `profile_${Date.now()}.jpg`;

        const { error: uploadError } = await supabase
            .storage
            .from("worker_photos")
            .upload(fileName, selectedPhotoFile);

        if (uploadError) {
            alert("Photo upload failed");
            console.log(uploadError);
            return;
        }

        photoUrl =
            `https://ccqldccmikwdjkbxmcsn.supabase.co/storage/v1/object/public/worker_photos/${fileName}`;
    }

    // INSERT INTO TABLE
    const { error } = await supabase.from("workers").insert({
        full_name: fullName,
        phone: phone,
        street: street,
        apt: apt,
        city: city,
        state: state,
        zipcode: zipcode,
        language: selectedLanguage,
        category: selectedCategory,
        photo_url: photoUrl
    });

    if (error) {
        alert("Registration failed");
        console.log(error);
        return;
    }

    alert("Registration complete!");
};
