// ================================
// ORDERS PAGE — BASE VERSION
// NO FILTERS, NO WORKERS
// ================================

// params
const params = new URLSearchParams(window.location.search);
const lang = params.get("lang") || "en";

console.log("ORDERS PAGE LOADED");

// supabase check
if (!window.db) {
  alert("Supabase not connected");
  throw new Error("Supabase not connected");
}

// container
const list = document.getElementById("ordersList");

if (!list) {
  alert("ordersList not found");
  throw new Error("ordersList missing");
}

// ================================
// LOAD ORDERS
// ================================
async function loadOrders() {
  console.log("Loading orders...");

  const { data, error } = await window.db
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    list.innerHTML = `<div class="text-red-400 text-center mt-10">
      Error loading orders
    </div>`;
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = `<div class="text-slate-400 text-center mt-10">
      No orders yet
    </div>`;
    return;
  }

  renderOrders(data);
}

// ================================
// RENDER
// ================================
function renderOrders(orders) {
  list.innerHTML = "";

  orders.forEach(order => {
    const card = document.createElement("div");

    card.className = `
      bg-slate-800/90
      border border-slate-700
      rounded-2xl
      p-4
      shadow-lg
    `;

    card.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <div>
          <div class="text-lg font-bold text-white">
            ${order.service_name || "Service"}
          </div>
          <div class="text-sm text-slate-400">
            ${order.service_type || ""}
          </div>
        </div>

        <div class="px-4 py-1 rounded-full bg-emerald-500 text-black font-bold">
          $${order.price || "--"}
        </div>
      </div>

      <div class="text-sm text-slate-300 mb-1">
        📍 ${order.address || "No address"}
      </div>

      <div class="text-xs text-slate-400">
        🕒 ${order.date || ""} ${order.time || ""}
      </div>
    `;

    list.appendChild(card);
  });
}

// ================================
// START
// ================================
loadOrders();