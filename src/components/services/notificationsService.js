import { getAuthToken } from "../../utils/authStorage";
import { getStockBoardData } from "./customer";
import { getMyBookings } from "./inventory";
import { getPlans } from "./plans";
import { getSavingsHistory } from "./savings";

const CUSTOMER_NOTIFICATIONS_STORE_KEY = "customer_notifications_store_v2";
const CUSTOMER_STOCK_SNAPSHOT_KEY = "customer_stock_snapshot_v2";

const readStore = () => {
  try {
    const raw = localStorage.getItem(CUSTOMER_NOTIFICATIONS_STORE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object") return { byUser: {} };
    return {
      byUser: parsed.byUser && typeof parsed.byUser === "object" ? parsed.byUser : {},
    };
  } catch {
    return { byUser: {} };
  }
};

const writeStore = (store) => {
  localStorage.setItem(CUSTOMER_NOTIFICATIONS_STORE_KEY, JSON.stringify(store));
};

const getUserIdFromStoredUser = () => {
  try {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.id ?? parsed?.user_id ?? null;
  } catch {
    return null;
  }
};

const decodeTokenPayload = (token) => {
  try {
    const payload = token?.split(".")?.[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
};

const getCurrentCustomerUserId = () => {
  const storedUserId = getUserIdFromStoredUser();
  if (storedUserId !== null && storedUserId !== undefined && storedUserId !== "") {
    return String(storedUserId);
  }
  const payload = decodeTokenPayload(getAuthToken());
  const tokenUserId =
    payload?.id ??
    payload?.user_id ??
    payload?.sub ??
    payload?.user?.id ??
    payload?.user?.user_id ??
    null;
  if (tokenUserId === null || tokenUserId === undefined || tokenUserId === "") return null;
  return String(tokenUserId);
};

const asArray = (value) => (Array.isArray(value) ? value : []);

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeEntityStatus = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "canceled") return "cancelled";
  if (normalized === "complete") return "completed";
  return normalized;
};

const isPendingStatus = (value) => normalizeEntityStatus(value) === "pending";

const normalizeNotificationRecord = (record) => {
  const read = Boolean(record?.isRead ?? record?.read);
  return {
    ...record,
    type: String(record?.type || "general"),
    entityId:
      record?.entityId !== null && record?.entityId !== undefined && record?.entityId !== ""
        ? String(record.entityId)
        : null,
    statusAtCreation: record?.statusAtCreation || null,
    read,
    isRead: read,
  };
};

const sortByTimeDesc = (items) =>
  [...items].map(normalizeNotificationRecord).sort((a, b) => {
    const aTime = new Date(a?.time || 0).getTime();
    const bTime = new Date(b?.time || 0).getTime();
    return bTime - aTime;
  });

const readNotificationsForUser = (userId) => {
  if (!userId) return [];
  const store = readStore();
  const list = store.byUser?.[userId];
  return Array.isArray(list) ? list.map(normalizeNotificationRecord) : [];
};

const writeNotificationsForUser = (userId, items) => {
  if (!userId) return;
  const store = readStore();
  store.byUser[userId] = sortByTimeDesc(items);
  writeStore(store);
};

const readStockSnapshot = () => {
  try {
    const raw = localStorage.getItem(CUSTOMER_STOCK_SNAPSHOT_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeStockSnapshot = (snapshot) => {
  localStorage.setItem(CUSTOMER_STOCK_SNAPSHOT_KEY, JSON.stringify(snapshot));
};

const normalizeStockEntries = (stockPayload) => {
  const source = stockPayload?.data || stockPayload || {};
  const entries = [];

  const flat = [
    ...asArray(source?.items),
    ...asArray(source?.inventory),
    ...asArray(source?.products),
    ...asArray(source),
  ];

  flat.forEach((item, index) => {
    const name = item?.product_name || item?.name || item?.item || null;
    const qty = Math.max(
      0,
      toNumber(
        item?.stock_quantity ??
          item?.available_slots ??
          item?.quantity ??
          item?.total_slots ??
          item?.stock,
      ),
    );
    if (!name || qty <= 0) return;
    const key = String(item?.id ?? item?.inventory_id ?? `${name}-${index}`);
    entries.push({ key, name: String(name), qty });
  });

  const categories = asArray(source?.categories);
  categories.forEach((category, catIndex) => {
    const products = asArray(category?.products);
    products.forEach((product, productIndex) => {
      const variants = asArray(product?.variants);
      if (variants.length === 0) {
        const qty = Math.max(
          0,
          toNumber(product?.stock_quantity ?? product?.available_slots ?? product?.quantity),
        );
        const name = product?.product_name || product?.name;
        if (!name || qty <= 0) return;
        entries.push({
          key: String(product?.id ?? `${name}-${catIndex}-${productIndex}`),
          name: String(name),
          qty,
        });
        return;
      }

      variants.forEach((variant, variantIndex) => {
        const qty = Math.max(
          0,
          toNumber(variant?.stock_quantity ?? variant?.available_slots ?? variant?.quantity),
        );
        if (qty <= 0) return;
        const productName = product?.product_name || product?.name || "Item";
        const size = variant?.size_label ? ` ${variant.size_label}` : "";
        entries.push({
          key: String(
            variant?.variant_id ??
              variant?.id ??
              `${productName}-${size}-${catIndex}-${productIndex}-${variantIndex}`,
          ),
          name: `${productName}${size}`.trim(),
          qty,
        });
      });
    });
  });

  return entries;
};

const toDateOnly = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const daysUntil = (isoLike) => {
  const due = new Date(isoLike);
  if (Number.isNaN(due.getTime())) return null;
  const now = new Date();
  const startNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDue = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  return Math.round((startDue.getTime() - startNow.getTime()) / (1000 * 60 * 60 * 24));
};

const normalizePlanFrequency = (value) => {
  const normalized = String(value || "monthly").toLowerCase();
  if (normalized === "daily") return "daily";
  if (normalized === "weekly") return "weekly";
  return "monthly";
};

const maybeAddPaymentReminders = (plansPayload, existingById) => {
  const payload = plansPayload?.data || plansPayload || {};
  const currentPlan = payload?.current_plan || null;
  if (!currentPlan) return [];

  const status = String(currentPlan?.status || "").toLowerCase();
  if (status !== "active") return [];

  const nextPaymentDate =
    currentPlan?.next_payment_date || currentPlan?.next_payment || currentPlan?.nextPayment;
  if (!nextPaymentDate) return [];

  const dueInDays = daysUntil(nextPaymentDate);
  if (dueInDays === null || dueInDays > 7) return [];

  const amount = toNumber(currentPlan?.amount || currentPlan?.monthlyAmount);
  const frequency = normalizePlanFrequency(
    currentPlan?.plan_type || currentPlan?.frequency || "monthly",
  );
  const dueDate = toDateOnly(new Date(nextPaymentDate));
  const id = `payment-${currentPlan?.id || "active"}-${dueDate}`;

  if (existingById.has(id)) return [];

  let message = `Upcoming ${frequency} payment due on ${dueDate}.`;
  if (amount > 0) {
    message = `Payment reminder: NGN ${amount.toLocaleString("en-NG")} is due on ${dueDate}.`;
  }
  if (dueInDays < 0) {
    message = `Payment overdue: NGN ${amount.toLocaleString("en-NG")} was due on ${dueDate}.`;
  } else if (dueInDays === 0) {
    message = `Payment due today: NGN ${amount.toLocaleString("en-NG")}.`;
  }

  return [
    {
      id,
      type: "payment",
      title: "Payment Reminder",
      message,
      time: new Date().toISOString(),
      read: false,
      isRead: false,
      actions: [{ label: "View Plan" }],
    },
  ];
};

const maybeAddStockAlerts = (stockPayload, existingById) => {
  const previousSnapshot = readStockSnapshot();
  const currentEntries = normalizeStockEntries(stockPayload);
  const nextSnapshot = {};
  const newNotifications = [];

  currentEntries.forEach((entry) => {
    nextSnapshot[entry.key] = entry.qty;
    const previousQty = toNumber(previousSnapshot[entry.key]);
    const isNew = previousQty <= 0 && entry.qty > 0;
    const increased = previousQty > 0 && entry.qty > previousQty;
    if (!isNew && !increased) return;

    const delta = isNew ? entry.qty : entry.qty - previousQty;
    const id = `stock-${entry.key}-${entry.qty}`;
    if (existingById.has(id)) return;

    newNotifications.push({
      id,
      type: "stock",
      title: "Stock Alert",
      message: `New stock added: ${delta} slots of ${entry.name} now available.`,
      time: new Date().toISOString(),
      read: false,
      isRead: false,
      actions: [{ label: "View Stock" }],
    });
  });

  writeStockSnapshot(nextSnapshot);
  return newNotifications;
};

const extractBookings = (payload) => {
  const root = payload?.data ?? payload ?? [];
  if (Array.isArray(root)) return root;
  if (Array.isArray(root?.bookings)) return root.bookings;
  return [];
};

const extractTransactions = (payload) => {
  const root = payload?.data ?? payload ?? [];
  if (Array.isArray(root)) return root;
  if (Array.isArray(root?.transactions)) return root.transactions;
  return [];
};

const shouldAutoResolvePending = (notification) => {
  if (!notification || notification.read) return false;
  if (!notification.entityId) return false;
  if (!isPendingStatus(notification.statusAtCreation)) return false;
  const type = String(notification.type || "").toLowerCase();
  return type.includes("booking") || type.includes("deposit") || type.includes("transaction");
};

const autoResolvePendingLinkedNotifications = async ({ userId, notifications }) => {
  const normalizedList = sortByTimeDesc(notifications);
  const targetList = normalizedList.filter(shouldAutoResolvePending);
  if (!targetList.length) return normalizedList;

  const bookingIds = targetList
    .filter((item) => String(item.type || "").toLowerCase().includes("booking"))
    .map((item) => String(item.entityId));
  const transactionIds = targetList
    .filter((item) => {
      const type = String(item.type || "").toLowerCase();
      return type.includes("deposit") || type.includes("transaction");
    })
    .map((item) => String(item.entityId));

  const [bookingsResult, transactionsResult] = await Promise.allSettled([
    bookingIds.length ? getMyBookings() : Promise.resolve(null),
    transactionIds.length ? getSavingsHistory() : Promise.resolve(null),
  ]);

  const bookingStatusMap = new Map();
  if (bookingsResult.status === "fulfilled") {
    extractBookings(bookingsResult.value).forEach((booking) => {
      const bookingId =
        booking?.id ?? booking?.booking_id ?? booking?.bookingId ?? booking?.reference ?? null;
      if (bookingId === null || bookingId === undefined || bookingId === "") return;
      bookingStatusMap.set(String(bookingId), normalizeEntityStatus(booking?.status));
    });
  }

  const transactionStatusMap = new Map();
  if (transactionsResult.status === "fulfilled") {
    extractTransactions(transactionsResult.value).forEach((tx) => {
      const txId = tx?.id ?? tx?.transaction_id ?? tx?.transactionId ?? tx?.reference ?? null;
      if (txId === null || txId === undefined || txId === "") return;
      transactionStatusMap.set(String(txId), normalizeEntityStatus(tx?.status));
    });
  }

  const updated = normalizedList.map((item) => {
    if (!shouldAutoResolvePending(item)) return item;
    const type = String(item.type || "").toLowerCase();
    const targetMap = type.includes("booking") ? bookingStatusMap : transactionStatusMap;
    const resolvedStatus = targetMap.get(String(item.entityId));
    if (!resolvedStatus || isPendingStatus(resolvedStatus)) return item;
    return { ...item, read: true, isRead: true };
  });

  writeNotificationsForUser(userId, updated);
  return updated;
};

export async function refreshCustomerNotifications() {
  const userId = getCurrentCustomerUserId();
  if (!userId) return [];

  const stored = readNotificationsForUser(userId);
  const existingById = new Map(stored.map((item) => [item.id, item]));

  const [stockResult, plansResult] = await Promise.allSettled([getStockBoardData(), getPlans()]);
  const stockPayload = stockResult.status === "fulfilled" ? stockResult.value : null;
  const plansPayload = plansResult.status === "fulfilled" ? plansResult.value : null;

  const stockAlerts = stockPayload ? maybeAddStockAlerts(stockPayload, existingById) : [];
  const paymentReminders = plansPayload ? maybeAddPaymentReminders(plansPayload, existingById) : [];

  const next = sortByTimeDesc([...stored, ...stockAlerts, ...paymentReminders]);
  writeNotificationsForUser(userId, next);
  return autoResolvePendingLinkedNotifications({ userId, notifications: next });
}

export async function getNotifications() {
  return refreshCustomerNotifications();
}

export function getNotificationsSync() {
  return readNotificationsForUser(getCurrentCustomerUserId());
}

export async function markAllNotificationsRead() {
  const userId = getCurrentCustomerUserId();
  if (!userId) return [];
  const current = readNotificationsForUser(userId);
  const updated = current.map((item) => ({ ...item, read: true, isRead: true }));
  writeNotificationsForUser(userId, updated);
  return updated;
}

export function resolveCustomerNotificationEntity({
  targetUserId,
  type,
  entityId,
  nextStatus,
}) {
  const userId =
    targetUserId !== null && targetUserId !== undefined && targetUserId !== ""
      ? String(targetUserId)
      : getCurrentCustomerUserId();
  if (!userId || entityId === null || entityId === undefined || entityId === "") return [];

  const normalizedType = String(type || "").toLowerCase();
  const normalizedStatus = normalizeEntityStatus(nextStatus);
  if (isPendingStatus(normalizedStatus)) return readNotificationsForUser(userId);

  const current = readNotificationsForUser(userId);
  const updated = current.map((item) => {
    const itemType = String(item.type || "").toLowerCase();
    const sameEntity = String(item.entityId || "") === String(entityId);
    const typeMatches =
      itemType === normalizedType ||
      (normalizedType.includes("booking") && itemType.includes("booking")) ||
      (normalizedType.includes("deposit") &&
        (itemType.includes("deposit") || itemType.includes("transaction")));
    if (!sameEntity || !typeMatches || item.read) return item;
    if (!isPendingStatus(item.statusAtCreation)) return item;
    return { ...item, read: true, isRead: true };
  });
  writeNotificationsForUser(userId, updated);
  return updated;
}

export async function pushCustomerBookingNotification({
  notificationId,
  type = "booking",
  entityId = null,
  statusAtCreation = null,
  title = "Order Update",
  message,
  targetUserId,
}) {
  const userId =
    targetUserId !== null && targetUserId !== undefined && targetUserId !== ""
      ? String(targetUserId)
      : getCurrentCustomerUserId();
  if (!userId) return null;

  const now = new Date().toISOString();
  const resolvedId = notificationId || `booking-${userId}-${Date.now()}`;
  const current = readNotificationsForUser(userId);
  const existing = current.find((item) => String(item.id) === String(resolvedId));
  if (existing) return existing;

  const next = {
    id: resolvedId,
    type,
    entityId:
      entityId !== null && entityId !== undefined && entityId !== ""
        ? String(entityId)
        : null,
    statusAtCreation,
    title,
    message,
    time: now,
    read: false,
    isRead: false,
    actions: [{ label: "View Bookings" }],
  };

  const updated = sortByTimeDesc([next, ...current]);
  writeNotificationsForUser(userId, updated);
  return next;
}

export async function getCustomerUnreadNotificationCount() {
  const all = await getNotifications();
  return all.reduce((count, item) => count + (item?.read ? 0 : 1), 0);
}
