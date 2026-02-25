import { useMemo, useState } from "react";
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

const normalizeStatus = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "complete") return "completed";
  if (normalized === "canceled") return "cancelled";
  return normalized || "pending";
};

const RecentDeposits = ({
  deposits = [],
  isLoading = false,
  isError = false,
  onMarkCompleted,
  isUpdating = false,
}) => {
  const PAGE_SIZE = 5;
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const filteredDeposits = useMemo(() => {
    if (statusFilter === "all") return deposits;
    return deposits.filter(
      (item) => normalizeStatus(item?.status) === normalizeStatus(statusFilter),
    );
  }, [deposits, statusFilter]);
  const totalPages = Math.max(1, Math.ceil(filteredDeposits.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedDeposits = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredDeposits.slice(start, start + PAGE_SIZE);
  }, [filteredDeposits, currentPage]);

  return (
    <section className="bg-white p-6 rounded-card shadow-card border border-neutral-200">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-neutral-800 font-semibold">Recent Cash Deposits</h3>
        <div className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 p-1">
          {["all", "pending", "completed"].map((filter) => {
            const active = statusFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  setStatusFilter(filter);
                  setPage(1);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  active
                    ? "bg-primary-50 text-primary-700 border border-primary-200"
                    : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

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

      {!isLoading && !isError && filteredDeposits.length === 0 ? (
        <div className="h-28 flex items-center justify-center text-sm text-neutral-500">
          No deposits found for this filter.
        </div>
      ) : null}

      {!isLoading && !isError && filteredDeposits.length > 0 ? (
        <div className="divide-y divide-neutral-100">
          {paginatedDeposits.map((item, idx) => {
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
                    <div className="flex items-center justify-end">
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

      {!isLoading && !isError && filteredDeposits.length > PAGE_SIZE ? (
        <div className="pt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-neutral-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-semibold rounded-md border border-neutral-200 text-neutral-700 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-semibold rounded-md border border-neutral-200 text-neutral-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default RecentDeposits;
