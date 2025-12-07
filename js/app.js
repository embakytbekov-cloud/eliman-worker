import { initAuth, registerWorker } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  initAuth();
});

document.getElementById("registerBtn").addEventListener("click", () => {
  registerWorker();
});
