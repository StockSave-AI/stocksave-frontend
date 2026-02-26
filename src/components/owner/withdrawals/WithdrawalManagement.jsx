import { useState } from "react";
import { FaNairaSign } from "react-icons/fa6";
import { formatCurrency } from "../../../utils/currency";
import { formatDisplayDate } from "../../../utils/date";
import {
  useOwnerWithdrawals,
  useCompleteOwnerWithdrawal,
} from "../hooks/useOwnerData";

const toDisplayName = (item) => {
  const fullName = `${item?.first_name || ""} ${item?.last_name || ""}`.trim();
  return fullName || item?.name || item?.customer_name || "Unknown User";
};

const toStatusLabel = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (!normalized) return "Unknown";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const statusStyle = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "completed") return "bg-success/10 text-success";
  if (normalized === "processing") return "bg-warning/10 text-warning";
  if (normalized === "pending") return "bg-warning/10 text-warning";
  if (normalized === "failed") return "bg-error/10 text-error";
  return "bg-neutral-100 text-neutral-600";
};

const RecentWithdrawals = ({
  withdrawals = [],
  isLoading = false,
  isError = false,
  onMarkCompleted,
  isUpdating = false,
}) => {
  return (
    <section className="bg-white p-6 rounded-card shadow-card border border-neutral-200">
      <h3 className="text-neutral-800 font-semibold mb-4">
        Pending Withdrawals
      </h3>

      {isLoading ? (
        <div className="h-28 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-neutral-200 border-t-primary-500 animate-spin" />
        </div>
      ) : null}

      {!isLoading && isError ? (
        <div className="h-28 flex items-center justify-center text-sm text-error">
          Failed to load pending withdrawals.
        </div>
      ) : null}

      {!isLoading && !isError && withdrawals.length === 0 ? (
        <div className="h-28 flex items-center justify-center text-sm text-neutral-500">
          No pending withdrawals right now.
        </div>
      ) : null}

      {!isLoading && !isError && withdrawals.length > 0 ? (
        <div className="divide-y divide-neutral-100">
          {withdrawals.map((item, idx) => {
            const status = toStatusLabel(item?.status);
            const isProcessing =
              String(item?.status || "").toLowerCase() === "processing";

            return (
              <div
                key={item?.id || idx}
                className="flex justify-between items-center py-4 gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center text-error">
                    <FaNairaSign />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {toDisplayName(item)}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {formatDisplayDate(item?.created_at || item?.date, "-")}
                    </p>
                    {item?.reference && (
                      <p className="text-xs text-neutral-500">
                        Ref: {item.reference}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <p className="font-bold text-error">
                    {formatCurrency(Number(item?.amount || 0))}
                  </p>
                  <span
                    className={`text-[11px] px-2 py-1 rounded-full ${statusStyle(status)}`}
                  >
                    {status}
                  </span>
                  {isProcessing ? (
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => onMarkCompleted?.(item)}
                        className="text-xs font-semibold text-primary-600 hover:text-primary-700 disabled:opacity-50"
                      >
                        {isUpdating ? "Approving..." : "Approve & Mark Completed"}
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

const WithdrawalManagement = () => {
  const [statusFilter, setStatusFilter] = useState("Processing");
  const withdrawalsQuery = useOwnerWithdrawals({ status: statusFilter });
  const completeMutation = useCompleteOwnerWithdrawal();

  const withdrawalsRaw = Array.isArray(withdrawalsQuery.data?.data)
    ? withdrawalsQuery.data.data
    : Array.isArray(withdrawalsQuery.data)
      ? withdrawalsQuery.data
      : [];

  const withdrawals = withdrawalsRaw.map((item) => ({
    ...item,
    status: item.status || "Processing",
  }));

  const handleMarkCompleted = async (item) => {
    const transactionId = item?.transactionId ?? item?.transaction_id ?? item?.id;
    if (!transactionId) return;
    await completeMutation.mutateAsync({ transactionId });
  };

  return (
    <div className="min-h-screen bg-neutral-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">
              Withdrawal Management
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              Manage customer withdrawal requests pending bank confirmation
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-card shadow-card border border-neutral-200">
          <label className="text-sm font-medium text-neutral-700 mr-3">
            Filter by Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mt-2 block w-full md:w-auto px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <RecentWithdrawals
          withdrawals={withdrawals}
          isLoading={withdrawalsQuery.isLoading}
          isError={withdrawalsQuery.isError}
          onMarkCompleted={handleMarkCompleted}
          isUpdating={completeMutation.isPending}
        />
      </div>
    </div>
  );
};

export default WithdrawalManagement;
