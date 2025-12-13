// ================================
// ORDER DETAILS — FIXED & CLEAN
// ================================

const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

if (!orderId) {
  alert("Order ID missing");
  throw new Error("Order ID missing");
}

// ================================
// DOM ELEMENTS (MUST MATCH HTML)
// ================================
const serviceName = document.getElementById("serviceName");
const clientName = document.getElementById("clientName");
const clientPhone = document.getElementById("clientPhone");
const addressEl = document.getElementById("address");
const mapsLink = document.getElementById("mapsLink");
const datetimeEl = document.getElementById("datetime");
const priceEl = document.getElementById("price");
const notesEl = document.getElementById("notes");
const acceptBtn = document.getElementById("acceptOrderBtn");

if (!window.db) {
  alert("Supabase not connected");
  throw new Error("Supabase not connected");
}

// ================================
// LOAD ORDER DETAILS
// ================================
async function loadOrder() {
  const { data, error } = await window.db
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !data) {
    alert("Order not found");
    console.error(error);
    return;
  }

  serviceName.textContent = data.service_name || "Service";
  clientName.textContent = data.client_name || "—";
  clientPhone.textContent = data.client_phone || "—";
  addressEl.textContent = data.address || "—";
  datetimeEl.textContent = `${data.date || ""} ${data.time || ""}`;
  priceEl.textContent = `$${data.price || "--"}`;
  notesEl.textContent = data.notes || "—";

  if (data.address) {
    mapsLink.href =
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`;
  } else {
    mapsLink.style.display = "none";
  }

  // 🔥 IMPORTANT: $1 ONLY HERE
  if (acceptBtn) {
    acceptBtn.textContent = "Принять заказ — $1";
  }
}

loadOrder();

// ================================
// ACCEPT ORDER (NO REAL PAYMENT YET)
// ================================
async function acceptOrder() {
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

  if (!tgUser?.id) {
    alert("Telegram user not found");
    return;
  }

  // Disable button to prevent double click
  if (acceptBtn) {
    acceptBtn.disabled = true;
    acceptBtn.textContent = "Обрабатывается...";
  }

  // Get worker by telegram_id
  const { data: worker, error: workerError } = await window.db
    .from("workers")
    .select("id")
    .eq("telegram_id", String(tgUser.id))
    .single();

  if (workerError || !worker) {
    alert("Worker not found");

    if (acceptBtn) {
      acceptBtn.disabled = false;
      acceptBtn.textContent = "Принять заказ — $1";
    }
    return;
  }

  // Update order (protect from double accept)
  const { error } = await window.db
    .from("orders")
    .update({
      status: "active",
      worker_id: worker.id
    })
    .eq("id", orderId)
    .eq("status", "new"); // 🔥 VERY IMPORTANT

  if (error) {
    alert("Order already accepted");
    console.error(error);

    if (acceptBtn) {
      acceptBtn.disabled = false;
      acceptBtn.textContent = "Принять заказ — $1";
    }
    return;
  }

  // Go to Active Orders
  window.location.href = "active.html";
}

// ================================
// CLOSE PAGE
// ================================
function closePage() {
  window.history.back();
}