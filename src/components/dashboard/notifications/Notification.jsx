import { useNotifications } from "../../hooks/useNotifications";
import NotificationCard from "./NotificationCard";
import NotificationFilters from "./NotificationFilters";
import NotificationHeader from "./NotificationHeader";
import NotificationSettings from "./NotificationSettings";

export default function Notifications() {
  const { notifications, loadMore, markAllRead, isLoading, isError } = useNotifications();

  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);

  const unreadCount = notifications.filter((item) => !item?.read).length;
  const weekCount = notifications.filter((item) => {
    const createdAt = new Date(item?.time || 0);
    return !Number.isNaN(createdAt.getTime()) && createdAt >= weekAgo;
  }).length;
  const totalCount = notifications.length;

  return (
    <div className="p-3 sm:p-6 space-y-5 sm:space-y-6 overflow-x-hidden">
      <NotificationHeader
        onMarkAllRead={markAllRead}
        unreadCount={unreadCount}
        weekCount={weekCount}
        totalCount={totalCount}
      />
      <NotificationFilters />
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-neutral-500">Loading notifications...</p>
        ) : null}
        {!isLoading && isError ? (
          <p className="text-sm text-error">Failed to load notifications.</p>
        ) : null}
        {!isLoading && !isError && notifications.length === 0 ? (
          <p className="text-sm text-neutral-500">No notifications yet.</p>
        ) : null}
        {notifications.map((n) => (
          <NotificationCard key={n.id} notification={n} />
        ))}
      </div>
      <NotificationSettings />
      <button
        onClick={loadMore}
        className="w-full py-3 border border-neutral-300 rounded-button text-neutral-500 text-sm sm:text-base"
      >
        Load More Notifications
      </button>
    </div>
  );
}
