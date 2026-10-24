import { state } from './state.js';
import { loadAllData } from './dataService.js';
import { render, renderError, renderModalDetails } from './view.js';

async function init() {
  try {
    const data = await loadAllData();
    state.customers = data.customers;
    state.products = data.products;
    state.orders = data.orders;

    setupEventListeners();
    render(state);
  } catch (error) {
    renderError("Unable to load the application. Make sure the JSON files are accessible in the data/ folder.");
  }
}

function setupEventListeners() {
  const searchInput = document.getElementById("search-input");
  const statusFilter = document.getElementById("status-filter");
  const categoryFilter = document.getElementById("category-filter");

  searchInput.addEventListener("input", (e) => {
    state.filters.searchQuery = e.target.value;
    render(state);
  });

  statusFilter.addEventListener("change", (e) => {
    state.filters.status = e.target.value;
    render(state);
  });

  categoryFilter.addEventListener("change", (e) => {
    state.filters.category = e.target.value;
    render(state);
  });

  document.getElementById("orders-tbody").addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-details")) {
      const orderId = e.target.getAttribute("data-id");
      renderModalDetails(orderId, state);
    }
  });
}

document.addEventListener("DOMContentLoaded", init);