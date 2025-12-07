export function showMainApp(worker) {
  document.getElementById("registerScreen").classList.add("hidden");
  document.getElementById("mainScreen").classList.remove("hidden");

  window.currentWorker = worker;

  // Optional: обновить профиль
  // updateProfileUI(worker);
}
