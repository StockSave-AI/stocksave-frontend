export default function NotificationCard({ notification }) {
  const { type, title, message, time, actions } = notification;

  const getTimeLabel = (value) => {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return parsed.toLocaleString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 p-3 sm:p-4 border border-neutral-200 rounded-card shadow-card">
      <div className="flex gap-3 sm:gap-4 min-w-0">
        <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center rounded-card text-xs font-semibold text-neutral-600">
          {type === "payment" && "N"}
          {type === "stock" && "Box"}
          {type === "redemption" && "OK"}
          {type === "booking" && "Bag"}
        </div>
        <div className="min-w-0">
          <p className="font-semibold">{title}</p>
          <p className="text-neutral-500 text-sm break-words">{message}</p>
        </div>
      </div>
      <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
        <span className="text-neutral-400 text-xs">{getTimeLabel(time)}</span>
        <div className="flex flex-wrap gap-2">
          {actions?.map((action) => (
            <button
              key={action.label}
              className="px-3 py-1 border border-neutral-300 rounded-button text-neutral-500 text-xs sm:text-sm"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
