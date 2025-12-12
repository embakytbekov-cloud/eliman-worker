// ================================
// ORDERS PAGE — AUTO LANGUAGE FROM WORKERS
// ================================

// params
const params = new URLSearchParams(window.location.search);
let lang = params.get("lang"); // ⬅️ пока может быть null

// telegram
const tg = window.Telegram?.WebApp;
const telegramId = tg?.initDataUnsafe?.user?.id?.toString();

console.log("ORDERS PAGE");
console.log("telegramId:", telegramId);
console.log("lang from URL:", lang);

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
    title: "Panel del trabajador",
    subtitle: "Nuevos pedidos disponibles según tus habilidades",
    tabOrders: "Pedidos",
    tabActive: "Activos",
    tabProfile: "Perfil",
    noOrders: "No hay pedidos",
    errorLoading: "Error al cargar pedidos"
  }
};

// ================================
// APPLY UI TRANSLATION
// ================================
function applyLang(lang) {
  const t = i18n[lang] || i18n.ru;

  const pageTitle = document.getElementById("pageTitle");
  const pageSubtitle = document.getElementById("pageSubtitle");
  const tabOrders = document.getElementById("tabOrders");
  const tabActive = document.getElementById("tabActive");
  const tabProfile = document.getElementById("tabProfile");

  if (pageTitle) pageTitle.textContent = t.title;
  if (pageSubtitle) pageSubtitle.textContent = t.subtitle;
  if (tabOrders) tabOrders.textContent = t.tabOrders;
  if (tabActive) tabActive.textContent = t.tabActive;
  if (tabProfile) tabProfile.textContent = t.tabProfile;
}

// ================================
// LOAD WORKER LANGUAGE (ONCE)
// ================================
async function ensureLanguage() {
  if (lang) {
    applyLang(lang);
    loadOrders(lang);
    return;
  }

  if (!telegramId) {
    lang = "ru";
    applyLang(lang);
    loadOrders(lang);
    return;
  }

  const { data, error } = await window.db
    .from("workers")
    .select("language")
    .eq("telegram_id", telegramId)
    .single();

  if (error || !data?.language) {
    console.warn("Worker language not found, fallback to RU");
    lang = "ru";
  } else {
    lang = data.language;
  }

  // 🔥 ОДИН РАЗ ПЕРЕЗАГРУЖАЕМ С lang
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set("lang", lang);
  window.location.replace(newUrl.toString());
}

// ================================
// LOAD ORDERS
// ================================
async function loadOrders(lang) {
  const t = i18n[lang] || i18n.ru;

  const { data, error } = await window.db
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    list.innerHTML = `<div class="text-red-400 text-center mt-10">
      ${t.errorLoading}
    </div>`;
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = `<div class="text-slate-400 text-center mt-10">
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

        <div class="px-4 py-1 rounded-full bg-emerald-500 text-black font-bold">
          $${order.price || "--"}
        </div>
      </div>

      <div class="text-sm text-slate-300 mb-1">
        📍 ${order.address || ""}
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
ensureLanguage();