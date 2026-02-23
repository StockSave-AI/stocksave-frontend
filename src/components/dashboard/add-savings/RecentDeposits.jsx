import { FiTrendingUp } from "react-icons/fi";
import ActivityItem from "../../ui/ActivityItem";

const getStatusColor = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "completed") return "text-success";
  if (normalized === "pending") return "text-yellow-500";
  if (normalized === "withdrawal") return "text-error";
  return "text-neutral-500";
};

export default function RecentDeposits({
  deposits = [],
  isLoading = false,
  isError = false,
}) {
  return (
    <div className="bg-white rounded-card shadow-card p-6 border border-neutral-200 space-y-4">
      <h3 className="font-semibold text-neutral-700">Recent Deposits</h3>

      {isLoading ? (
        <div className="h-24 flex items-center justify-center">
          <div className="h-7 w-7 rounded-full border-2 border-neutral-200 border-t-primary-500 animate-spin" />
        </div>
      ) : null}

      {!isLoading && isError ? (
        <p className="text-sm text-error">Failed to load savings history.</p>
      ) : null}

      {!isLoading && !isError && deposits.length === 0 ? (
        <p className="text-sm text-neutral-500">No savings history yet.</p>
      ) : null}

      {!isLoading && !isError && deposits.length > 0 ? (
        <div className="space-y-3">
          {deposits.map((item, index) => (
            <ActivityItem
              key={item.id || index}
              icon={<FiTrendingUp size={18} />}
              amount={item.amount}
              source={item.source}
              status={item.status}
              statusColor={getStatusColor(item.status)}
              date={item.date}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
