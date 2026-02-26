import { apiClient } from "../../../api/apiClient";

const OWNER_BASE = "/api/owner";

export const fetchOwnerStats = () => apiClient(`${OWNER_BASE}/stats`);

export const fetchOwnerUsers = ({
  page = 1,
  limit = 20,
  q = "",
  status = "",
  includeTransactions = false,
} = {}) => {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("limit", limit);
  if (q) params.set("q", q);
  if (status) params.set("status", status);
  if (includeTransactions) params.set("include_transactions", "true");
  const query = params.toString();
  return apiClient(`${OWNER_BASE}/users${query ? `?${query}` : ""}`);
};

export const fetchOwnerUserDetails = (id) =>
  apiClient(`${OWNER_BASE}/users/${id}`);

export const fetchOwnerSearchUsers = ({
  q = "",
  status = "",
  account_type = "",
} = {}) => {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (status) params.set("status", status);
  if (account_type) params.set("account_type", account_type);
  const query = params.toString();
  return apiClient(`${OWNER_BASE}/search-users${query ? `?${query}` : ""}`);
};

export const fetchOwnerRecentCash = () =>
  apiClient(`${OWNER_BASE}/recent-cash`);

export const recordOwnerDeposit = ({ userId, amount, reference }) =>
  apiClient(`${OWNER_BASE}/record-deposit`, {
    method: "POST",
    body: { userId, amount, reference },
  });

export const fetchOwnerTransactions = ({
  type = "",
  status = "",
  method = "",
  limit = 50,
} = {}) => {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (status) params.set("status", status);
  if (method) params.set("method", method);
  if (limit) params.set("limit", limit);
  const query = params.toString();
  return apiClient(`${OWNER_BASE}/transactions${query ? `?${query}` : ""}`);
};

export const fetchOwnerAllBookings = () =>
  apiClient("/api/inventory/all-bookings");

export const fetchOwnerWithdrawals = ({ status = "Processing", limit } = {}) => {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (limit) params.set("limit", limit);
  const query = params.toString();
  return apiClient(`${OWNER_BASE}/withdrawals${query ? `?${query}` : ""}`);
};

export const completeOwnerWithdrawal = ({ transactionId }) =>
  apiClient(`${OWNER_BASE}/complete-withdrawal`, {
    method: "PATCH",
    body: { transactionId },
  });
