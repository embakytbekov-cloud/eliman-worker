// ================================
// ORDERS PAGE
// + $1 ACCEPT LOGIC
// + SHOW ONLY NEW ORDERS
// ================================

// URL params
const params = new URLSearchParams(window.location.search);
let lang = params.get("lang") || "en";

// ================================
// I18N
// ================================
const i18n = {
  en: {
    title: "Worker Console",
    subtitle: "New orders available for your skills",
    noOrders: "No orders yet",
    errorLoading: "Error loading orders",
    accept: "Accept job — $1",
    confirmAccept: "Accepting this job costs $1. Continue?"
  },
  ru: {
    title: "Консоль работника",
    subtitle: "Новые заказы, доступные по вашим навыкам",
    noOrders: "Заказов пока нет",
    errorLoading: "Ошибка загрузки заказов",
    accept: "Принять заказ — $1",
    confirmAccept: "Принятие заказа стоит $1. Продолжить?"
  },
  es: {
    title: "Consola del trabajador",
    subtitle: "Nuevos pedidos disponibles según tus habilidades",
    noOrders: "No hay pedidos",
    errorLoading: "Error al cargar pedidos",
    accept: "Aceptar trabajo — $1",
    confirmAccept: "Aceptar este trabajo cuesta $1. ¿Continuar?"
  }
};

if (!i18n[lang]) lang = "en";
const t = i18n[lang];

// ================================
// DOM
// ================================
const list = document.getElementById("ordersList");
const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");

if (pageTitle) pageTitle.textContent = t.title;
if (pageSubtitle) pageSubtitle.textContent = t.subtitle;

if (!window.db) {
  alert("Supabase not connected");
  throw new Error("Supabase not connected");
}

// ================================
// LOAD ORDERS (ONLY NEW)
// ================================
async function loadOrders() {
  const { data, error } = await window.db
    .from("orders")
    .select("*")
    .eq("status", "new") // 🔥 КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    list.innerHTML = `
      <div class="text-red-400 text-center mt-10">
        ${t.errorLoading}
      </div>`;
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = `
      <div class="text-slate-400 text-center mt-10">
        ${t.noOrders}
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

        <div class="px-3 py-1 rounded-full bg-emerald-500 text-black font-bold">
          $${order.price || "--"}
        </div>
      </div>

      <div class="text-sm text-slate-300 mb-3">
        📍 ${order.address || ""}
      </div>

      <button
        class="w-full py-2 rounded-xl bg-emerald-500 text-black font-bold
               hover:bg-emerald-400 transition"
        onclick="acceptOrder('${order.id}')"
      >
        ${t.accept}
      </button>
    `;

    list.appendChild(card);
  });
}

// ================================
// ACCEPT ORDER ($1)
// ================================
async function acceptOrder(orderId) {
  const ok = confirm(t.confirmAccept);
  if (!ok) return;

  const tg = window.Telegram?.WebApp?.initDataUnsafe?.user;
  if (!tg?.id) {
    alert("Telegram user not found");
    return;
  }

  const { error } = await window.db
    .from("orders")
    .update({
      status: "active",
      accepted_by: String(tg.id),
      accept_fee_paid: true
    })
    .eq("id", orderId);

  if (error) {
    console.error(error);
    alert("Error accepting order");
    return;
  }

  // 👉 Переход в Active
  window.location.href = "active.html";
}

// ================================
// START
// ================================
loadOrders();