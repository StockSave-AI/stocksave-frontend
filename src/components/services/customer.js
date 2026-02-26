import { apiClient } from "../../api/apiClient";

export const getCustomerSummary = async () => {
  return apiClient("/api/customer/summary");
};

export const addDeposit = async ({ amount, method, reference }) => {
  return apiClient("/api/customer/deposit", {
    method: "POST",
    body: { amount, method, reference },
  });
};

export const getStockBoardData = async () => {
  const tryEndpoints = ["/api/inventory/categories", "/api/inventory"];

  for (const endpoint of tryEndpoints) {
    try {
      const response = await apiClient(endpoint);
      const payload = response?.data || response;
      const hasItems =
        (Array.isArray(payload) && payload.length > 0) ||
        (Array.isArray(payload?.products) && payload.products.length > 0) ||
        (Array.isArray(payload?.categories) && payload.categories.length > 0) ||
        (Array.isArray(payload?.items) && payload.items.length > 0) ||
        (Array.isArray(payload?.inventory) && payload.inventory.length > 0);

      if (hasItems) return response;
    } catch {
      // Try next endpoint.
    }
  }

  return { data: [] };
};

export const getFoodItems = async () => {
  try {
    return apiClient("/api/inventory/categories");
  } catch {
    const tryEndpoints = ["/api/inventory"];

    for (const endpoint of tryEndpoints) {
      try {
        const response = await apiClient(endpoint);
        const payload = response?.data || response;
        const nested = payload?.data || {};
        const hasItems =
          (Array.isArray(payload) && payload.length > 0) ||
          (Array.isArray(payload?.items) && payload.items.length > 0) ||
          (Array.isArray(payload?.inventory) && payload.inventory.length > 0) ||
          (Array.isArray(payload?.products) && payload.products.length > 0) ||
          (Array.isArray(payload?.categories) &&
            payload.categories.length > 0) ||
          (Array.isArray(nested?.items) && nested.items.length > 0) ||
          (Array.isArray(nested?.inventory) && nested.inventory.length > 0) ||
          (Array.isArray(nested?.products) && nested.products.length > 0) ||
          (Array.isArray(nested?.categories) && nested.categories.length > 0);

        if (hasItems) return response;
      } catch {}
    }

    return { data: [] };
  }
};

export const getMyBookings = async () => {
  return apiClient("/api/inventory/my-bookings");
};

export const bookFoodSlot = async ({ inventory_id, slots_booked }) => {
  return apiClient("/api/inventory/book", {
    method: "POST",
    body: { inventory_id, slots_booked },
  });
};

export const getRedeemConfig = async () => {
  return apiClient("/api/savings/redeem");
};

export const getBankAccounts = async () => {
  return apiClient("/api/savings/banks");
};

export const getNotificationPreferences = async () => {
  await apiClient("/api/customer/summary");
  return { data: {} };
};
