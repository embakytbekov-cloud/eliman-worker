// ================================
// ORDERS PAGE — FINAL VERSION
// language FROM workers.language
// ================================

// params
const params = new URLSearchParams(window.location.search);
const workerId = params.get("worker_id");

if (!workerId) {
  alert("worker_id missing");
  throw new Error("worker_id missing");
}

// supabase check
if (!window.db) {
  alert("Supabase not connected");
  throw new Error("Supabase not connected");
}

// container
const list = document.getElementById("ordersList");
if (!list) throw new Error("ordersList missing");

// ================================
// I18N
// ================================
const i18n = {
  en: {
    title: "Worker Console",
    subtitle: "New orders available for your skills",
    tabOrders: "Orders",
    tabActive: "Active",
    tabProfile: "Profile",
    noOrders: "No orders yet",
    errorLoading: "Error loading orders"
  },
  ru: {
    title: "Консоль работника",
    subtitle: "Новые заказы, доступные по вашим навыкам",
    tabOrders: "Заказы",
    tabActive: "Активные",
    tabProfile: "Профиль",
    noOrders: "Нет заказов",
    errorLoading: "Ошибка загрузки заказов"
  },
  es: {
    title: "Consola del trabajador",
    subtitle: "Nuevos pedidos disponibles según tus habilidades",
    tabOrders: "Pedidos",
    tabActive: "Activos",
    tabProfile: "Perfil",
    noOrders: "Aún no hay pedidos",
    errorLoading: "Error al cargar pedidos"
  }
};

let t = i18n.en; // временно

// ================================
// LOAD WORKER LANGUAGE
// ================================
async function loadWorkerLanguage() {
  const { data, error } = await window.db
    .from("workers")
    .select("language")
    .eq("id", workerId)
    .single();

  if (error || !data) {
    console.error("Worker language error", error);
    return "en";
  }

  return data.language || "en";
}

// ================================
// APPLY UI TEXT
// ================================
function applyUI() {
  document.getElementById("pageTitle").textContent = t.title;
  document.getElementById("pageSubtitle").textContent = t.subtitle;
  document.getElementById("tabOrders").textContent = t.tabOrders;
  document.getElementById("tabActive").textContent = t.tabActive;
  document.getElementById("tabProfile").textContent = t.tabProfile;
}

// ================================
// LOAD ORDERS
// ================================
async function loadOrders() {
  const { data, error } = await window.db
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    list.innerHTML = `<div class="text-red-400 text-center mt-10">${t.errorLoading}</div>`;
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = `<div class="text-slate-400 text-center mt-10">${t.noOrders}</div>`;
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
    card.className = "bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-lg";

    card.innerHTML = `
      <div class="flex justify-between mb-2">
        <div>
          <div class="text-lg font-bold">${order.service_name}</div>
          <div class="text-sm text-slate-400">${order.service_type}</div>
        </div>
        <div class="px-4 py-1 rounded-full bg-emerald-500 text-black font-bold">
          $${order.price}
        </div>
      </div>
      <div class="text-sm">📍 ${order.address}</div>
      <div class="text-xs text-slate-400">🕒 ${order.date} ${order.time}</div>
    `;

    list.appendChild(card);
  });
}

// ================================
// START
// ================================
(async () => {
  const lang = await loadWorkerLanguage();
  t = i18n[lang] || i18n.en;
  applyUI();
  loadOrders();
})();