import { FaNairaSign } from "react-icons/fa6";
import { formatCurrency } from "../../utils/currency";

function StatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase();
  const isDeposit = normalized === "completed" || normalized === "deposit";
  const isBooking = normalized.includes("book");
  const styles = isDeposit
    ? "bg-success/10 text-success"
    : isBooking
      ? "bg-error/10 text-error"
      : "bg-warning/10 text-warning";
  const label = isDeposit ? "Completed" : isBooking ? "Booked Item" : status;

  return (
    <span className={`text-xs px-2 py-1 rounded-full capitalize ${styles}`}>
      {label}
    </span>
  );
}

function ActivityItem({ type, date, amount, status }) {
  const safeAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  const isPositive = safeAmount > 0;

  return (
    <div className="flex justify-between items-center py-4 border-b border-neutral-200 last:border-none">
      <div className="flex items-center gap-3">
        <div className="bg-primary-50 text-primary-500 p-2 rounded-xl">
          <FaNairaSign size={14} />
        </div>

        <div>
          <p className="font-medium text-neutral-700">{type}</p>
          <p className="text-xs text-neutral-500">{date}</p>
        </div>
      </div>

      <div className="text-right">
        <p className={`font-semibold ${isPositive ? "text-success" : "text-error"}`}>
          {isPositive ? "+" : "-"}
          {formatCurrency(Math.abs(safeAmount))}
        </p>

        <StatusBadge status={status} />
      </div>
    </div>
  );
}

function RecentActivity({ activities = [] }) {
  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <div className="mb-4">
        <h3 className="text-h3">Recent Activity</h3>
        <p className="text-sm text-neutral-500">Your latest transactions</p>
      </div>

      {activities.map((item, index) => (
        <ActivityItem key={index} {...item} />
      ))}
    </div>
  );
}

export default RecentActivity;
