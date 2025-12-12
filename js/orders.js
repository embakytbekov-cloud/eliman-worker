// ================================
// ORDERS PAGE — STEP 1 (READ ONLY)
// ================================

// читаем параметры
const params = new URLSearchParams(window.location.search);
const workerId = params.get("worker_id");
const lang = params.get("lang") || "en";

console.log("ORDERS PAGE");
console.log("workerId:", workerId);
console.log("lang:", lang);

// проверка подключения Supabase
if (!window.db) {
  alert("Supabase not connected");
  throw new Error("Supabase not connected");
}

// контейнер для заказов
const list = document.getElementById("ordersList");

if (!list) {
  alert("ordersList not found in HTML");
  throw new Error("ordersList missing");
}

// ================================
// LOAD ORDERS
// ================================
async function loadOrders() {
  console.log("Loading orders...");

  const { data, error } = await window.db
    .from("orders")        // ⚠️ ИМЯ ТАБЛИЦЫ — КАК У ТЕБЯ
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    alert("Error loading orders");
    return;
  }

  console.log("Orders loaded:", data);

  if (!data || data.length === 0) {
    list.innerHTML = `
      <div class="text-gray-400 text-center mt-10">
        No orders yet
      </div>
    `;
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
    const div = document.createElement("div");
    div.className = `
      bg-slate-800 rounded-xl p-4 mb-4
      border border-slate-700
    `;

    div.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <div class="font-bold text-lg text-white">
          ${order.service || "Service"}
        </div>
        <div class="text-green-400 font-semibold">
          $${order.price || "--"}
        </div>
      </div>

      <div class="text-gray-300 text-sm mb-1">
        ${order.address || "No address"}
      </div>

      <div class="text-gray-400 text-xs">
        Status: ${order.status || "new"}
      </div>
    `;

    list.appendChild(div);
  });
}

// ================================
// START
// ================================
loadOrders();