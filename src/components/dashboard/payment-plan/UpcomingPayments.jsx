import { FiCalendar, FiCheckCircle, FiClock } from "react-icons/fi";

const getStatusMeta = (status) => {
  const normalized = String(status || "upcoming").toLowerCase();

  if (normalized === "completed") {
    return {
      icon: <FiCheckCircle className="text-success" />,
      styles: "bg-success/10 text-success",
      label: "Completed",
    };
  }

  if (normalized === "failed") {
    return {
      icon: <FiClock className="text-error" />,
      styles: "bg-error/10 text-error",
      label: "Failed",
    };
  }

  return {
    icon: <FiCalendar className="text-warning" />,
    styles: "bg-warning/10 text-warning",
    label: "Upcoming",
  };
};

export default function UpcomingPayments({ upcoming = [] }) {
  return (
    <div className="bg-white shadow-card rounded-card p-6 space-y-4">
      <h2 className="text-h3">Upcoming Payments</h2>

      {upcoming.map((item, index) => {
        const meta = getStatusMeta(item.status);

        return (
          <div
            key={item.id || index}
            className="flex justify-between items-center border border-neutral-200 rounded-button p-4"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">{meta.icon}</div>
              <div>
                <p className="font-medium">{item.amount}</p>
                <p className="text-sm text-neutral-500">{item.date}</p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className={`text-xs px-2 py-1 rounded-full ${meta.styles}`}>
                {meta.label}
              </span>
              <p className="text-sm text-neutral-500">in {item.days} days</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
