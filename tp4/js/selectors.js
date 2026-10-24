export function getCustomerById(customers, customerId) {
  return customers.find(c => c.id === customerId);
}

export function getProductById(products, productId) {
  return products.find(p => p.id === productId);
}

export function calculateOrderLineAmount(item, products) {
  const product = getProductById(products, item.productId);
  return product ? product.price * item.quantity : 0;
}

export function calculateOrderTotal(order, products) {
  return order.items.reduce((total, item) => {
    return total + calculateOrderLineAmount(item, products);
  }, 0);
}

export function getFilteredOrders(state) {
  return state.orders.filter(order => {
    const customer = getCustomerById(state.customers, order.customerId);
    const customerName = customer ? customer.name.toLowerCase() : "";
    const matchesSearch = customerName.includes(state.filters.searchQuery.toLowerCase());

    const matchesStatus = state.filters.status === "All" || order.status === state.filters.status;

    const matchesCategory = state.filters.category === "All" || order.items.some(item => {
      const product = getProductById(state.products, item.productId);
      return product && product.category === state.filters.category;
    });

    return matchesSearch && matchesStatus && matchesCategory;
  });
}

export function calculateIndicators(state) {
  const totalCustomers = state.customers.length;
  const totalProducts = state.products.length;
  const totalOrders = state.orders.length;
  
  const totalRevenue = state.orders.reduce((sum, order) => {
    return sum + calculateOrderTotal(order, state.products);
  }, 0);

  return { totalCustomers, totalProducts, totalOrders, totalRevenue };
}