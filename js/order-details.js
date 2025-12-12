// ================================
// ORDER DETAILS PAGE
// ================================

const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

if (!orderId) {
  alert("Order ID missing");
  throw new Error("Order ID missing");
}

// DOM
const clientName = document.getElementById("clientName");
const clientPhone = document.getElementById("clientPhone");
const addressEl = document.getElementById("address");
const timeEl = document.getElementById("time");
const priceEl = document.getElementById("price");
const notesEl = document.getElementById("notes");
const mapLink = document.getElementById("mapLink");

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

  if (data.address) {
    mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`;
    mapLink.style.display = "inline-flex";
  }
}

loadOrder();