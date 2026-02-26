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
    <div className="flex justify-between items-start p-4 border border-neutral-200 rounded-card shadow-card">
      <div className="flex gap-4">
        <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center rounded-card text-xs font-semibold text-neutral-600">
          {type === "payment" && "N"}
          {type === "stock" && "Box"}
          {type === "redemption" && "OK"}
          {type === "booking" && "Bag"}
        </div>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-neutral-500 text-sm">{message}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="text-neutral-400 text-xs">{getTimeLabel(time)}</span>
        <div className="flex gap-2">
          {actions?.map((action) => (
            <button
              key={action.label}
              className="px-3 py-1 border border-neutral-300 rounded-button text-neutral-500"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
