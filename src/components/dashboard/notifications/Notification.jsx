import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiRefreshCw,
  FiTrash2,
} from "react-icons/fi";
import {
  useCustomerNotifications,
  useDeleteCustomerNotification,
  useMarkAllCustomerNotificationsRead,
  useMarkCustomerNotificationRead,
} from "../../hooks/useNotifications";

const TYPE_OPTIONS = [
  { key: "", label: "All" },
  { key: "deposit_confirmed", label: "Deposits" },
  { key: "booking_update", label: "Bookings" },
  { key: "stock_alert", label: "Stock Alerts" },
];

const toArray = (payload) =>
  Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];

const getTypeStyle = (type) => {
  const value = String(type || "").toLowerCase();
  if (value === "deposit_confirmed")
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (value === "payment_reminder")
    return "bg-amber-50 text-amber-700 border-amber-200";
  if (value === "stock_alert") return "bg-red-50 text-red-700 border-red-200";
  if (value === "booking_update")
    return "bg-blue-50 text-blue-700 border-blue-200";
  if (value === "redemption_update")
    return "bg-purple-50 text-purple-700 border-purple-200";
  return "bg-neutral-50 text-neutral-700 border-neutral-200";
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const StatCard = ({ label, value }) => (
  <div className="bg-white border border-neutral-200 rounded-card p-4 shadow-card">
    <p className="text-xs text-neutral-500">{label}</p>
    <p className="text-xl font-semibold text-neutral-900">{value}</p>
  </div>
);

const NotificationCard = ({ item, onMarkRead, onDelete, busy }) => {
  const isRead = Number(item?.is_read) === 1;
  return (
    <div
      className={`border rounded-card p-4 shadow-card transition ${
        isRead
          ? "bg-neutral-50 border-neutral-200"
          : "bg-white border-primary-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-neutral-900">
              {item?.title || "Notification"}
            </h3>
            <span
              className={`text-[11px] px-2 py-1 rounded-full border ${getTypeStyle(item?.type)}`}
            >
              {String(item?.type || "general").replace("_", " ")}
            </span>
            <span
              className={`text-[11px] px-2 py-1 rounded-full ${
                isRead
                  ? "bg-neutral-200 text-neutral-700"
                  : "bg-primary-100 text-primary-700"
              }`}
            >
              {isRead ? "Read" : "Unread"}
            </span>
          </div>
          <p className="text-sm text-neutral-600 mt-1 break-words">
            {item?.message || "-"}
          </p>
          <p className="text-xs text-neutral-400 mt-2">
            {formatDateTime(item?.created_at)}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          {!isRead ? (
            <button
              onClick={() => onMarkRead(item?.id)}
              disabled={busy}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-button border border-neutral-200 text-xs text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              <FiCheck size={13} />
              Mark read
            </button>
          ) : null}
          <button
            onClick={() => onDelete(item?.id)}
            disabled={busy}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-button border border-error/30 text-xs text-error hover:bg-error/5 disabled:opacity-50"
          >
            <FiTrash2 size={13} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Notifications() {
  const [type, setType] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const notificationsQuery = useCustomerNotifications({
    type,
    unread: unreadOnly ? true : undefined,
    page,
    limit,
  });
  const markAllMutation = useMarkAllCustomerNotificationsRead();
  const markReadMutation = useMarkCustomerNotificationRead();
  const deleteMutation = useDeleteCustomerNotification();

  const stats = notificationsQuery.data?.stats || {};
  const notifications = useMemo(
    () => toArray(notificationsQuery.data),
    [notificationsQuery.data],
  );
  const isBusy =
    markAllMutation.isPending ||
    markReadMutation.isPending ||
    deleteMutation.isPending;

  const handleMarkAllRead = async () => {
    try {
      await markAllMutation.mutateAsync();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error(error.message || "Failed to mark all as read");
    }
  };

  const handleMarkRead = async (id) => {
    if (!id) return;
    try {
      await markReadMutation.mutateAsync(id);
    } catch (error) {
      toast.error(error.message || "Failed to mark notification");
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Notification deleted");
    } catch (error) {
      toast.error(error.message || "Failed to delete notification");
    }
  };

  const hasNextPage = notifications.length === limit;

  return (
    <div className="p-3 sm:p-6 space-y-6 overflow-x-hidden">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FiBell size={16} className="text-primary-600" />
            <h1 className="font-semibold text-h2 text-neutral-900">
              Notification Feed
            </h1>
          </div>
          <p className="text-sm text-neutral-500">
            Live customer feed for payments, bookings, redemptions and stock
            updates.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => {
                setUnreadOnly(e.target.checked);
                setPage(1);
              }}
              className="w-4 h-4 rounded border-2 border-primary-500 
                 text-primary-600 focus:ring-2 focus:ring-primary-400 
                 focus:ring-offset-0 transition"
            />
            <span className="text-sm font-medium text-neutral-700">
              Unread only
            </span>
          </label>

          <button
            onClick={handleMarkAllRead}
            disabled={isBusy}
            className="inline-flex items-center justify-center gap-2 
               px-4 py-2 rounded-button bg-primary-600 text-white 
               text-sm hover:bg-primary-700 disabled:opacity-60 transition"
          >
            <FiCheckCircle size={14} />
            Mark all as read
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Unread" value={Number(stats?.unread || 0)} />
        <StatCard label="This Week" value={Number(stats?.this_week || 0)} />
        <StatCard label="Total" value={Number(stats?.total || 0)} />
      </div>

      <div className="bg-white border border-neutral-200 rounded-card p-4 shadow-card space-y-3">
        <div className="md:hidden">
          <p className="text-xs text-neutral-500 mb-1">Filter</p>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 rounded-button border border-neutral-200 text-sm"
          >
            {TYPE_OPTIONS.map((option) => (
              <option key={option.key || "all"} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-2">
          {TYPE_OPTIONS.map((option) => (
            <button
              key={option.key || "all"}
              onClick={() => {
                setType(option.key);
                setPage(1);
              }}
              className={`px-3 py-2 rounded-button text-xs sm:text-sm border ${
                type === option.key
                  ? "bg-primary-50 text-primary-700 border-primary-200"
                  : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {notificationsQuery.isLoading ? (
          <p className="text-sm text-neutral-500">Loading notifications...</p>
        ) : null}
        {!notificationsQuery.isLoading && notificationsQuery.isError ? (
          <p className="text-sm text-error">Failed to load notifications.</p>
        ) : null}
        {!notificationsQuery.isLoading &&
        !notificationsQuery.isError &&
        notifications.length === 0 ? (
          <p className="text-sm text-neutral-500">No notifications found.</p>
        ) : null}

        {notifications.map((item) => (
          <NotificationCard
            key={item?.id}
            item={item}
            onMarkRead={handleMarkRead}
            onDelete={handleDelete}
            busy={isBusy}
          />
        ))}

        {!notificationsQuery.isLoading && notifications.length > 0 ? (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 rounded-button border border-neutral-200 text-sm text-neutral-700 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-xs text-neutral-500">Page {page}</span>
            <button
              onClick={() => setPage((p) => (hasNextPage ? p + 1 : p))}
              disabled={!hasNextPage}
              className="px-3 py-2 rounded-button border border-neutral-200 text-sm text-neutral-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
