import { getCustomerById, getProductById, calculateOrderLineAmount, calculateOrderTotal, getFilteredOrders, calculateIndicators } from './selectors.js';

export function renderError(message) {
  const errorContainer = document.getElementById("error-container");
  if (errorContainer) {
    errorContainer.innerHTML = `<div class="alert alert-danger" role="alert">${message}</div>`;
  }
}
export function renderIndicators(state) {
  const indicatorsContainer = document.getElementById("indicators-container");
  if (!indicatorsContainer) return;

  const { totalCustomers, totalProducts, totalOrders, totalRevenue } = calculateIndicators(state);
  indicatorsContainer.innerHTML = `
    <div class="col-md-3">
      <div class="card text-white bg-primary mb-3">
        <div class="card-body">
          <h5 class="card-title">Customers</h5>
          <p class="card-text fs-4">${totalCustomers}</p>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card text-white bg-success mb-3">
        <div class="card-body">
          <h5 class="card-title">Products</h5>
          <p class="card-text fs-4">${totalProducts}</p>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card text-white bg-warning mb-3">
        <div class="card-body">
          <h5 class="card-title">Orders</h5>
          <p class="card-text fs-4">${totalOrders}</p>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card text-white bg-info mb-3">
        <div class="card-body">
          <h5 class="card-title">Total Revenue</h5>
          <p class="card-text fs-4">${totalRevenue.toLocaleString()} MAD</p>
        </div>
      </div>
    </div>
  `;
}

export function renderOrders(state) {
  const tbody = document.getElementById("orders-tbody");
  if (!tbody) return;

  const filteredOrders = getFilteredOrders(state);
  tbody.innerHTML = "";

  if (filteredOrders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No orders found.</td></tr>`;
    return;
  }

  filteredOrders.forEach(order => {
    const customer = getCustomerById(state.customers, order.customerId);
    const total = calculateOrderTotal(order, state.products);

    let badgeClass = "bg-secondary";
    if (order.status === "Delivered") badgeClass = "bg-success";
    else if (order.status === "Pending") badgeClass = "bg-warning text-dark";
    else if (order.status === "Cancelled") badgeClass = "bg-danger";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>#${order.id}</td>
      <td>${customer ? customer.name : "Unknown"}</td>
      <td>${order.date}</td>
      <td><span class="badge ${badgeClass}">${order.status}</span></td>
      <td>${total.toLocaleString()} MAD</td>
      <td>
        <button class="btn btn-sm btn-outline-primary btn-details" data-id="${order.id}">Details</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

export function renderModalDetails(orderId, state) {
  const order = state.orders.find(o => o.id === Number(orderId));
  if (!order) return;

  const customer = getCustomerById(state.customers, order.customerId);
  const total = calculateOrderTotal(order, state.products);

  document.getElementById("modal-order-id").textContent = order.id;
  document.getElementById("modal-customer-name").textContent = customer ? customer.name : "Unknown";
  document.getElementById("modal-customer-city").textContent = customer ? customer.city : "Unknown";
  document.getElementById("modal-order-date").textContent = order.date;
  document.getElementById("modal-order-status").textContent = order.status;

  const itemsContainer = document.getElementById("modal-items-list");
  itemsContainer.innerHTML = "";

  order.items.forEach(item => {
    const product = getProductById(state.products, item.productId);
    const lineAmount = calculateOrderLineAmount(item, state.products);

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <div>
        <strong>${product ? product.name : "Product"}</strong> 
        <small class="text-muted">(${product ? product.price : 0} MAD x ${item.quantity})</small>
      </div>
      <span class="badge bg-primary rounded-pill">${lineAmount.toLocaleString()} MAD</span>
    `;
    itemsContainer.appendChild(li);
  });

  document.getElementById("modal-order-total").textContent = `${total.toLocaleString()} MAD`;

  const modal = new bootstrap.Modal(document.getElementById("orderModal"));
  modal.show();
}

export function render(state) {
  renderIndicators(state);
  renderOrders(state);
}