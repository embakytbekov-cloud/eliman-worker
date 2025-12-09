// ------------------------------
//  SUPABASE CONFIG
// ------------------------------
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://ccqldccmikwdjkbxmcsn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcWxkY2NtaWt3ZGprYnhtY3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMzIxODEsImV4cCI6MjA4MDcwODE4MX0.ce7CPoACHTU6ryGjoELPywa1rpGmDKG5TIZxPFbleuA";

export const supabase = createClient(supabaseUrl, supabaseKey);

// -------------------------------------
// GLOBAL STATE
// -------------------------------------
let selectedCategory = null;
let selectedFile = null;
let currentLang = "ru";

// -------------------------------------
// STEP CHANGERS
// -------------------------------------
window.goToStep1 = function () {
  langStep.classList.add("hidden");
  step1.classList.remove("hidden");
};

window.goToStep2 = function () {
  step1.classList.add("hidden");
  step2.classList.remove("hidden");
};

window.goToStep3 = function () {
  if (!selectedCategory) {
    alert("Выберите категорию");
    return;
  }
  step2.classList.add("hidden");
  step3.classList.remove("hidden");
};

// -------------------------------------
// SELECT CATEGORY
// -------------------------------------
document.querySelectorAll(".category-card").forEach((c) => {
  c.addEventListener("click", () => {
    document
      .querySelectorAll(".category-card")
      .forEach((x) => x.classList.remove("selected"));

    c.classList.add("selected");
    selectedCategory = c.dataset.cat;
  });
});

// -------------------------------------
// PROFILE PHOTO
// -------------------------------------
const photoCircle = document.getElementById("photoCircle");
const photoInput = document.getElementById("photoInput");

photoCircle.addEventListener("click", () => photoInput.click());

photoInput.addEventListener("change", (e) => {
  selectedFile = e.target.files[0];
  if (!selectedFile) return;

  const url = URL.createObjectURL(selectedFile);

  photoCircle.style.backgroundImage = `url(${url})`;
  photoCircle.style.backgroundSize = "cover";
  photoCircle.textContent = "";
});

// -------------------------------------
// FINISH REGISTRATION
// -------------------------------------
window.finishRegistration = async function () {
  const fullName = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const street = document.getElementById("street").value.trim();
  const apt = document.getElementById("apt").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const zip = document.getElementById("zip").value.trim();

  if (!fullName || !phone || !street || !city || !state || !zip) {
    alert("Заполните все поля");
    return;
  }

  let photoUrl = null;

  if (selectedFile) {
    const fileName = `worker_${Date.now()}.jpg`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("worker-photos")
      .upload(fileName, selectedFile);

    if (uploadError) {
      console.error(uploadError);
      alert("Ошибка загрузки фото");
      return;
    }

    photoUrl =
      supabaseUrl + "/storage/v1/object/public/worker-photos/" + fileName;
  }

  const { data, error } = await supabase.from("workers").insert([
    {
      full_name: fullName,
      phone,
      street,
      apt,
      city,
      state,
      zip,
      category: selectedCategory,
      photo_url: photoUrl,
      lang: currentLang,
      created_at: new Date(),
    },
  ]);

  if (error) {
    console.error(error);
    alert("Ошибка регистрации");
    return;
  }

  alert("Регистрация завершена!");
  window.location.href = "index.html";
};

// -------------------------------------
// LANGUAGE SELECTION
// -------------------------------------
document.querySelectorAll(".language-card").forEach((card) => {
  card.onclick = () => {
    currentLang = card.dataset.lang;

    langStep.classList.add("hidden");
    step1.classList.remove("hidden");
  };
});
