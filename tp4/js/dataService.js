export async function loadAllData() {
  try {
    const [customersRes, productsRes, ordersRes] = await Promise.all([
      fetch("data/customers.json"),
      fetch("data/products.json"),
      fetch("data/orders.json")
    ]);

    if (!customersRes.ok || !productsRes.ok || !ordersRes.ok) {
      throw new Error("Error loading one or more JSON files.");
    }

    const customers = await customersRes.json();
    const products = await productsRes.json();
    const orders = await ordersRes.json();

    return { customers, products, orders };
  } catch (error) {
    console.error("Critical fetch error:", error);
    throw error;
  }
}