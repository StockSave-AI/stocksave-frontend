import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiCreditCard,
  FiEye,
  FiLayers,
  FiSearch,
  FiShoppingCart,
  FiUserPlus,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getAuthRole } from "../../../utils/authStorage";
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

const SNAPSHOT_KEY = "owner_notifications_snapshot_v1";
const DISMISSED_KEY = "owner_notifications_dismissed_v1";

const TABS = [
  {
    key: "pending-payments",
    label: "Pending Payments",
    empty: "No pending payments.",
  },
  {
    key: "low-stock",
    label: "Low Stock",
    empty: "No low stock alerts right now.",
  },
  {
    key: "fully-booked",
    label: "Fully Booked",
    empty: "No fully booked products.",
  },
  {
    key: "new-signups",
    label: "New Signups",
    empty: "No new signups in this period.",
  },
  {
    key: "reconciliation",
    label: "Reconciliation",
    empty: "Reconciliation data not available.",
  },
];

const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const readSummary = (payload) => payload?.data || payload || {};

const formatHoursAgo = (value) => {
  const hours = Number(value);
  if (!Number.isFinite(hours) || hours <= 0) return "just now";
  if (hours <= 1) return "1 hour ago";
  return `${Math.floor(hours)} hours ago`;
};

const variantIdFrom = (item) =>
  item?.product_variant_id || item?.variant_id || item?.variantId || item?.id;

