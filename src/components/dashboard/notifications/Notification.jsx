import { useNotifications } from "../../hooks/useNotifications";
import NotificationCard from "./NotificationCard";
import NotificationFilters from "./NotificationFilters";
import NotificationHeader from "./NotificationHeader";
import NotificationSettings from "./NotificationSettings";

export default function Notifications() {
  const { notifications, loadMore, markAllRead } = useNotifications();

  return (
    <div className="p-6 space-y-6">
      <NotificationHeader onMarkAllRead={markAllRead} />
      <NotificationFilters />
      <div className="space-y-4">
        {notifications.map((n) => (
          <NotificationCard key={n.id} notification={n} />
        ))}
      </div>
      <NotificationSettings />
      <button
        onClick={loadMore}
        className="w-full py-3 border border-neutral-300 rounded-button text-neutral-500"
      >
        Load More Notifications
      </button>
    </div>
  );
}
