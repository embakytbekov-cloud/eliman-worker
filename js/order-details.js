// ================================
// ORDER DETAILS
// ================================

const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

if (!orderId) {
  alert("Order ID missing");
  throw new Error("Order ID missing");
}

const el = id => document.getElementById(id);

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

  el("serviceName").textContent = data.service_name || "Service";
  el("clientName").textContent = data.client_name || "";
  el("clientPhone").textContent = data.client_phone || "";
  el("address").textContent = data.address || "";
  el("datetime").textContent = `${data.date || ""} ${data.time || ""}`;
  el("price").textContent = `$${data.price || ""}`;
  el("notes").textContent = data.notes || "";

  el("mapsLink").href =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(data.address);
}

async function acceptOrder() {
  const tg = window.Telegram?.WebApp?.initDataUnsafe?.user;
  if (!tg?.id) {
    alert("Telegram user not found");
    return;
  }

  const { error } = await window.db
    .from("orders")
    .update({
      status: "accepted",
      worker_id: tg.id
    })
    .eq("id", orderId);

  if (error) {
    alert("Failed to accept order");
    return;
  }

  alert("Order accepted!");
  window.location.href = "orders.html";
}

function closePage() {
  window.history.back();
}

loadOrder();