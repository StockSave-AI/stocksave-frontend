import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getOwnerNotificationFeed,
  getOwnerNotificationSummary,
  getOwnerNotificationNewUsers,
  getOwnerNotificationLowStock,
  getOwnerNotificationFullyBooked,
  getOwnerNotificationPendingPayments,
  getOwnerNotificationStockMatch,
  getOwnerNotificationReconciliation,
} from "../services/ownerNotificationsApi";

const OWNER_NOTIFICATIONS_READ_KEY = "owner_notifications_read_map";
const OWNER_NOTIFICATIONS_READ_EVENT = "owner-notifications-read-changed";

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const getOwnerNotificationReadMap = () => {
  try {
    const raw = localStorage.getItem(OWNER_NOTIFICATIONS_READ_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const persistReadMap = (map) => {
  localStorage.setItem(OWNER_NOTIFICATIONS_READ_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(OWNER_NOTIFICATIONS_READ_EVENT));
};

export const isOwnerNotificationRead = (key) =>
  Boolean(getOwnerNotificationReadMap()?.[key]);

export const getOwnerReadKeysCount = () =>
  Object.keys(getOwnerNotificationReadMap()).length;

export const markOwnerNotificationRead = (key, read = true) => {
  if (!key) return;
  const current = getOwnerNotificationReadMap();
  if (read) {
    current[key] = true;
  } else {
    delete current[key];
  }
  persistReadMap(current);
};

export const markOwnerNotificationsReadMany = (keys = []) => {
  const current = getOwnerNotificationReadMap();
  keys.filter(Boolean).forEach((key) => {
    current[key] = true;
  });
  persistReadMap(current);
};

export const useOwnerNotificationSummary = (enabled = true) =>
  useQuery({
    queryKey: ["owner-notifications-summary"],
    queryFn: getOwnerNotificationSummary,
    enabled,
  });

export const useOwnerNotificationFeed = (
  { page = 1, limit = 20 } = {},
  enabled = true,
) =>
  useQuery({
    queryKey: ["owner-notifications-feed", page, limit],
    queryFn: () => getOwnerNotificationFeed({ page, limit }),
    enabled,
  });

export const useOwnerNotificationNewUsers = (
  { days = 7, limit = 20 } = {},
  enabled = true,
) =>
  useQuery({
    queryKey: ["owner-notifications-new-users", days, limit],
    queryFn: () => getOwnerNotificationNewUsers({ days, limit }),
    enabled,
  });

export const useOwnerNotificationLowStock = (
  { threshold = 10 } = {},
  enabled = true,
) =>
  useQuery({
    queryKey: ["owner-notifications-low-stock", threshold],
    queryFn: () => getOwnerNotificationLowStock({ threshold }),
    enabled,
  });

export const useOwnerNotificationFullyBooked = (enabled = true) =>
  useQuery({
    queryKey: ["owner-notifications-fully-booked"],
    queryFn: getOwnerNotificationFullyBooked,
    enabled,
  });

export const useOwnerNotificationPendingPayments = (enabled = true) =>
  useQuery({
    queryKey: ["owner-notifications-pending-payments"],
    queryFn: getOwnerNotificationPendingPayments,
    enabled,
  });

export const useOwnerNotificationReconciliation = (enabled = true) =>
  useQuery({
    queryKey: ["owner-notifications-reconciliation"],
    queryFn: getOwnerNotificationReconciliation,
    enabled,
  });

export const useOwnerNotificationStockMatch = (variantId, enabled = true) =>
  useQuery({
    queryKey: ["owner-notifications-stock-match", variantId],
    queryFn: () => getOwnerNotificationStockMatch(variantId),
    enabled: enabled && Boolean(variantId),
  });

export const useOwnerUnreadNotifications = (enabled = true) => {
  const summaryQuery = useOwnerNotificationSummary(enabled);

  const summaryPayload = summaryQuery.data?.data || summaryQuery.data || {};
  const totalAlerts = toNumber(
    summaryPayload?.total_alerts ?? summaryQuery.data?.alerts?.total_alerts,
  );
  const backendUnread = toNumber(summaryPayload?.unread_notifications);

  const unread = useMemo(() => {
    if (backendUnread > 0 || backendUnread === 0) return backendUnread;
    const readCount = getOwnerReadKeysCount();
    return Math.max(0, totalAlerts - readCount);
  }, [backendUnread, totalAlerts]);

  return {
    ...summaryQuery,
    totalAlerts,
    unread,
  };
};
