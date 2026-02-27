import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { formatCurrency } from "../../../utils/currency";
import {
  getOwnerNotificationReadMap,
  markOwnerNotificationRead as markOwnerNotificationReadLocal,
  markOwnerNotificationsReadMany,
  useOwnerNotificationFeed,
  useOwnerNotificationFullyBooked,
  useOwnerNotificationLowStock,
  useOwnerNotificationNewUsers,
  useOwnerNotificationPendingPayments,
  useOwnerNotificationWithdrawals,
  useOwnerNotificationReconciliation,
  useOwnerNotificationStockMatch,
  useOwnerNotificationSummary,
} from "../hooks/useOwnerNotifications";
import {
  clearAllOwnerNotifications,
  deleteOwnerNotification,
  markAllOwnerNotificationsRead,
  markOwnerNotificationRead,
} from "../services/ownerNotificationsApi";
import { TABS } from "./constants";
import {
  formatHoursAgo,
  getSnapshot,
  readSummary,
  saveSnapshot,
  toArray,
  variantIdFrom,
} from "./utils";

export const useOwnerNotificationsPage = ({
  isOwner,
  navigate,
  pageSize = 8,
}) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pending-payments");
  const [page, setPage] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [readMap, setReadMap] = useState(() => getOwnerNotificationReadMap());

  const summaryQuery = useOwnerNotificationSummary(isOwner);
  const feedQuery = useOwnerNotificationFeed(
    { page, limit: pageSize },
    isOwner,
  );
  const pendingPaymentsQuery = useOwnerNotificationPendingPayments(isOwner);
  const withdrawalAlertsQuery = useOwnerNotificationWithdrawals(
    { page: 1, limit: 20 },
    isOwner,
  );
  const lowStockQuery = useOwnerNotificationLowStock(
    { threshold: 10 },
    isOwner,
  );
  const fullyBookedQuery = useOwnerNotificationFullyBooked(isOwner);
  const newUsersQuery = useOwnerNotificationNewUsers(
    { days: 7, limit: 20 },
    isOwner,
  );
  const reconciliationQuery = useOwnerNotificationReconciliation(isOwner);
  const stockMatchQuery = useOwnerNotificationStockMatch(
    selectedVariantId,
    Boolean(selectedVariantId),
  );

  const markAllFeedReadMutation = useMutation({
    mutationFn: markAllOwnerNotificationsRead,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["owner-notifications-feed"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["owner-notifications-summary"],
        }),
      ]);
    },
  });

  const markOneFeedReadMutation = useMutation({
    mutationFn: (id) => markOwnerNotificationRead(id),
    // Intentionally do not refetch immediately.
    // Read state should reflect on next page reload/refresh.
    onSuccess: () => {},
  });

  const clearAllFeedMutation = useMutation({
    mutationFn: clearAllOwnerNotifications,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["owner-notifications-feed"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["owner-notifications-summary"],
        }),
      ]);
    },
  });

  const deleteFeedItemMutation = useMutation({
    mutationFn: (id) => deleteOwnerNotification(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["owner-notifications-feed"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["owner-notifications-summary"],
        }),
      ]);
    },
  });

  const feedPayload = useMemo(
    () => feedQuery.data?.data || feedQuery.data || {},
    [feedQuery.data],
  );
  const feedStats = feedPayload?.stats || {};
  const feedRows = useMemo(() => toArray(feedPayload), [feedPayload]);
  const pendingItems = useMemo(
    () => toArray(pendingPaymentsQuery.data),
    [pendingPaymentsQuery.data],
  );
  const withdrawalItems = useMemo(
    () => toArray(withdrawalAlertsQuery.data),
    [withdrawalAlertsQuery.data],
  );
  const lowItems = useMemo(
    () => toArray(lowStockQuery.data),
    [lowStockQuery.data],
  );
  const fullItems = useMemo(
    () => toArray(fullyBookedQuery.data),
    [fullyBookedQuery.data],
  );
  const newUsers = useMemo(
    () => toArray(newUsersQuery.data),
    [newUsersQuery.data],
  );
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
      const prevLow = new Map(
        (previous.low || []).map((item) => [item.id, item]),
      );
      const currLow = new Map(
        (current.low || []).map((item) => [item.id, item]),
      );
      const prevFull = new Set((previous.full || []).map((item) => item.id));
      const currFull = new Set((current.full || []).map((item) => item.id));

      current.low.forEach((item) => {
        if (!prevLow.has(item.id))
          toast(`New low stock alert: ${item.product}`);
      });
      (previous.low || []).forEach((item) => {
        if (!currLow.has(item.id))
          toast(`Stock updated: ${item.product} now has healthy stock.`);
      });
      current.full.forEach((item) => {
        if (!prevFull.has(item.id))
          toast(`New low stock alert: ${item.product} is fully booked.`);
      });
      (previous.full || []).forEach((item) => {
        if (!currFull.has(item.id))
          toast(`Stock updated: ${item.product} is no longer fully booked.`);
      });
    }

    saveSnapshot(current);
  }, [
    fullItems,
    fullyBookedQuery.isSuccess,
    lowItems,
    lowStockQuery.isSuccess,
  ]);

  const recKey = `reconciliation:${new Date().toISOString().slice(0, 10)}`;
  const feedReferenceIndex = useMemo(() => {
    const map = new Map();
    feedRows.forEach((row) => {
      const refType = String(row?.reference_type || "").toLowerCase();
      const refId = Number(row?.reference_id);
      if (!refType || !Number.isFinite(refId)) return;
      map.set(`${refType}:${refId}`, row?.id);
    });
    return map;
  }, [feedRows]);

  const itemsByTab = {
    feed: feedRows.map((item) => ({
      id: `feed-${item.id}`,
      notificationId: item.id,
      readKey: `feed:${item.id}`,
      isRead: Number(item?.is_read) === 1,
      title: item?.title || "Notification",
      message: item?.message || "-",
      time: item?.created_at
        ? new Date(item.created_at).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "just now",
      actionLabel: "Open Notification",
      onAction: () => navigate("/owner/notification"),
      tint: "border-yellow-200 bg-yellow-50/80",
      tag: "text-indigo-700 bg-indigo-100",
    })),
    "withdrawal-alerts": withdrawalItems.map((item) => ({
      id: `withdrawal-${item.id}`,
      notificationId: item.id,
      readKey: `withdrawal-alerts:${item.id}`,
      isRead: Number(item?.is_read) === 1,
      title: item?.title || "Withdrawal Alert",
      message:
        String(item?.message || "-")
          .replace(/\s*Reference:\s*[^.]+\.?/gi, "")
          .trim() || "-",
      time: item?.created_at
        ? new Date(item.created_at).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "just now",
      actionLabel: "View Withdrawals",
      onAction: () => navigate("/owner/withdrawals"),
      tint: "border-yellow-200 bg-yellow-50/80",
      tag: "text-red-700 bg-gradient-to-r from-pink-100 to-red-100 border border-red-200",
    })),
    "pending-payments": pendingItems.map((item) => ({
      id: `pending-${item.transaction_id}`,
      notificationId:
        feedReferenceIndex.get(`transaction:${Number(item?.transaction_id)}`) ??
        null,
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
        notificationId:
          feedReferenceIndex.get(`stock:${Number(variantId)}`) ??
          feedReferenceIndex.get(`variant:${Number(variantId)}`) ??
          null,
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
        notificationId:
          feedReferenceIndex.get(`stock:${Number(variantId)}`) ??
          feedReferenceIndex.get(`variant:${Number(variantId)}`) ??
          null,
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
      notificationId:
        feedReferenceIndex.get(`user:${Number(item?.id)}`) ??
        feedReferenceIndex.get(`customer:${Number(item?.id)}`) ??
        null,
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
  const visibleAllItems = allItems;
  const loadedUnread = visibleAllItems.filter((item) => {
    if (item?.notificationId) return !item?.isRead;
    return !readMap[item.readKey];
  }).length;
  const backendUnread = Number(
    summary?.unread_notifications ?? feedStats?.unread ?? 0,
  );
  const unread = Math.max(loadedUnread, backendUnread);

  const baseCounts = {
    "withdrawal-alerts": Number(
      summary?.withdrawal_alerts || withdrawalItems.length || 0,
    ),
    "pending-payments": Number(
      summary?.pending_payments || pendingItems.length || 0,
    ),
    "low-stock": Number(summary?.low_stock_alerts || lowItems.length || 0),
    "fully-booked": Number(
      summary?.fully_booked_products || fullItems.length || 0,
    ),
    "new-signups": Number(
      summary?.new_signups ??
        summary?.new_signups_last_7_days ??
        newUsers.length ??
        0,
    ),
    reconciliation: reconciliationQuery.isSuccess ? 1 : 0,
  };

  const currentItems = itemsByTab[activeTab] || [];
  const orderedItems = [...currentItems].sort((a, b) => {
    const aRead = a?.notificationId
      ? Boolean(a?.isRead)
      : Boolean(readMap[a.readKey]);
    const bRead = b?.notificationId
      ? Boolean(b?.isRead)
      : Boolean(readMap[b.readKey]);
    if (aRead === bRead) return 0;
    return aRead ? 1 : -1;
  });

  const totalPages = Math.max(1, Math.ceil(orderedItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const paginatedItems = orderedItems.slice(start, start + pageSize);
  const reconciliationItem = (itemsByTab.reconciliation || [])[0] || null;

  const markOne = async (item, read = true) => {
    if (item?.notificationId) {
      if (!read) return;
      try {
        await markOneFeedReadMutation.mutateAsync(item.notificationId);
      } catch (error) {
        toast.error(error?.message || "Failed to mark notification as read.");
      }
      return;
    }

    markOwnerNotificationReadLocal(item?.readKey, read);
    setReadMap(getOwnerNotificationReadMap());
  };

  const markAllGlobal = async () => {
    try {
      await markAllFeedReadMutation.mutateAsync();
    } catch {
      // Keep local read-state fallback even when backend mark-all fails.
    }
    markOwnerNotificationsReadMany(
      allItems.map((item) => item.readKey).filter(Boolean),
    );
    setReadMap(getOwnerNotificationReadMap());
    toast.success("Marked all as read");
  };

  const clearAllNotifications = async () => {
    try {
      await clearAllFeedMutation.mutateAsync();
      toast.success("Notifications deleted from database");
    } catch {
      toast.error("Failed to clear notifications.");
    }
  };

  const clearCurrentHistory = async () => {
    markOwnerNotificationsReadMany(
      orderedItems.map((item) => item?.readKey).filter(Boolean),
    );
    setReadMap(getOwnerNotificationReadMap());
    toast.success("Marked current tab as read");
  };

  const deleteOne = async (item) => {
    if (!item?.notificationId) {
      toast.error("Only feed notifications can be deleted from database.");
      return;
    }
    try {
      await deleteFeedItemMutation.mutateAsync(item.notificationId);
      toast.success("Notification deleted from database");
    } catch (error) {
      toast.error(error?.message || "Failed to delete notification.");
    }
  };

  const tabConfig = TABS.find((tab) => tab.key === activeTab);
  const tabLoading =
    (activeTab === "withdrawal-alerts" && withdrawalAlertsQuery.isLoading) ||
    (activeTab === "pending-payments" && pendingPaymentsQuery.isLoading) ||
    (activeTab === "low-stock" && lowStockQuery.isLoading) ||
    (activeTab === "fully-booked" && fullyBookedQuery.isLoading) ||
    (activeTab === "new-signups" && newUsersQuery.isLoading) ||
    (activeTab === "reconciliation" && reconciliationQuery.isLoading);
  const tabError =
    (activeTab === "withdrawal-alerts" && withdrawalAlertsQuery.isError) ||
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
    markAllGlobal,
    markOne,
    deleteOne,
  };
};
