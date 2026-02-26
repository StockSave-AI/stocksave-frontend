export default function NotificationFilters() {
  const categories = [
    "All",
    "Payment Reminders",
    "Stock Alerts",
    "Redemption",
    "Unread",
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          className="px-3 py-2 border border-neutral-300 rounded-button text-neutral-500 text-xs sm:text-sm whitespace-nowrap"
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
