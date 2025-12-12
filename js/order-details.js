// ================================
// ORDER DETAILS — FIXED VERSION
// ================================

const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

if (!orderId) {
  alert("Order ID missing");
  throw new Error("Order ID missing");
}

// DOM (ТОЧНО как в HTML)
const serviceName = document.getElementById("serviceName");
const clientName = document.getElementById("clientName");
const clientPhone = document.getElementById("clientPhone");
const addressEl = document.getElementById("address");
const mapsLink = document.getElementById("mapsLink");
const datetimeEl = document.getElementById("datetime");
const priceEl = document.getElementById("price");
const notesEl = document.getElementById("notes");

if (!window.db) {
  alert("Supabase not connected");
  throw new Error("Supabase not connected");
}

// ================================
// LOAD ORDER
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
}

loadOrder();

// ================================
// ACCEPT ORDER ($1 LOGIC LATER)
// ================================
async function acceptOrder() {
  const tg = window.Telegram?.WebApp?.initDataUnsafe?.user;

  if (!tg?.id) {
    alert("Telegram user not found");
    return;
  }

  // Получаем worker
  const { data: worker, error: wErr } = await window.db
    .from("workers")
    .select("id")
    .eq("telegram_id", String(tg.id))
    .single();

  if (wErr || !worker) {
    alert("Worker not found");
    return;
  }

  // Обновляем заказ
  const { error } = await window.db
    .from("orders")
    .update({
      status: "active",
      worker_id: worker.id
    })
    .eq("id", orderId)
    .eq("status", "new"); // 🔥 ВАЖНО: совпадает с orders page

  if (error) {
    alert("Order already accepted");
    console.error(error);
    return;
  }

  // 👉 В Active
  window.location.href = "active.html";
}

// ================================
// CLOSE PAGE
// ================================
function closePage() {
  window.history.back();
}