const statusClassName = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "ready") return "bg-blue-100 text-blue-700";
  if (normalized === "completed") return "bg-green-100 text-green-700";
  if (normalized === "cancelled") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
};

export default function BookingRow({ booking }) {
  const total = Number(booking?.total || booking?.amount || 0);

  return (
    <tr className="border-b border-neutral-100 last:border-0">
      <td className="px-6 py-4">
        <p className="font-medium text-neutral-700">{booking?.customer || "-"}</p>
        <p className="text-xs text-neutral-500">{booking?.phone || "-"}</p>
      </td>
      <td className="px-6 py-4">
        <p className="text-neutral-700">{booking?.items || "-"}</p>
        <p className="text-xs text-neutral-500">{booking?.detail || "-"}</p>
      </td>
      <td className="px-6 py-4 text-center font-medium text-neutral-700">
        {`₦${total.toLocaleString("en-NG")}`}
      </td>
      <td className="px-6 py-4 text-center text-neutral-600">
        {booking?.pickup || "-"}
      </td>
      <td className="px-6 py-4 text-right">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusClassName(
            booking?.status,
          )}`}
        >
          {booking?.status || "Pending"}
        </span>
      </td>
    </tr>
  );
}
