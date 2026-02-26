import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { formatCurrency } from "../../../utils/currency";
import {
  getOwnerNotificationReadMap,
  getOwnerReadKeysCount,
  markOwnerNotificationRead,
  markOwnerNotificationsReadMany,
  useOwnerNotificationFullyBooked,
  useOwnerNotificationLowStock,
  useOwnerNotificationNewUsers,
  useOwnerNotificationPendingPayments,
  useOwnerNotificationReconciliation,
  useOwnerNotificationStockMatch,
  useOwnerNotificationSummary,
} from "../hooks/useOwnerNotifications";
import { TABS } from "./constants";
import {
  formatHoursAgo,
  getDismissedMap,
  getSnapshot,
  readSummary,
  saveDismissedMap,
  saveSnapshot,
  toArray,
  variantIdFrom,
} from "./utils";

export const useOwnerNotificationsPage = ({ isOwner, navigate, pageSize = 8 }) => {
  const [activeTab, setActiveTab] = useState("pending-payments");
  const [page, setPage] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [readMap, setReadMap] = useState(() => getOwnerNotificationReadMap());
  const [dismissedMap, setDismissedMap] = useState(() => getDismissedMap());

  const summaryQuery = useOwnerNotificationSummary(isOwner);
  const pendingPaymentsQuery = useOwnerNotificationPendingPayments(isOwner);
  const lowStockQuery = useOwnerNotificationLowStock({ threshold: 10 }, isOwner);
  const fullyBookedQuery = useOwnerNotificationFullyBooked(isOwner);
  const newUsersQuery = useOwnerNotificationNewUsers({ days: 7, limit: 20 }, isOwner);
  const reconciliationQuery = useOwnerNotificationReconciliation(isOwner);
  const stockMatchQuery = useOwnerNotificationStockMatch(
    selectedVariantId,
    Boolean(selectedVariantId),
  );

  const pendingItems = useMemo(() => toArray(pendingPaymentsQuery.data), [pendingPaymentsQuery.data]);
  const lowItems = useMemo(() => toArray(lowStockQuery.data), [lowStockQuery.data]);
  const fullItems = useMemo(() => toArray(fullyBookedQuery.data), [fullyBookedQuery.data]);
  const newUsers = useMemo(() => toArray(newUsersQuery.data), [newUsersQuery.data]);
  const reconciliation = readSummary(reconciliationQuery.data);
  const summary = readSummary(summaryQuery.data);

  useEffect(() => {
    if (!lowStockQuery.isSuccess && !fullyBookedQuery.isSuccess) return;

    const previous = getSnapshot();
    const current = {
      low: lowItems.map((item) => ({
        id: String(variantIdFrom(item)),
        product: item?.product_name || "Product",
        stock: Number(item?.total_stock ?? 0),
      })),
      full: fullItems.map((item) => ({
        id: String(variantIdFrom(item)),
        product: item?.product_name || "Product",
      })),
    };

    if (previous) {
      const prevLow = new Map((previous.low || []).map((item) => [item.id, item]));
      const currLow = new Map((current.low || []).map((item) => [item.id, item]));
      const prevFull = new Set((previous.full || []).map((item) => item.id));
      const currFull = new Set((current.full || []).map((item) => item.id));

      current.low.forEach((item) => {
        if (!prevLow.has(item.id)) toast(`New low stock alert: ${item.product}`);
      });
      (previous.low || []).forEach((item) => {
        if (!currLow.has(item.id)) toast(`Stock updated: ${item.product} now has healthy stock.`);
      });
      current.full.forEach((item) => {
        if (!prevFull.has(item.id)) toast(`New low stock alert: ${item.product} is fully booked.`);
      });
      (previous.full || []).forEach((item) => {
        if (!currFull.has(item.id)) toast(`Stock updated: ${item.product} is no longer fully booked.`);
      });
    }

    saveSnapshot(current);
  }, [fullItems, fullyBookedQuery.isSuccess, lowItems, lowStockQuery.isSuccess]);

  const recKey = `reconciliation:${new Date().toISOString().slice(0, 10)}`;
  const itemsByTab = {
    "pending-payments": pendingItems.map((item) => ({
      id: `pending-${item.transaction_id}`,
      readKey: `pending-payments:${item.transaction_id}`,
      title: "Cash Deposit Pending",
      message: `${item.first_name || ""} ${item.last_name || ""} - ${formatCurrency(Number(item.amount || 0))}`,
      time: formatHoursAgo(item.hours_pending),
      actionLabel: "Review Deposit",
      onAction: () => navigate("/owner/cash-deposit"),
      tint: "border-yellow-200 bg-yellow-50/80",
      tag: "text-red-700 bg-gradient-to-r from-pink-100 to-red-100 border border-red-200",
    })),
    "low-stock": lowItems.map((item) => {
      const variantId = variantIdFrom(item);
      return {
        id: `low-${variantId}`,
        readKey: `low-stock:${variantId}`,
        title: "Low Stock Alert",
        message: `${item.product_name || "Product"} (${item.size_label || "Variant"}) has ${item.total_stock ?? 0} left`,
        time: "stock alert",
        actionLabel: "View FIFO",
        onAction: () => setSelectedVariantId(variantId),
        tint: "border-yellow-200 bg-yellow-50/80",
        tag: "text-red-700 bg-gradient-to-r from-pink-100 to-red-100 border border-red-200",
      };
    }),
    "fully-booked": fullItems.map((item) => {
      const variantId = variantIdFrom(item);
      return {
        id: `full-${variantId}`,
        readKey: `fully-booked:${variantId}`,
        title: "Fully Booked",
        message: `${item.product_name || "Product"} (${item.size_label || "Variant"}) has no stock left`,
        time: "booked out",
        actionLabel: "View FIFO",
        onAction: () => setSelectedVariantId(variantId),
        tint: "border-yellow-200 bg-yellow-50/80",
        tag: "text-red-800 bg-gradient-to-r from-pink-100 to-red-100 border border-red-200",
      };
    }),
    "new-signups": newUsers.map((item) => ({
      id: `new-user-${item.id}`,
      readKey: `new-users:${item.id}`,
      title: "New User Registered",
      message: `${item.first_name || "User"} ${item.last_name || ""} joined the platform`,
      time: formatHoursAgo(item.hours_since_signup),
      actionLabel: "View Profile",
      onAction: () => navigate("/owner/users"),
      tint: "border-yellow-200 bg-yellow-50/80",
      tag: "text-indigo-700 bg-indigo-100",
    })),
    reconciliation:
      reconciliationQuery.isSuccess && reconciliation
        ? [
            {
              id: "reconciliation-latest",
              readKey: recKey,
              title: "Reconciliation",
              message: `Net balance ${formatCurrency(Number(reconciliation.net_balance || 0))}`,
              time: reconciliation.is_balanced ? "balanced" : "not balanced",
              actionLabel: "View Dashboard",
              onAction: () => navigate("/owner/dashboard"),
              tint: "border-yellow-200 bg-yellow-50/80",
              tag: reconciliation.is_balanced
                ? "text-emerald-700 bg-emerald-100"
                : "text-red-700 bg-gradient-to-r from-pink-100 to-red-100 border border-red-200",
            },
          ]
        : [],
  };

  const allItems = Object.values(itemsByTab).flat();
  const visibleAllItems = allItems.filter((item) => !dismissedMap[item.readKey]);
  const loadedUnread = visibleAllItems.filter((item) => !readMap[item.readKey]).length;
  const fallbackUnread = Math.max(0, Number(summary?.total_alerts || 0) - getOwnerReadKeysCount());
  const unread = Math.max(loadedUnread, fallbackUnread);

  const baseCounts = {
    "pending-payments": Number(summary?.pending_payments || pendingItems.length || 0),
    "low-stock": Number(summary?.low_stock_alerts || lowItems.length || 0),
    "fully-booked": Number(summary?.fully_booked_products || fullItems.length || 0),
    "new-signups": Number(summary?.new_signups_last_7_days || newUsers.length || 0),
    reconciliation: reconciliationQuery.isSuccess ? 1 : 0,
  };

  const currentItems = (itemsByTab[activeTab] || []).filter((item) => !dismissedMap[item.readKey]);
  const orderedItems = [...currentItems].sort((a, b) => {
    const aRead = Boolean(readMap[a.readKey]);
    const bRead = Boolean(readMap[b.readKey]);
    if (aRead === bRead) return 0;
    return aRead ? 1 : -1;
  });
  const totalPages = Math.max(1, Math.ceil(orderedItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const paginatedItems = orderedItems.slice(start, start + pageSize);
  const reconciliationItem = (itemsByTab.reconciliation || [])[0] || null;

  const markOne = (key, read = true) => {
    markOwnerNotificationRead(key, read);
    setReadMap(getOwnerNotificationReadMap());
  };

  const markAllInTab = () => {
    markOwnerNotificationsReadMany(currentItems.map((item) => item.readKey));
    setReadMap(getOwnerNotificationReadMap());
    toast.success("Marked tab as read");
  };

  const markAllGlobal = () => {
    markOwnerNotificationsReadMany(allItems.map((item) => item.readKey));
    setReadMap(getOwnerNotificationReadMap());
    toast.success("Marked all as read");
  };

  const clearAllNotifications = () => {
    const next = { ...dismissedMap };
    visibleAllItems.forEach((item) => {
      if (item?.readKey) next[item.readKey] = true;
    });
    setDismissedMap(next);
    saveDismissedMap(next);
    toast.success("Notifications cleared");
  };

  const clearCurrentHistory = () => {
    const next = { ...dismissedMap };
    orderedItems.forEach((item) => {
      if (item?.readKey) next[item.readKey] = true;
    });
    setDismissedMap(next);
    saveDismissedMap(next);
    toast.success("History cleared");
  };

  const tabConfig = TABS.find((tab) => tab.key === activeTab);
  const tabLoading =
    (activeTab === "pending-payments" && pendingPaymentsQuery.isLoading) ||
    (activeTab === "low-stock" && lowStockQuery.isLoading) ||
    (activeTab === "fully-booked" && fullyBookedQuery.isLoading) ||
    (activeTab === "new-signups" && newUsersQuery.isLoading) ||
    (activeTab === "reconciliation" && reconciliationQuery.isLoading);
  const tabError =
    (activeTab === "pending-payments" && pendingPaymentsQuery.isError) ||
    (activeTab === "low-stock" && lowStockQuery.isError) ||
    (activeTab === "fully-booked" && fullyBookedQuery.isError) ||
    (activeTab === "new-signups" && newUsersQuery.isError) ||
    (activeTab === "reconciliation" && reconciliationQuery.isError);

  return {
    activeTab,
    setActiveTab,
    page,
    setPage,
    readMap,
    unread,
    baseCounts,
    tabConfig,
    tabLoading,
    tabError,
    orderedItems,
    paginatedItems,
    totalPages,
    currentPage,
    reconciliation,
    reconciliationItem,
    selectedVariantId,
    setSelectedVariantId,
    stockMatchQuery,
    clearAllNotifications,
    clearCurrentHistory,
    markAllInTab,
    markAllGlobal,
    markOne,
  };
};
