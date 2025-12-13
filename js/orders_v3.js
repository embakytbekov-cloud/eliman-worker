// ================================
// ORDERS PAGE — v3 FINAL
// STYLE MATCHES DESIGN
// ================================

const list = document.getElementById("ordersList");

async function loadOrders() {
  const { data, error } = await window.db
    .from("orders")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    list.innerHTML = `<div class="text-center text-red-400">Ошибка загрузки</div>`;
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = `<div class="text-center text-slate-400">Заказов пока нет</div>`;
    return;
  }

  renderOrders(data);
}

function renderOrders(orders) {
  list.innerHTML = "";

  orders.forEach(order => {
    const card = document.createElement("div");
    card.className = "card rounded-3xl p-5";

    card.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <div>
          <div class="text-lg font-bold text-white">
            ${order.service_name}
          </div>
          <div class="text-sm text-slate-400">
            ${order.description || ""}
          </div>
        </div>

        <div class="price-pill px-4 py-1 rounded-full bg-emerald-500 text-black font-bold text-lg">
          $${order.price}
        </div>
      </div>

      <div class="flex items-center gap-4 text-sm text-slate-400 mb-4">
        <div class="flex items-center gap-1">📍 ${order.address}</div>
        <div class="flex items-center gap-1">🕒 ${order.date} ${order.time}</div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-emerald-400 text-sm">
          📸 📸 📸 <span class="text-slate-400">3 photos</span>
        </div>

        <button
          class="text-emerald-400 font-semibold hover:underline"
          onclick="openDetails('${order.id}')">
          Подробнее →
        </button>
      </div>
    `;

    list.appendChild(card);
  });
}

function openDetails(orderId) {
  window.location.href = `order-details.html?id=${orderId}`;
}

loadOrders();