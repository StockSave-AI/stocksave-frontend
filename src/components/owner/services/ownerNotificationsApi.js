import { apiClient } from "../../../api/apiClient";

export const getOwnerNotificationSummary = async () =>
  apiClient("/api/notifications/summary");

export const getOwnerNotificationNewUsers = async ({
  days = 7,
  limit = 20,
} = {}) =>
  apiClient(`/api/notifications/new-users?days=${days}&limit=${limit}`);

export const getOwnerNotificationLowStock = async ({ threshold = 10 } = {}) =>
  apiClient(`/api/notifications/low-stock?threshold=${threshold}`);

export const getOwnerNotificationFullyBooked = async () =>
  apiClient("/api/notifications/fully-booked");

export const getOwnerNotificationPendingPayments = async () =>
  apiClient("/api/notifications/pending-payments");

export const getOwnerNotificationStockMatch = async (variantId) =>
  apiClient(`/api/notifications/stock-match/${variantId}`);

export const getOwnerNotificationReconciliation = async () =>
  apiClient("/api/notifications/reconciliation");
