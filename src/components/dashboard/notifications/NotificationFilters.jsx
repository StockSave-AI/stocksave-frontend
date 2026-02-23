export default function NotificationFilters() {
  const categories = [
    "All",
    "Payment Reminders",
    "Stock Alerts",
    "Redemption",
    "Unread",
  ];
  return (
    <div className="flex gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          className="px-4 py-2 border border-neutral-300 rounded-button text-neutral-500"
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
