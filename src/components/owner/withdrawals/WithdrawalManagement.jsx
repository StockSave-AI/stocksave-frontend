import { useMemo, useState } from "react";
import { FaNairaSign } from "react-icons/fa6";
import { FiDownload, FiRefreshCw, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../../utils/currency";
import { useOwnerWithdrawals } from "../hooks/useOwnerData";
import { useOwnerNotificationReconciliation } from "../hooks/useOwnerNotifications";

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const DATE_RANGE_OPTIONS = ["All", "Today", "Last 7 days", "Last 30 days"];
const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest first" },
  { value: "date_asc", label: "Oldest first" },
  { value: "amount_desc", label: "Highest amount" },
  { value: "amount_asc", label: "Lowest amount" },
  { value: "status_asc", label: "Status A-Z" },
];

const toRows = (payload) =>
  Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];

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
  if (normalized === "processing" || normalized === "pending")
    return "bg-warning/10 text-warning";
  if (normalized === "failed") return "bg-error/10 text-error";
  return "bg-neutral-100 text-neutral-600";
};

const parseDate = (value) => {
  const parsed = new Date(value || 0);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDateTime = (value) => {
  const parsed = parseDate(value);
  if (!parsed) return "-";
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const inDateRange = (value, dateRange) => {
  if (dateRange === "All") return true;
  const parsed = parseDate(value);
  if (!parsed) return false;
  const now = new Date();
  if (dateRange === "Today") {
    return (
      parsed.getFullYear() === now.getFullYear() &&
      parsed.getMonth() === now.getMonth() &&
      parsed.getDate() === now.getDate()
    );
  }
  const days = dateRange === "Last 7 days" ? 7 : 30;
  const min = new Date();
  min.setDate(now.getDate() - days);
  return parsed >= min;
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const downloadCsv = (rows) => {
  const headers = [
    "Customer Name",
    "Phone",
    "Amount",
    "Status",
    "Reference",
    "Created At",
  ];
  const csvRows = rows.map((item) => [
    toDisplayName(item),
    item?.phone || "",
    String(toNumber(item?.amount)),
    toStatusLabel(item?.status),
    item?.reference || "",
    formatDateTime(item?.created_at || item?.date),
  ]);

  const content = [headers, ...csvRows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell || "").replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");

  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `owner-withdrawals-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const DetailModal = ({ item, onClose, onOpenProfile }) => {
  if (!item) return null;
  const status = toStatusLabel(item?.status);
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-card shadow-card border border-neutral-200 p-5 sm:p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Withdrawal Details
            </h3>
            <p className="text-sm text-neutral-500">
              {formatDateTime(item?.created_at || item?.date)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-sm text-neutral-500 hover:text-neutral-800"
          >
            Close
          </button>
        </div>

        <div className="rounded-xl border border-error/20 bg-error/5 p-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wide">
            Withdrawn Amount
          </p>
          <p className="text-2xl font-bold text-error mt-1">
            -{formatCurrency(toNumber(item?.amount))}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <p>
            <span className="text-neutral-500">Customer:</span>{" "}
            <span className="font-medium text-neutral-900">
              {toDisplayName(item)}
            </span>
          </p>
          <p>
            <span className="text-neutral-500">Phone:</span>{" "}
            <span className="font-medium text-neutral-900">
              {item?.phone || "-"}
            </span>
          </p>
          <p>
            <span className="text-neutral-500">Status:</span>{" "}
            <span
              className={`inline-flex ml-1 text-[11px] px-2 py-1 rounded-full ${statusStyle(status)}`}
            >
              {status}
            </span>
          </p>
          <p>
            <span className="text-neutral-500">Transaction ID:</span>{" "}
            <span className="font-medium text-neutral-900">
              {item?.id || item?.transaction_id || "-"}
            </span>
          </p>
          <p className="sm:col-span-2 break-all">
            <span className="text-neutral-500">Reference:</span>{" "}
            <span className="font-medium text-neutral-900">
              {item?.reference || "-"}
            </span>
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-button border border-neutral-200 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            Close
          </button>
          <button
            onClick={onOpenProfile}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-button bg-primary-50 border border-primary-200 text-sm text-primary-700 hover:bg-primary-100"
          >
            <FiUser size={14} />
            View User Profile
          </button>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, valueClassName = "text-neutral-900" }) => (
  <div className="bg-white border border-neutral-200 rounded-card p-4 shadow-card">
    <p className="text-xs text-neutral-500">{label}</p>
    <p className={`text-lg font-semibold ${valueClassName}`}>{value}</p>
  </div>
);

const WithdrawalManagement = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);

  const processingQuery = useOwnerWithdrawals({
    status: "Processing",
    limit: 500,
  });
  const completedQuery = useOwnerWithdrawals({
    status: "Completed",
    limit: 500,
  });
  const failedQuery = useOwnerWithdrawals({ status: "Failed", limit: 500 });
  const reconciliationQuery = useOwnerNotificationReconciliation(true);

  const withdrawals = useMemo(() => {
    const merged = [
      ...toRows(processingQuery.data),
      ...toRows(completedQuery.data),
      ...toRows(failedQuery.data),
    ];
    const byId = new Map();
    merged.forEach((item) => {
      const key = String(item?.id ?? item?.transaction_id ?? "");
      if (!key) return;
      byId.set(key, {
        ...byId.get(key),
        ...item,
        status: item?.status || "Processing",
      });
    });
    return Array.from(byId.values());
  }, [completedQuery.data, failedQuery.data, processingQuery.data]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const min = minAmount === "" ? null : toNumber(minAmount);
    const max = maxAmount === "" ? null : toNumber(maxAmount);

    const base = withdrawals.filter((item) => {
      if (!inDateRange(item?.created_at || item?.date, dateRange)) return false;

      const amount = toNumber(item?.amount);
      if (min !== null && amount < min) return false;
      if (max !== null && amount > max) return false;

      if (!term) return true;
      const name = toDisplayName(item).toLowerCase();
      const phone = String(item?.phone || "").toLowerCase();
      const reference = String(item?.reference || "").toLowerCase();
      return (
        name.includes(term) || phone.includes(term) || reference.includes(term)
      );
    });

    return [...base].sort((a, b) => {
      const aAmount = toNumber(a?.amount);
      const bAmount = toNumber(b?.amount);
      const aDate = parseDate(a?.created_at || a?.date)?.getTime() || 0;
      const bDate = parseDate(b?.created_at || b?.date)?.getTime() || 0;
      const aStatus = String(a?.status || "");
      const bStatus = String(b?.status || "");

      if (sortBy === "amount_desc") return bAmount - aAmount;
      if (sortBy === "amount_asc") return aAmount - bAmount;
      if (sortBy === "date_asc") return aDate - bDate;
      if (sortBy === "status_asc") return aStatus.localeCompare(bStatus);
      return bDate - aDate;
    });
  }, [dateRange, maxAmount, minAmount, searchTerm, sortBy, withdrawals]);

  const summary = useMemo(() => {
    const totalCount = withdrawals.length;
    const totalAmount = withdrawals.reduce(
      (sum, item) => sum + toNumber(item?.amount),
      0,
    );
    const completedCount = withdrawals.filter(
      (item) => String(item?.status || "").toLowerCase() === "completed",
    ).length;
    const processingCount = withdrawals.filter((item) => {
      const status = String(item?.status || "").toLowerCase();
      return status === "processing" || status === "pending";
    }).length;
    const failedCount = withdrawals.filter(
      (item) => String(item?.status || "").toLowerCase() === "failed",
    ).length;
    return {
      totalCount,
      totalAmount,
      completedCount,
      processingCount,
      failedCount,
    };
  }, [withdrawals]);

  const reconciliation =
    reconciliationQuery.data?.data || reconciliationQuery.data || null;

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [currentPage, filtered, pageSize]);

  const isLoading =
    processingQuery.isLoading ||
    completedQuery.isLoading ||
    failedQuery.isLoading;
  const isError =
    processingQuery.isError && completedQuery.isError && failedQuery.isError;

  const retry = () => {
    processingQuery.refetch();
    completedQuery.refetch();
    failedQuery.refetch();
  };

  return (
    <div className="min-h-screen bg-neutral-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">
              Withdrawal History
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              Read-only owner monitoring view.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={retry}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-button border border-neutral-200 text-sm text-neutral-700 bg-white hover:bg-neutral-50"
            >
              <FiRefreshCw size={14} />
              Refresh
            </button>
            <button
              onClick={() => downloadCsv(filtered)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-button border border-neutral-200 text-sm text-neutral-700 bg-white hover:bg-neutral-50"
            >
              <FiDownload size={14} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SummaryCard label="Total Count" value={summary.totalCount} />
          <SummaryCard
            label="Withdrawn Amount"
            value={formatCurrency(summary.totalAmount)}
            valueClassName="text-error"
          />
        </div>

        <div className="bg-white border border-neutral-200 rounded-card p-4 shadow-card">
          <p className="text-sm font-medium text-neutral-700 mb-2">
            Reconciliation
          </p>
          <p className="text-xs text-neutral-500">
            Net balance: {formatCurrency(toNumber(reconciliation?.net_balance))}
          </p>
          <p
            className={`text-xs mt-1 ${
              reconciliation?.is_balanced ? "text-success" : "text-error"
            }`}
          >
            {reconciliation?.is_balanced ? "Balanced" : "Not Balanced"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-card shadow-card border border-neutral-200 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-neutral-500">Date range</label>
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setPage(1);
              }}
              className="mt-1 w-full px-3 py-2 rounded-button border border-neutral-300 text-sm"
            >
              {DATE_RANGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-neutral-500">Search</label>
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Name, phone, reference"
              className="mt-1 w-full px-3 py-2 rounded-button border border-neutral-300 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-500">Sort</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="mt-1 w-full px-3 py-2 rounded-button border border-neutral-300 text-sm"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-neutral-500">Min Amount</label>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => {
                setMinAmount(e.target.value);
                setPage(1);
              }}
              placeholder="0"
              className="mt-1 w-full px-3 py-2 rounded-button border border-neutral-300 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-500">Max Amount</label>
            <input
              type="number"
              value={maxAmount}
              onChange={(e) => {
                setMaxAmount(e.target.value);
                setPage(1);
              }}
              placeholder="100000"
              className="mt-1 w-full px-3 py-2 rounded-button border border-neutral-300 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-500">Page size</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="mt-1 w-full px-3 py-2 rounded-button border border-neutral-300 text-sm"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <section className="bg-white p-6 rounded-card shadow-card border border-neutral-200">
          <h3 className="text-neutral-800 font-semibold mb-4">
            Customer Withdrawals
          </h3>

          {isLoading ? (
            <div className="h-28 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full border-2 border-neutral-200 border-t-primary-500 animate-spin" />
            </div>
          ) : null}

          {!isLoading && isError ? (
            <div className="h-28 flex items-center justify-center flex-col gap-3">
              <p className="text-sm text-error">Failed to load withdrawals.</p>
              <button
                onClick={retry}
                className="px-3 py-2 rounded-button border border-neutral-200 text-sm text-neutral-700"
              >
                Retry
              </button>
            </div>
          ) : null}

          {!isLoading && !isError && filtered.length === 0 ? (
            <div className="h-28 flex items-center justify-center flex-col gap-3">
              <p className="text-sm text-neutral-500">
                No withdrawals found for current filters.
              </p>
              <button
                onClick={retry}
                className="px-3 py-2 rounded-button border border-neutral-200 text-sm text-neutral-700"
              >
                Refresh
              </button>
            </div>
          ) : null}

          {!isLoading && !isError && filtered.length > 0 ? (
            <div className="space-y-3">
              {paginated.map((item, idx) => {
                const status = toStatusLabel(item?.status);
                return (
                  <div
                    key={item?.id || item?.transaction_id || idx}
                    className="border border-neutral-100 rounded-xl p-3 md:p-4 bg-neutral-50/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 shrink-0 bg-error/10 rounded-lg flex items-center justify-center text-error">
                          <FaNairaSign />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-neutral-900 truncate">
                            {toDisplayName(item)}
                          </p>
                          <p className="text-xs text-neutral-500 truncate">
                            {item?.phone || "No phone"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-error">
                          {formatCurrency(toNumber(item?.amount))}
                        </p>
                        <span
                          className={`inline-flex mt-1 text-[11px] px-2 py-1 rounded-full ${statusStyle(
                            status,
                          )}`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs items-center">
                      <p className="text-neutral-400 break-all">
                        <span className="text-neutral-500 font-medium">
                          Ref:
                        </span>{" "}
                        {item?.reference || "-"}
                      </p>
                      <p className="text-neutral-400 sm:text-center">
                        {formatDateTime(item?.created_at || item?.date)}
                      </p>
                    </div>

                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-primary-600 text-xs font-semibold hover:text-primary-700"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {!isLoading && !isError && filtered.length > pageSize ? (
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
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md border border-neutral-200 text-neutral-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </div>

      <DetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onOpenProfile={() => {
          setSelectedItem(null);
          navigate("/owner/users");
        }}
      />
    </div>
  );
};

export default WithdrawalManagement;
