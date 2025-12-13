// ================================
// ORDERS PAGE — v3 FINAL CLEAN
// NO HARD COLORS
// ALL COLORS FROM style.css
// ================================

const list = document.getElementById("ordersList");

async function loadOrders() {
  const { data, error } = await window.db
    .from("orders")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    list.innerHTML = `
      <div class="text-center text-red-400 mt-10">
        Ошибка загрузки
      </div>`;
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = `
      <div class="text-center text-slate-400 mt-10">
        Заказов пока нет
      </div>`;
    return;
  }

  renderOrders(data);
}

// ================================
// RENDER ORDERS
// ================================
function renderOrders(orders) {
  list.innerHTML = "";

  orders.forEach(order => {
    const card = document.createElement("div");
    card.className = "card rounded-3xl p-5";

    card.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <div>
          <div class="text-lg font-bold text-white">
            ${order.service_name || "Service"}
          </div>
          <div class="text-sm text-slate-400">
            ${order.description || ""}
          </div>
        </div>

        <div class="price-pill px-4 py-1 rounded-full font-bold text-lg">
          $${order.price || "--"}
        </div>
      </div>

      <div class="flex items-center gap-4 text-sm text-slate-400 mb-4">
        <div class="flex items-center gap-1">
          📍 ${order.address || ""}
        </div>
        <div class="flex items-center gap-1">
          🕒 ${order.date || ""} ${order.time || ""}
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 photos text-sm">
          📸 📸 📸
          <span class="text-slate-400">3 photos</span>
        </div>

        <button
          class="details-link font-semibold"
          onclick="openDetails('${order.id}')">
          Подробнее →
        </button>
      </div>
    `;

    list.appendChild(card);
  });
}

// ================================
// OPEN DETAILS
// ================================
function openDetails(orderId) {
  window.location.href = `order-details.html?id=${orderId}`;
}

// ================================
// START
// ================================
loadOrders();