export const currency = (value) =>
  Number(value || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  });

export const compactNaira = (value) => {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "N0";
  if (Math.abs(num) >= 1_000_000) return `N${(num / 1_000_000).toFixed(1)}m`;
  if (Math.abs(num) >= 1_000) return `N${(num / 1_000).toFixed(0)}k`;
  return `N${num.toFixed(0)}`;
};

export const toArray = (payload) => {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.by_booking_count)) return payload.by_booking_count;
  return [];
};

export const formatDateTime = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const exportCsv = ({ filename, headers, rows }) => {
  if (!Array.isArray(rows) || rows.length === 0) return;
  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
