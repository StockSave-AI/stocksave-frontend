import { FaNairaSign } from "react-icons/fa6";
import { formatCurrency } from "../../../utils/currency";
import { formatDisplayDate } from "../../../utils/date";

const toDisplayName = (item) => {
  const fullName = `${item?.first_name || ""} ${item?.last_name || ""}`.trim();
  return fullName || item?.name || "Unknown User";
};

const toStatusLabel = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (!normalized) return "Unknown";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const statusStyle = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "completed") return "bg-success/10 text-success";
  if (normalized === "pending") return "bg-warning/10 text-warning";
  if (normalized === "failed") return "bg-error/10 text-error";
  return "bg-neutral-100 text-neutral-600";
};

const RecentDeposits = ({
  deposits = [],
  isLoading = false,
  isError = false,
  onMarkCompleted,
  onGenerateCode,
  isUpdating = false,
  isGeneratingCode = false,
}) => {
  return (
    <section className="bg-white p-6 rounded-card shadow-card border border-neutral-200">
      <h3 className="text-neutral-800 font-semibold mb-4">Recent Cash Deposits</h3>

      {isLoading ? (
        <div className="h-28 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-neutral-200 border-t-primary-500 animate-spin" />
        </div>
      ) : null}

      {!isLoading && isError ? (
        <div className="h-28 flex items-center justify-center text-sm text-error">
          Failed to load recent deposits.
        </div>
      ) : null}

      {!isLoading && !isError && deposits.length === 0 ? (
        <div className="h-28 flex items-center justify-center text-sm text-neutral-500">
          No pending cash deposits right now.
        </div>
      ) : null}

      {!isLoading && !isError && deposits.length > 0 ? (
        <div className="divide-y divide-neutral-100">
          {deposits.map((item, idx) => {
            const status = toStatusLabel(item?.status);
            const isPending = String(item?.status || "").toLowerCase() === "pending";

            return (
              <div key={item?.id || idx} className="flex justify-between items-center py-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <FaNairaSign />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">{toDisplayName(item)}</p>
                    <p className="text-xs text-neutral-400">
                      {formatDisplayDate(item?.created_at || item?.date, "-")}
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <p className="font-bold text-secondary-500">
                    {formatCurrency(Number(item?.amount || 0))}
                  </p>
                  <span className={`text-[11px] px-2 py-1 rounded-full ${statusStyle(status)}`}>
                    {status}
                  </span>
                  {isPending ? (
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        disabled={isGeneratingCode}
                        onClick={() => onGenerateCode?.(item)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                      >
                        Generate Code
                      </button>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => onMarkCompleted?.(item)}
                        className="text-xs font-semibold text-primary-600 hover:text-primary-700 disabled:opacity-50"
                      >
                        Mark Completed
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
};

export default RecentDeposits;
