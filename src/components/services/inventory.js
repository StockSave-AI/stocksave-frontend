import { apiClient } from "../../api/apiClient";

export const getInventory = () => apiClient("/api/inventory");

export const getInventoryCategories = () =>
  apiClient("/api/inventory/categories");

export const getInventoryItem = (id) =>
  apiClient(`/api/inventory/${id}`);

export const getMyBookings = () => apiClient("/api/inventory/my-bookings");

export const getAllBookings = () => apiClient("/api/inventory/all-bookings");

export const getStockBatches = (variantId) =>
  apiClient(`/api/inventory/stock-batches/${variantId}`);

export const addInventoryBatch = ({ product_variant_id, total_slots }) =>
  apiClient("/api/inventory/add", {
    method: "POST",
    body: { product_variant_id, total_slots },
  });

export const bookInventory = ({ inventory_id, slots_booked }) =>
  apiClient("/api/inventory/book", {
    method: "POST",
    body: { inventory_id, slots_booked },
  });

export const updateBookingStatus = async ({ bookingId, status }) => {
  const normalizedStatus = String(status || "").trim().toLowerCase();
  const resolvedStatus =
    normalizedStatus === "canceled"
      ? "Cancelled"
      : normalizedStatus === "cancelled"
        ? "Cancelled"
        : normalizedStatus === "completed"
          ? "Completed"
          : null;

  if (!resolvedStatus) {
    throw new Error("Unsupported booking status. Use Completed or Cancelled.");
  }

  const payload = { status: resolvedStatus };
  const endpoints = [
    {
      path: `/api/inventory/booking/${bookingId}/status`,
      body: payload,
    },
    {
      path: `/api/inventory/bookings/${bookingId}/status`,
      body: payload,
    },
    {
      path: `/api/owner/bookings/${bookingId}/status`,
      body: payload,
    },
    {
      path: `/api/inventory/bookings/${bookingId}`,
      body: payload,
    },
  ];

  let lastError;
  for (const endpoint of endpoints) {
    try {
      return await apiClient(endpoint.path, {
        method: "PATCH",
        body: endpoint.body,
      });
    } catch (error) {
      lastError = error;
      if (error?.status !== 404) throw error;
    }
  }

  throw lastError || new Error("Failed to update booking status");
};
