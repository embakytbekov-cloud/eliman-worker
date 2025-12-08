import { registerWorker, checkExistingWorker } from "./auth.js";

// Telegram init
const tg = window.Telegram.WebApp;
tg.expand();

document.addEventListener("DOMContentLoaded", async () => {
    console.log("App loaded");

    const isRegistered = await checkExistingWorker();

    if (isRegistered) {
        showMainScreen(isRegistered);
    }

    const btn = document.getElementById("registerBtn");
    if (btn) {
        btn.addEventListener("click", async () => {
            const worker = await registerWorker();
            if (worker) showMainScreen(worker);
        });
    }
});

function showMainScreen(worker) {
    document.getElementById("registerScreen").classList.add("hidden");
    document.getElementById("mainScreen").classList.remove("hidden");

    document.getElementById("workerName").textContent =
        Здравствуйте, ${worker.full_name};
}
