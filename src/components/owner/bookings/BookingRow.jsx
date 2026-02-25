import { FiMoreVertical } from "react-icons/fi";
import ActionMenu from "../../ui/ActionMenu";

const statusClassName = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "ready" || normalized === "ready for pickup") {
    return "bg-blue-100 text-blue-700";
  }
  if (normalized === "completed") return "bg-green-100 text-green-700";
  if (normalized === "cancelled" || normalized === "canceled") {
    return "bg-red-100 text-red-700";
  }
  return "bg-yellow-100 text-yellow-700";
};

export default function BookingRow({ booking, onStatusChange, isUpdating }) {
  const total = Number(booking?.total || booking?.amount || 0);
  const normalizedStatus = String(booking?.status || "Pending").toLowerCase();
  const isPending = normalizedStatus === "pending";
  const canMarkCompleted = isPending;
  const canMarkCancelled = isPending;

  return (
    <tr className="border-b border-neutral-100 last:border-0">
      <td className="px-2.5 py-2.5 align-top">
        <p className="font-medium text-sm text-neutral-700 truncate">
          {booking?.customer || "-"}
        </p>
        <p className="text-[11px] text-neutral-500 truncate">{booking?.phone || "-"}</p>
      </td>
      <td className="px-2.5 py-2.5 align-top">
        <p className="text-sm text-neutral-700 truncate">{booking?.items || "-"}</p>
        <p className="text-[11px] text-neutral-500 truncate">
          {booking?.detail || "-"}
          {Number.isFinite(booking?.unitPrice)
            ? ` • ₦${Number(booking.unitPrice || 0).toLocaleString("en-NG")}`
            : ""}
        </p>
      </td>
      <td className="px-2.5 py-2.5 text-center align-top font-medium text-sm text-neutral-700 whitespace-nowrap">
        {`₦${total.toLocaleString("en-NG")}`}
      </td>
      <td className="px-2.5 py-2.5 text-center align-top text-[11px] text-neutral-600 whitespace-nowrap">
        {booking?.pickup || "-"}
      </td>
      <td className="px-2.5 py-2.5 text-right align-top">
        <span
          className={`inline-block px-2 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${statusClassName(
            booking?.status,
          )}`}
        >
          {booking?.status || "Pending"}
        </span>
      </td>
      <td className="px-2.5 py-2.5 text-right align-top whitespace-nowrap">
        <ActionMenu
          menuClassName="top-0 mt-0 right-full mr-2 sm:right-0 sm:top-full sm:mr-0 sm:mt-2"
          renderTrigger={(open) => (
            <button
              type="button"
              className={`inline-flex items-center justify-center w-7 h-7 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 ${
                open ? "bg-neutral-100" : "bg-white"
              }`}
            >
              <FiMoreVertical size={14} />
            </button>
          )}
        >
          {({ close }) => (
            <div className="flex flex-col w-28 rounded-md bg-white p-1.5 space-y-1.5 shadow-lg">
              <button
                type="button"
                disabled={!canMarkCompleted || isUpdating}
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
                disabled={!canMarkCancelled || isUpdating}
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
      </td>
    </tr>
  );
}
