// ================================
// ORDERS PAGE — FINAL FIX
// ================================

const list = document.getElementById("ordersList");

async function loadOrders() {
  const { data, error } = await window.db
    .from("orders")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    list.innerHTML = `<div class="empty">Ошибка загрузки</div>`;
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = `<div class="empty">Заказов пока нет</div>`;
    return;
  }

  renderOrders(data);
}

function renderOrders(orders) {
  list.innerHTML = "";

  orders.forEach(order => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-top">
        <div>
          <div class="order-title">${order.service_name || "Service"}</div>
          <div class="order-desc">${order.description || ""}</div>
        </div>
        <div class="price-pill">$${order.price || "--"}</div>
      </div>

      <div class="order-meta">
        <div>📍 ${order.address || ""}</div>
        <div>🕒 ${order.date || ""} ${order.time || ""}</div>
      </div>

      <div class="card-bottom">
        <div class="photos">📸 📸 📸 <span>3 photos</span></div>
        <button class="details-link" onclick="openDetails('${order.id}')">
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