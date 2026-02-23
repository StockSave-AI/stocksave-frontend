export default function NotificationHeader({ onMarkAllRead }) {
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
        {["Unread", "This Week", "Total"].map((title, i) => (
          <div
            key={i}
            className="flex-1 p-4 border border-neutral-200 rounded-card text-center"
          >
            <p className="text-neutral-400">{title}</p>
            <p className="text-h3 font-semibold">0</p>
          </div>
        ))}
      </div>
    </div>
  );
}
