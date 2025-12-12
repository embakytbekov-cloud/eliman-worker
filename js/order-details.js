// ================================
// ORDER DETAILS — ACCEPT FLOW
// ================================

const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

const clientName = document.getElementById("clientName");
const clientPhone = document.getElementById("clientPhone");
const addressEl = document.getElementById("address");
const timeEl = document.getElementById("time");
const priceEl = document.getElementById("price");
const notesEl = document.getElementById("notes");
const mapLink = document.getElementById("mapLink");
const acceptBtn = document.getElementById("acceptOrderBtn");

if (!window.db) throw new Error("Supabase not connected");

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
    return;
  }

  clientName.textContent = data.client_name || "—";
  clientPhone.textContent = data.client_phone || "—";
  addressEl.textContent = data.address || "—";
  timeEl.textContent = `${data.date} ${data.time}`;
  priceEl.textContent = `$${data.price}`;
  notesEl.textContent = data.notes || "—";

  mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`;
}

loadOrder();

// ================================
// ACCEPT ORDER ($1)
// ================================
acceptBtn.onclick = async () => {
  acceptBtn.disabled = true;
  acceptBtn.textContent = "Processing...";

  const tg = window.Telegram?.WebApp?.initDataUnsafe?.user;
  if (!tg?.id) {
    alert("Telegram user not found");
    return;
  }

  // 🔑 получаем worker_id
  const { data: worker } = await window.db
    .from("workers")
    .select("id")
    .eq("telegram_id", String(tg.id))
    .single();

  if (!worker) {
    alert("Worker not found");
    return;
  }

  // 🔥 ACCEPT
  const { error } = await window.db
    .from("orders")
    .update({
      status: "active",
      worker_id: worker.id
    })
    .eq("id", orderId)
    .eq("status", "pending"); // защита от двойного принятия

  if (error) {
    alert("Order already accepted");
    return;
  }

  // 👉 Переходим в Active
  window.location.href = "active.html";
};