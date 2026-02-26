import { apiClient } from "../../api/apiClient";

export const fetchCustomerNotifications = async ({
  type = "",
  unread,
  page = 1,
  limit = 20,
} = {}) => {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (typeof unread === "boolean") params.set("unread", String(unread));
  params.set("page", String(page));
  params.set("limit", String(limit));
  const query = params.toString();
  return apiClient(`/api/customer/notifications${query ? `?${query}` : ""}`);
};

export const fetchCustomerStockAlerts = async ({ days = 30, limit = 20 } = {}) => {
  const params = new URLSearchParams();
  params.set("days", String(days));
  params.set("limit", String(limit));
  return apiClient(`/api/customer/notifications/stock-alerts?${params.toString()}`);
};

export const markAllCustomerNotificationsRead = async () =>
  apiClient("/api/customer/notifications/mark-all", {
    method: "PATCH",
  });

export const markCustomerNotificationRead = async (id) =>
  apiClient(`/api/customer/notifications/${id}`, {
    method: "PATCH",
  });

export const deleteCustomerNotification = async (id) =>
  apiClient(`/api/customer/notifications/${id}`, {
    method: "DELETE",
  });
