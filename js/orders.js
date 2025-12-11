// js/orders.js

// ------------------------------
// 1. ПАРСИМ ПАРАМЕТРЫ И ССЫЛКИ НА ЭЛЕМЕНТЫ
// ------------------------------
const params = new URLSearchParams(window.location.search);
const workerId = params.get("worker_id") || params.get("id");
const lang = params.get("lang") || "ru";

const ordersListEl = document.getElementById("ordersList");
const onlineBadgeEl = document.getElementById("onlineBadge");

// небольшие тексты по языкам
const texts = {
  ru: {
    noOrders: "Новых заказов пока нет",
    loadError: "Ошибка загрузки заказов"
  },
  en: {
    noOrders: "No new orders yet",
    loadError: "Error loading orders"
  },
  es: {
    noOrders: "No hay pedidos nuevos todavía",
    loadError: "Error al cargar pedidos"
  }
};

const t = texts[lang] || texts.ru;

// ------------------------------
// 2. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ------------------------------

// формат даты/времени для карточки
function formatDateTime(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hh}:${mm}`;
}

// когда нет заказов / ошибка
function renderMessage(text) {
  ordersListEl.innerHTML = `
    <div class="mt-8 text-center text-slate-500 text-sm">
      ${text}
    </div>
  `;
}

// создать DOM-элемент карточки
function renderOrderCard(order) {
  // предполагаемые поля — если в твоей таблице другие имена,
  // просто подставь здесь свои: order.title, order.address и т.д.
  const title = order.title || "New order";
  const subtitle =
    order.subtitle ||
    order.description ||
    "Заказ без описания";
  const address =
    order.address ||
    order.full_address ||
    "";
  const price = order.price || order.budget || 0;
  const scheduledAt = formatDateTime(order.scheduled_at || order.date_time);
  const photosCount = order.photos_count || 0;

  const card = document.createElement("div");
  card.className =
    "bg-slate-900/80 border border-slate-800 rounded-3xl px-4 py-4 mb-2 shadow-[0_18px_40px_rgba(15,23,42,0.9)]";

  card.innerHTML = `
    <div class="flex items-start justify-between mb-3">
      <div class="pr-4">
        <h2 class="text-lg font-semibold text-slate-50 mb-1">
          ${title}
        </h2>
        <p class="text-sm text-slate-400 leading-snug">
          ${subtitle}
        </p>
      </div>
      <div
        class="px-4 py-2 rounded-2xl bg-emerald-500 text-black font-extrabold text-base shrink-0">
        $${price}
      </div>
    </div>

    <div class="flex items-center text-xs text-slate-400 mb-3 gap-4">
      <div class="flex items-center gap-1">
        <span>📍</span>
        <span class="truncate max-w-[180px]">${address}</span>
      </div>
      <div class="flex items-center gap-1">
        <span>⏰</span>
        <span>${scheduledAt}</span>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        ${
          photosCount > 0
            ? `<div class="flex -space-x-2">
                 <div class="w-8 h-8 rounded-full border border-emerald-500/70 bg-emerald-900/40 flex items-center justify-center text-xs">
                   📷
                 </div>
                 <div class="w-8 h-8 rounded-full border border-emerald-500/70 bg-emerald-900/40 flex items-center justify-center text-xs">
                   📷
                 </div>
                 <div class="w-8 h-8 rounded-full border border-emerald-500/70 bg-emerald-900/40 flex items-center justify-center text-[11px]">
                   +${photosCount}
                 </div>
               </div>`
            : `<div class="text-xs text-slate-500">Без фото</div>`
        }
      </div>

      <button
        class="text-emerald-400 text-sm font-semibold flex items-center gap-1">
        <span>Подробнее</span>
        <span>→</span>
      </button>
    </div>
  `;

  return card;
}

// ------------------------------
// 3. ЗАГРУЗКА РАБОЧЕГО И ЗАКАЗОВ
// ------------------------------
async function loadWorker() {
  if (!workerId) return null;
  if (!window.db) return null;

  try {
    const { data, error } = await window.db
      .from("workers")
      .select("*")
      .eq("id", workerId)
      .maybeSingle();

    if (error) {
      console.warn("Worker load error:", error);
      return null;
    }
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function loadOrders(worker) {
  if (!window.db) {
    renderMessage(t.loadError);
    return;
  }

  try {
    // БАЗОВЫЙ запрос.
    // ⚠️ ВАЖНО: подстрой под свою таблицу orders.
    // Здесь предполагается:
    //   - столбец status = 'new'
    //   - возможно category, чтобы фильтровать по worker.category
    let query = window.db
      .from("orders")
      .select("*")
      .eq("status", "new")
      .order("scheduled_at", { ascending: true });

    // если у тебя в orders есть колонка category
    // и в workers есть category — фильтруем:
    if (worker && worker.category) {
      query = query.eq("category", worker.category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Orders error:", error);
      renderMessage(t.loadError);
      return;
    }

    if (!data || data.length === 0) {
      renderMessage(t.noOrders);
      return;
    }

    ordersListEl.innerHTML = "";
    data.forEach((order) => {
      const card = renderOrderCard(order);
      ordersListEl.appendChild(card);
    });
  } catch (e) {
    console.error(e);
    renderMessage(t.loadError);
  }
}

// ------------------------------
// 4. INIT
// ------------------------------
(async function init() {
  // на будущее можно менять бейдж ONLINE/OFFLINE отсюда
  if (onlineBadgeEl) {
    onlineBadgeEl.textContent = "ONLINE";
  }

  const worker = await loadWorker();
  await loadOrders(worker);
})();