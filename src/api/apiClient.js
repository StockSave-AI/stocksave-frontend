import { getAuthToken } from "../utils/authStorage";

const rawBaseUrl = import.meta.env.VITE_API_URL;

if (!rawBaseUrl) {
  throw new Error(
    "VITE_API_URL is not defined. Please set it in your .env file.",
  );
}

const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

const buildHeaders = ({ hasBody = false } = {}) => {
  const token = getAuthToken();
  return {
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const apiClient = async (path, { method = "GET", body } = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders({ hasBody: Boolean(body) }),
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed (${response.status})`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};
