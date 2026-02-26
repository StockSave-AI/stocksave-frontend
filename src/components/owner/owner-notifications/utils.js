import { DISMISSED_KEY, SNAPSHOT_KEY } from "./constants";

export const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export const readSummary = (payload) => payload?.data || payload || {};

export const formatHoursAgo = (value) => {
  const hours = Number(value);
  if (!Number.isFinite(hours) || hours <= 0) return "just now";
  if (hours <= 1) return "1 hour ago";
  return `${Math.floor(hours)} hours ago`;
};

export const variantIdFrom = (item) =>
  item?.product_variant_id || item?.variant_id || item?.variantId || item?.id;

export const getSnapshot = () => {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveSnapshot = (snapshot) => {
  localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
};

export const getDismissedMap = () => {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const saveDismissedMap = (value) => {
  localStorage.setItem(DISMISSED_KEY, JSON.stringify(value));
};
