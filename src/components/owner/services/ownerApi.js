import { getAuthToken } from "../../../utils/authStorage";

const rawBaseUrl = import.meta.env.VITE_API_URL || "";
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const ownerFetch = async (path, options = {}) => {
  const token = getAuthToken();
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    throw createError("Unauthorized", 401);
  }

  if (!response.ok) {
    throw createError(data?.message || "Request failed", response.status);
  }

  return data;
};

export const fetchOwnerStats = () => ownerFetch("/api/owner/stats");

export const fetchOwnerRecentCash = () => ownerFetch("/api/owner/recent-cash");

export const fetchOwnerSearchUsers = (query) =>
  ownerFetch(`/api/owner/search-users?q=${encodeURIComponent(query)}`);

export const fetchOwnerUsers = (query = "") =>
  ownerFetch(`/api/owner/search-users?q=${encodeURIComponent(query)}`);

export const recordOwnerDeposit = ({ userId, amount }) =>
  ownerFetch("/api/owner/record-deposit", {
    method: "POST",
    body: JSON.stringify({ userId, amount }),
  });

export const fetchOwnerAllBookings = () => ownerFetch("/api/inventory/all-bookings");