const getSnapshot = () => {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveSnapshot = (snapshot) => {
  localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
};

const getDismissedMap = () => {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const saveDismissedMap = (value) => {
  localStorage.setItem(DISMISSED_KEY, JSON.stringify(value));
};

const StockMatchModal = ({ open, onClose, variantId, query }) => {
  if (!open) return null;
  const payload = query.data?.data || query.data || {};
  const batches = toArray(payload?.batches || payload);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        role="presentation"
      />
      <div className="relative w-full max-w-2xl bg-white rounded-card border border-yellow-200 shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-800">
            FIFO Stock Batches
          </h3>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-button border border-neutral-200 text-sm"
          >
            Close
          </button>
        </div>
        <p className="text-sm text-neutral-600 mb-3">Variant ID: {variantId}</p>

        {query.isLoading ? (
          <div className="h-24 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-2 border-neutral-200 border-t-yellow-500 animate-spin" />
          </div>
        ) : null}

        {!query.isLoading && query.isError ? (
          <div className="h-24 flex items-center justify-center text-sm text-error">
            Failed to load stock batches.
          </div>
        ) : null}

        {!query.isLoading && !query.isError && batches.length === 0 ? (
          <div className="h-24 flex items-center justify-center text-sm text-neutral-500">
            No available batches.
          </div>
        ) : null}

        {!query.isLoading && !query.isError && batches.length > 0 ? (
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            {batches.map((batch, index) => (
              <div
                key={batch?.stock_batch_id || batch?.id || index}
                className="rounded-xl border border-yellow-200 bg-yellow-50/40 p-3"
              >
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-neutral-800">
                    Batch #{batch?.stock_batch_id || batch?.id || index + 1}
                  </span>
                  <span className="text-neutral-500">
                    {batch?.date_added || "N/A"}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-neutral-700">
                  <span>Qty Remaining: {batch?.quantity_remaining ?? 0}</span>
                  <span>Product: {batch?.product_name || "N/A"}</span>
                  <span>Variant: {batch?.size_label || "N/A"}</span>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const ReconciliationInsightCard = ({
  reconciliation,
  isRead,
  onToggleRead,
  onOpenDashboard,
}) => {
  const deposits = Number(reconciliation?.total_deposits || 0);
  const withdrawals = Number(reconciliation?.total_withdrawals || 0);
  const bookingHolds = Number(reconciliation?.total_booking_holds || 0);
  const pending = Number(reconciliation?.total_pending || 0);
  const netBalance = Number(reconciliation?.net_balance || 0);
  const isBalanced = Boolean(reconciliation?.is_balanced) && netBalance >= 0;

  const availableSlotsBudget = Math.max(0, deposits - withdrawals);
  const allocatedSlots = bookingHolds;
  const slotMismatch = allocatedSlots - availableSlotsBudget;
  const hasSlotMismatch = slotMismatch > 0;

  const overbookingRisk = hasSlotMismatch;
  const phantomStockRisk = hasSlotMismatch;
  const accountingRisk = !isBalanced;

  const cardTint = isBalanced
    ? "border-emerald-200 bg-emerald-50/40"
    : "border-red-200 bg-red-50/50";

  return (
    <div className={`rounded-card border p-4 md:p-5 ${cardTint}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-neutral-900">
            Financial Reconciliation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-[11px] font-semibold ${
              isRead
                ? "text-emerald-700 bg-emerald-100"
                : "text-red-700 bg-red-100 border border-red-200"
            }`}
          >
            {isRead ? "Read" : "Unread"}
          </span>
          <button
            onClick={onToggleRead}
            className="px-3 py-1.5 rounded-button border border-neutral-200 bg-white text-xs text-neutral-700"
          >
            {isRead ? "Mark unread" : "Mark read"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-2.5">
          <p className="text-[11px] text-neutral-500">Deposits</p>
          <p className="text-sm font-semibold text-neutral-900">
            {formatCurrency(deposits)}
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-2.5">
          <p className="text-[11px] text-neutral-500">Withdrawals</p>
          <p className="text-sm font-semibold text-neutral-900">
            {formatCurrency(withdrawals)}
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-2.5">
          <p className="text-[11px] text-neutral-500">Booking Holds</p>
          <p className="text-sm font-semibold text-neutral-900">
            {formatCurrency(bookingHolds)}
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-2.5">
          <p className="text-[11px] text-neutral-500">Net Balance</p>
          <p
            className={`text-sm font-semibold ${
              netBalance >= 0 ? "text-emerald-700" : "text-red-700"
            }`}
          >
            {formatCurrency(netBalance)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
        <div
          className={`rounded-lg border p-2.5 text-xs ${
            overbookingRisk
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          Overbooking risk: {overbookingRisk ? "Detected" : "Clear"}
        </div>
        <div
          className={`rounded-lg border p-2.5 text-xs ${
            phantomStockRisk
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          Phantom stock risk: {phantomStockRisk ? "Detected" : "Clear"}
        </div>
        <div
          className={`rounded-lg border p-2.5 text-xs ${
            accountingRisk
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          Accounting consistency: {accountingRisk ? "Issue" : "Healthy"}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-[11px] text-neutral-500">
          Pending amount: {formatCurrency(pending)}
        </p>
        <button
          onClick={onOpenDashboard}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-button bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold"
        >
          <FiEye size={14} />
          View Dashboard
        </button>
      </div>
    </div>
  );
};

export default function OwnerNotifications() {
  const navigate = useNavigate();
  const isOwner = getAuthRole() === "owner";
  const PAGE_SIZE = 8;
  const [activeTab, setActiveTab] = useState("pending-payments");
  const [readFilter, setReadFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [readMap, setReadMap] = useState(() => getOwnerNotificationReadMap());
  const [dismissedMap, setDismissedMap] = useState(() => getDismissedMap());

  const summaryQuery = useOwnerNotificationSummary(isOwner);
  const pendingPaymentsQuery = useOwnerNotificationPendingPayments(isOwner);
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

  useEffect(() => {
    if (!isOwner) {
      toast.error("Owner access only");
      navigate("/dashboard", { replace: true });
    }
  }, [isOwner, navigate]);

  const pendingItems = useMemo(
    () => toArray(pendingPaymentsQuery.data),
    [pendingPaymentsQuery.data],
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
        if (!prevLow.has(item.id)) {
          toast(`New low stock alert: ${item.product}`);
        }
      });
      (previous.low || []).forEach((item) => {
        if (!currLow.has(item.id)) {
          toast(`Stock updated: ${item.product} now has healthy stock.`);
        }
      });
      current.full.forEach((item) => {
        if (!prevFull.has(item.id)) {
          toast(`New low stock alert: ${item.product} is fully booked.`);
        }
      });
      (previous.full || []).forEach((item) => {
        if (!currFull.has(item.id)) {
          toast(`Stock updated: ${item.product} is no longer fully booked.`);
        }
      });
    }

    saveSnapshot(current);
  }, [
    fullItems,
    fullyBookedQuery.isSuccess,
    lowItems,
    lowStockQuery.isSuccess,
  ]);

  if (!isOwner) return null;

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
  const visibleAllItems = allItems.filter(
    (item) => !dismissedMap[item.readKey],
  );
  const loadedUnread = visibleAllItems.filter(
    (item) => !readMap[item.readKey],
  ).length;
  const fallbackUnread = Math.max(
    0,
    Number(summary?.total_alerts || 0) - getOwnerReadKeysCount(),
  );
  const unread = Math.max(loadedUnread, fallbackUnread);

  const baseCounts = {
    "pending-payments": Number(
      summary?.pending_payments || pendingItems.length || 0,
    ),
    "low-stock": Number(summary?.low_stock_alerts || lowItems.length || 0),
    "fully-booked": Number(
      summary?.fully_booked_products || fullItems.length || 0,
    ),
    "new-signups": Number(
      summary?.new_signups_last_7_days || newUsers.length || 0,
    ),
    reconciliation: reconciliationQuery.isSuccess ? 1 : 0,
  };

  const currentItems = (itemsByTab[activeTab] || []).filter(
    (item) => !dismissedMap[item.readKey],
  );
  const filteredItems = currentItems.filter((item) => {
    const isRead = Boolean(readMap[item.readKey]);
    if (readFilter === "read") return isRead;
    if (readFilter === "unread") return !isRead;
    return true;
  });
  const searchedItems = filteredItems.filter((item) => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return true;
    const title = String(item?.title || "").toLowerCase();
    const message = String(item?.message || "").toLowerCase();
    return title.includes(needle) || message.includes(needle);
  });
  const orderedItems = [...searchedItems].sort((a, b) => {
    const aRead = Boolean(readMap[a.readKey]);
    const bRead = Boolean(readMap[b.readKey]);
    if (aRead === bRead) return 0;
    return aRead ? 1 : -1;
  });
  const totalPages = Math.max(1, Math.ceil(orderedItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedItems = orderedItems.slice(start, start + PAGE_SIZE);
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

  const iconMap = {
    "pending-payments": FiCreditCard,
    "low-stock": FiAlertTriangle,
    "fully-booked": FiShoppingCart,
    "new-signups": FiUserPlus,
    reconciliation: FiLayers,
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-h2 text-neutral-900">Notifications</h1>
            <p className="text-neutral-500 text-sm">
              You have {unread} unread notifications
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearAllNotifications}
              className="inline-flex items-center gap-2 bg-white border border-neutral-300 text-neutral-700 px-4 py-2.5 rounded-button font-semibold text-sm hover:bg-neutral-50"
            >
              Clear Notifications
            </button>
            <button
              onClick={markAllGlobal}
              className="inline-flex items-center gap-2 bg-success text-white px-5 py-2.5 rounded-button font-semibold text-sm hover:opacity-95"
            >
              <FiCheckCircle size={16} />
              Mark All as Read
            </button>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-card p-3 flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setPage(1);
                  setSearchTerm("");
                }}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-button text-sm border ${
                  active
                    ? "border-primary-300 bg-primary-50 text-primary-700"
                    : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {tab.label}
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-xs">
                  {baseCounts[tab.key] || 0}
                </span>
              </button>
            );
          })}
        </div>

        <div className="bg-white border border-neutral-200 rounded-card p-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-neutral-600 font-medium">Filter:</span>
            <select
              value={readFilter}
              onChange={(e) => {
                setReadFilter(e.target.value);
                setPage(1);
              }}
              className="px-2 py-1.5 border border-neutral-200 rounded-button text-neutral-700 bg-white"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            <button
              onClick={markAllInTab}
              className="px-3 py-1.5 rounded-button border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            >
              Mark tab as read
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <FiSearch
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
                size={14}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Search notifications..."
                className="pl-8 pr-3 py-1.5 rounded-button border border-neutral-200 text-sm w-56"
              />
            </div>
            <button
              onClick={clearCurrentHistory}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-button border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            >
              Clear history
            </button>
          </div>
        </div>

        {tabLoading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="h-9 w-9 rounded-full border-2 border-neutral-200 border-t-primary-500 animate-spin" />
          </div>
        ) : null}

        {!tabLoading && tabError ? (
          <div className="bg-white border border-neutral-200 rounded-card p-8 text-center">
            <p className="text-sm text-error">
              {activeTab === "reconciliation"
                ? "Reconciliation data not available."
                : "Failed to load notifications for this tab."}
            </p>
            <button
              onClick={clearCurrentHistory}
              className="mt-3 px-4 py-2 rounded-button border border-neutral-200 text-sm text-neutral-700"
            >
              Clear history
            </button>
          </div>
        ) : null}

        {!tabLoading && !tabError && orderedItems.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-card p-8 text-center">
            <p className="text-sm text-neutral-500">{tabConfig?.empty}</p>
            <button
              onClick={clearCurrentHistory}
              className="mt-3 px-4 py-2 rounded-button border border-neutral-200 text-sm text-neutral-700"
            >
              Clear history
            </button>
          </div>
        ) : null}

        {!tabLoading && !tabError && orderedItems.length > 0 ? (
          activeTab === "reconciliation" && reconciliationItem ? (
            <ReconciliationInsightCard
              reconciliation={reconciliation}
              isRead={!!readMap[reconciliationItem.readKey]}
              onToggleRead={() =>
                markOne(
                  reconciliationItem.readKey,
                  !readMap[reconciliationItem.readKey],
                )
              }
              onOpenDashboard={() => navigate("/owner/dashboard")}
            />
          ) : (
            <div className="space-y-3">
              {paginatedItems.map((item) => {
                const isRead = Boolean(readMap[item.readKey]);
                const Icon = iconMap[activeTab] || FiBell;
                const cardClass = isRead
                  ? "border-emerald-200 bg-emerald-50/40"
                  : item.tint;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-card border transition ${cardClass}`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isRead
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-white/90 text-neutral-700"
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-h6 font-semibold text-neutral-900">
                            {item.title}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-[11px] rounded-full font-semibold ${
                              isRead
                                ? "text-emerald-700 bg-emerald-100"
                                : item.tag
                            }`}
                          >
                            {isRead ? "Read" : "Unread"}
                          </span>
                        </div>
                        <p className="text-neutral-700 mt-0.5">
                          {item.message}
                        </p>
                        <p className="text-sm text-neutral-500 mt-1">
                          {item.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => markOne(item.readKey, !isRead)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-button border border-neutral-200 bg-white text-neutral-700 text-sm"
                      >
                        <FiCheck size={14} />
                        {isRead ? "Mark unread" : "Mark read"}
                      </button>
                      <button
                        onClick={item.onAction}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-button bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-semibold"
                      >
                        <FiEye size={14} />
                        {item.actionLabel}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : null}

        {!tabLoading && !tabError && orderedItems.length > PAGE_SIZE ? (
          <div className="bg-white border border-neutral-200 rounded-card p-3 flex items-center justify-between gap-3">
            <p className="text-xs text-neutral-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-neutral-200 text-neutral-700 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-neutral-200 text-neutral-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <StockMatchModal
        open={Boolean(selectedVariantId)}
        onClose={() => setSelectedVariantId(null)}
        variantId={selectedVariantId}
        query={stockMatchQuery}
      />
    </div>
  );
}
