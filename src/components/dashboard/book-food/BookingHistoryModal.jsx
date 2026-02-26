import { FiCalendar, FiClock, FiImage, FiSearch, FiX } from "react-icons/fi";
import { formatCurrency } from "../../../utils/currency";
import { useMemo, useState } from "react";

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.bookings)) return payload.bookings;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const statusPill = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "completed") return "bg-emerald-100 text-emerald-700";
  if (normalized === "cancelled" || normalized === "canceled") {
    return "bg-red-100 text-red-700";
  }
  if (normalized.includes("ready")) return "bg-blue-100 text-blue-700";
  return "bg-amber-100 text-amber-700";
};

const normalizeStatus = (value) => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  if (normalized === "canceled") return "cancelled";
  return normalized || "pending";
};

const normalizeBooking = (item, index) => {
  const image =
    item?.image ||
    item?.image_url ||
    item?.product_image ||
    item?.photo ||
    item?.thumbnail ||
    null;
  const name =
    item?.product_name ||
    item?.inventory_name ||
    item?.item_name ||
    item?.name ||
    "Booked Item";
  const size = item?.size_label || item?.variant_name || "";
  const qty = toNumber(item?.slots_booked ?? item?.quantity ?? item?.qty ?? 0);
  const amount = toNumber(item?.total_cost ?? item?.total ?? item?.amount ?? 0);
  const date = item?.created_at || item?.booking_date || item?.date || "";
  const status = item?.status || "Pending";
  return {
    id: item?.id || `booking-${index}`,
    image,
    name,
    size,
    qty,
    amount,
    status,
    date,
  };
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const CLEARED_BOOKINGS_KEY = "customer_booking_history_cleared_v1";

const getClearedBookingMap = () => {
  try {
    const raw = localStorage.getItem(CLEARED_BOOKINGS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const saveClearedBookingMap = (value) => {
  localStorage.setItem(CLEARED_BOOKINGS_KEY, JSON.stringify(value));
};

export default function BookingHistoryModal({ isOpen, onClose, query }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [clearedMap, setClearedMap] = useState(() => getClearedBookingMap());
  const raw = toList(query?.data?.data || query?.data || []);
  const bookings = raw.map((item, index) => normalizeBooking(item, index));
  const visibleBookings = useMemo(
    () => bookings.filter((item) => !clearedMap[String(item.id)]),
    [bookings, clearedMap],
  );
  const filteredBookings = useMemo(() => {
    const byStatus =
      activeFilter === "all"
        ? visibleBookings
        : visibleBookings.filter(
            (item) =>
              normalizeStatus(item.status) === normalizeStatus(activeFilter),
          );
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return byStatus;
    return byStatus.filter((item) => {
      const name = String(item?.name || "").toLowerCase();
      const size = String(item?.size || "").toLowerCase();
      const status = String(item?.status || "").toLowerCase();
      const ref = String(item?.id || "").toLowerCase();
      return (
        name.includes(needle) ||
        size.includes(needle) ||
        status.includes(needle) ||
        ref.includes(needle)
      );
    });
  }, [activeFilter, searchTerm, visibleBookings]);
  const totalBooked = visibleBookings.length;
  const totalSpent = visibleBookings.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const filters = ["all", "pending", "completed", "cancelled"];
  const clearHistory = () => {
    if (visibleBookings.length === 0) return;
    const next = { ...clearedMap };
    visibleBookings.forEach((item) => {
      next[String(item.id)] = true;
    });
    setClearedMap(next);
    saveClearedBookingMap(next);
  };
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="bg-white w-full max-w-5xl rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 sm:px-6 py-4 border-b border-neutral-100 flex items-start justify-between gap-3 bg-gradient-to-r from-neutral-50 to-white">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-neutral-900">
              My Booking History
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Review your past and active food bookings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-button border border-neutral-200 text-xs sm:text-sm text-neutral-700 hover:bg-neutral-50"
            >
              Clear History
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-3 grid grid-cols-2 gap-3 border-b border-neutral-100 bg-neutral-50/60">
          <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2">
            <p className="text-[11px] text-neutral-500">Total Bookings</p>
            <p className="text-base sm:text-lg font-semibold text-neutral-900">
              {totalBooked}
            </p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white  px-3 py-2">
            <p className="text-[11px] text-neutral-500">Total Spent</p>
            <p className="text-base sm:text-lg font-semibold text-red-700">
              {formatCurrency(totalSpent)}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-4 rounded-xl border border-neutral-200 bg-white p-3 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                size={14}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by item, status, or reference..."
                className="w-full pl-9 pr-3 py-2 rounded-button border border-neutral-200 text-sm"
              />
            </div>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="sm:w-44 px-3 py-2 rounded-button border border-neutral-200 text-sm text-neutral-700 bg-white"
            >
              {filters.map((filter) => {
                const label = filter.charAt(0).toUpperCase() + filter.slice(1);
                return (
                  <option key={filter} value={filter}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          {query?.isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <div className="h-9 w-9 rounded-full border-2 border-neutral-200 border-t-primary-500 animate-spin" />
            </div>
          ) : null}

          {!query?.isLoading && query?.isError ? (
            <div className="h-40 flex items-center justify-center text-sm text-error">
              Failed to load booking history.
            </div>
          ) : null}

          {!query?.isLoading &&
          !query?.isError &&
          filteredBookings.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-sm text-neutral-500 gap-2">
              <FiCalendar size={20} />
              No bookings yet.
            </div>
          ) : null}

          {!query?.isLoading &&
          !query?.isError &&
          filteredBookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {filteredBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden"
                >
                  <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="w-full sm:w-24 h-24 sm:h-20 shrink-0 rounded-xl bg-neutral-100 overflow-hidden">
                      {booking.image ? (
                        <img
                          src={booking.image}
                          alt={booking.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-neutral-400">
                          <FiImage size={22} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-neutral-900 truncate">
                            {booking.name}
                          </p>
                          <p className="text-xs text-neutral-500 truncate">
                            {booking.size || "Standard size"} • Ref #
                            {booking.id}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-[11px] font-semibold ${statusPill(booking.status)}`}
                        >
                          {normalizeStatus(booking.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="rounded-lg bg-neutral-50 border border-neutral-200 px-2.5 py-2">
                          <p className="text-neutral-500">Qty</p>
                          <p className="font-semibold text-neutral-900">
                            {booking.qty}
                          </p>
                        </div>
                        <div className="rounded-lg bg-neutral-50 border border-neutral-200 px-2.5 py-2">
                          <p className="text-neutral-500">Amount</p>
                          <p className="font-semibold text-neutral-900">
                            {formatCurrency(booking.amount)}
                          </p>
                        </div>
                        <div className="rounded-lg bg-neutral-50 border border-neutral-200 px-2.5 py-2">
                          <p className="text-neutral-500">Date</p>
                          <p className="font-semibold text-neutral-900 truncate">
                            {formatDateTime(booking.date)}
                          </p>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500">
                        <FiClock size={12} />
                        {formatDateTime(booking.date)}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
