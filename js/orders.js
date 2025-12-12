// ================================
// ORDERS PAGE — LOAD BY SKILLS
// ================================

// читаем параметры из URL
const params = new URLSearchParams(window.location.search);
const workerId = params.get("worker_id");
const lang = params.get("lang") || "en";

console.log("ORDERS PAGE");
console.log("workerId:", workerId);
console.log("lang:", lang);

// проверка Supabase
if (!window.db) {
  alert("Supabase not connected");
  throw new Error("Supabase not connected");
}

// контейнер
const list = document.getElementById("ordersList");
if (!list) {
  alert("ordersList not found");
  throw new Error("ordersList missing");
}

// ================================
// LOAD ORDERS (BY WORKER SKILLS)
// ================================
async function loadOrders() {
  console.log("Loading orders...");

  // 1️⃣ получаем worker
  const { data: worker, error: workerError } = await window.db
    .from("workers")
    .select("skills")
    .eq("id", workerId)
    .single();

  if (workerError || !worker) {
    console.error(workerError);
    list.innerHTML = `
      <div class="text-red-400 text-center mt-10">
        Worker not found
      </div>
    `;
    return;
  }

  const skills = worker.skills || [];
  console.log("Worker skills:", skills);

  if (skills.length === 0) {
    list.innerHTML = `
      <div class="text-gray-400 text-center mt-10">
        No skills selected
      </div>
    `;
    return;
  }

  // 2️⃣ загружаем заказы по навыкам
  const { data: orders, error } = await window.db
    .from("orders")
    .select("*")
    .in("service_type", skills)        // 🔥 ФИЛЬТР ПО НАВЫКАМ
    .eq("status", "pending")           // 🔥 только новые
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    list.innerHTML = `
      <div class="text-red-400 text-center mt-10">
        Error loading orders
      </div>
    `;
    return;
  }

  console.log("Orders loaded:", orders);

  if (!orders || orders.length === 0) {
    list.innerHTML = `
      <div class="text-gray-400 text-center mt-10">
        No orders yet
      </div>
    `;
    return;
  }

  renderOrders(orders);
}

// ================================
// RENDER ORDERS
// ================================
function renderOrders(orders) {
  list.innerHTML = "";

  orders.forEach(order => {
    const div = document.createElement("div");
    div.className = `
      bg-slate-800 rounded-2xl p-4 mb-4
      border border-slate-700
    `;

    div.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <div class="font-bold text-lg text-white">
          ${order.service_name || order.service_type}
        </div>
        <div class="text-emerald-400 font-semibold text-lg">
          $${order.price || "--"}
        </div>
      </div>

      <div class="text-gray-300 text-sm mb-1">
        📍 ${order.address || "No address"}
      </div>

      <div class="text-gray-400 text-xs mb-3">
        🕒 ${order.date || ""} ${order.time || ""}
      </div>

      <button
        class="w-full py-2 rounded-xl bg-emerald-500 text-black font-bold">
        Подробнее →
      </button>
    `;

    list.appendChild(div);
  });
}

// ================================
// START
// ================================
loadOrders();