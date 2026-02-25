export default function NotificationHeader({
  onMarkAllRead,
  unreadCount = 0,
  weekCount = 0,
  totalCount = 0,
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-h2 font-semibold">Notifications</h2>
        <button
          onClick={onMarkAllRead}
          className="px-4 py-2 border border-neutral-300 rounded-button"
        >
          Mark All Read
        </button>
      </div>
      <div className="flex gap-4">
        {[
          { title: "Unread", value: unreadCount },
          { title: "This Week", value: weekCount },
          { title: "Total", value: totalCount },
        ].map((item, i) => (
          <div
            key={i}
            className="flex-1 p-4 border border-neutral-200 rounded-card text-center"
          >
            <p className="text-neutral-400">{item.title}</p>
            <p className="text-h3 font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
