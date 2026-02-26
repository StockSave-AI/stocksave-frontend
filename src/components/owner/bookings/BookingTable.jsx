import { FiMoreVertical } from "react-icons/fi";
import ActionMenu from "../../ui/ActionMenu";
import BookingRow from "./BookingRow";

const statusClassName = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "completed") return "bg-green-100 text-green-700";
  if (normalized === "cancelled" || normalized === "canceled") {
    return "bg-red-100 text-red-700";
  }
  return "bg-yellow-100 text-yellow-700";
};

const BookingMobileCard = ({ booking, onStatusChange, isUpdating }) => {
  const total = Number(booking?.total || booking?.amount || 0);
  const normalizedStatus = String(booking?.status || "Pending").toLowerCase();
  const isPending = normalizedStatus === "pending";

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-sm text-neutral-800 truncate">{booking?.customer || "-"}</p>
          <p className="text-[11px] text-neutral-500 truncate">{booking?.phone || "-"}</p>
        </div>
        <ActionMenu
          menuClassName="top-0 mt-0 right-full mr-2"
          renderTrigger={(open) => (
            <button
              type="button"
              className={`inline-flex items-center justify-center w-7 h-7 rounded-full border border-neutral-200 text-neutral-600 ${
                open ? "bg-neutral-100" : "bg-white"
              }`}
            >
              <FiMoreVertical size={14} />
            </button>
          )}
        >
          {({ close }) => (
            <div className="w-full rounded-md bg-white p-1 space-y-1">
              <button
                type="button"
                disabled={!isPending || isUpdating}
                onClick={() => {
                  onStatusChange?.(booking.id, "Completed");
                  close();
                }}
                className="w-full rounded-md bg-green-600 text-white text-[11px] font-semibold py-1 disabled:opacity-50"
              >
                Complete
              </button>
              <button
                type="button"
                disabled={!isPending || isUpdating}
                onClick={() => {
                  onStatusChange?.(booking.id, "Cancelled");
                  close();
                }}
                className="w-full rounded-md border border-red-200 bg-white text-red-600 text-[11px] font-semibold py-1 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          )}
        </ActionMenu>
      </div>

      <div className="mt-2 min-w-0">
        <p className="text-sm text-neutral-700 truncate">{booking?.items || "-"}</p>
        <p className="text-[11px] text-neutral-500 truncate">{booking?.detail || "-"}</p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-lg bg-neutral-50 p-2">
          <p className="text-neutral-500">Total</p>
          <p className="font-semibold text-neutral-800">₦{total.toLocaleString("en-NG")}</p>
        </div>
        <div className="rounded-lg bg-neutral-50 p-2">
          <p className="text-neutral-500">Pickup</p>
          <p className="font-semibold text-neutral-800 truncate">{booking?.pickup || "-"}</p>
        </div>
      </div>

      <div className="mt-2">
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusClassName(
            booking?.status,
          )}`}
        >
          {booking?.status || "Pending"}
        </span>
      </div>
    </div>
  );
};

const BookingTable = ({
  bookings = [],
  isLoading,
  isError,
  emptyMessage,
  onStatusChange,
  updatingId,
}) => {
  return (
    <div className="bg-white rounded-card shadow-card border border-neutral-100 overflow-visible">
      <div className="min-[1000px]:hidden p-3 space-y-3">
        {isLoading && <p className="px-2 py-6 text-sm text-neutral-500">Loading bookings...</p>}
        {isError && !isLoading && (
          <p className="px-2 py-6 text-sm text-error">Failed to load bookings.</p>
        )}
        {!isLoading && !isError && bookings.length === 0 && (
          <p className="px-2 py-8 text-sm font-medium text-neutral-600">
            {emptyMessage || "No bookings available."}
          </p>
        )}
        {!isLoading &&
          !isError &&
          bookings.map((booking, index) => (
            <BookingMobileCard
              key={booking.id || index}
              booking={booking}
              onStatusChange={onStatusChange}
              isUpdating={updatingId === booking.id}
            />
          ))}
      </div>

      <div className="max-[999px]:hidden w-full">
        <table className="w-full table-fixed text-left">
          <thead className="border-b border-neutral-100">
            <tr>
              <th className="w-[18%] px-2.5 py-2.5 text-[11px] font-semibold text-neutral-600">Customer</th>
              <th className="w-[30%] px-2.5 py-2.5 text-[11px] font-semibold text-neutral-600">Items</th>
              <th className="w-[11%] px-2.5 py-2.5 text-[11px] font-semibold text-neutral-600 text-center">Total</th>
              <th className="w-[15%] px-2.5 py-2.5 text-[11px] font-semibold text-neutral-600 text-center">Pickup</th>
              <th className="w-[10%] px-2.5 py-2.5 text-[11px] font-semibold text-neutral-600 text-right">Status</th>
              <th className="w-[16%] px-2.5 py-2.5 text-[11px] font-semibold text-neutral-600 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td className="px-6 py-6 text-sm text-neutral-500" colSpan={6}>
                  Loading bookings...
                </td>
              </tr>
            )}
            {isError && !isLoading && (
              <tr>
                <td className="px-6 py-6 text-sm text-error" colSpan={6}>
                  Failed to load bookings.
                </td>
              </tr>
            )}
            {!isLoading && !isError && bookings.length === 0 && (
              <tr>
                <td className="px-6 py-8 text-base font-medium text-neutral-600" colSpan={6}>
                  {emptyMessage || "No bookings available."}
                </td>
              </tr>
            )}
            {!isLoading &&
              !isError &&
              bookings.map((booking, index) => (
                <BookingRow
                  key={booking.id || index}
                  booking={booking}
                  onStatusChange={onStatusChange}
                  isUpdating={updatingId === booking.id}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;
