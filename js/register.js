let lang = "ru";
let selectedCategory = null;

// LANGUAGE SELECT
document.querySelectorAll(".lang").forEach(btn => {
  btn.onclick = () => {
    lang = btn.dataset.lang;
    document.getElementById("stepLang").classList.add("hidden");
    document.getElementById("step1").classList.remove("hidden");
  };
});

// STEP 1 → STEP 2
document.getElementById("next1").onclick = () => {
  document.getElementById("step1").classList.add("hidden");
  document.getElementById("step2").classList.remove("hidden");
};

// CATEGORY SELECT
document.querySelectorAll(".category").forEach(card => {
  card.onclick = () => {
    document.querySelectorAll(".category").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    selectedCategory = card.dataset.cat;
  };
});

// STEP 2 → STEP 3
document.getElementById("next2").onclick = () => {
  if (!selectedCategory) {
    alert("Выберите категорию");
    return;
  }
  document.getElementById("step2").classList.add("hidden");
  document.getElementById("step3").classList.remove("hidden");
};

// PHOTO UPLOAD
document.getElementById("photoBox").onclick = () => {
  document.getElementById("photoInput").click();
};

document.getElementById("photoInput").onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  const box = document.getElementById("photoBox");

  box.style.backgroundImage = `url(${url})`;
  box.style.backgroundSize = "cover";
  box.style.color = "transparent";
  box.style.border = "none";
};

// FINISH
document.getElementById("finishBtn").onclick = () => {
  alert("Регистрация завершена!");
};
