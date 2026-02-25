import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

const buildData = (stats = {}) => {
  const deposits =
    stats.total_deposits ??
    stats.totalDeposits ??
    stats.totalSavings ??
    stats.total_savings ??
    0;
  const withdrawals = stats.total_withdrawals ?? stats.totalWithdrawals ?? 0;
  const bookings = stats.total_bookings ?? stats.totalBookings ?? 0;
  const pending =
    stats.pending_transactions ??
    stats.pendingTransactions ??
    stats.pendingCashCount ??
    0;

  return [
    { label: "Deposits", value: Number(deposits) || 0, color: "#0ea5e9" },
    { label: "Withdrawals", value: Number(withdrawals) || 0, color: "#f97316" },
    { label: "Bookings", value: Number(bookings) || 0, color: "#22c55e" },
    { label: "Pending Tx", value: Number(pending) || 0, color: "#eab308" },
  ];
};

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  });

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const { value, payload: row } = payload[0];
  const isMoney = ["Deposits", "Withdrawals"].includes(label);
  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-sm px-3 py-2 text-xs text-neutral-700">
      <p className="font-semibold">{label}</p>
      <p>{isMoney ? formatCurrency(value) : value.toLocaleString()}</p>
      {row?.detail ? <p className="text-neutral-500">{row.detail}</p> : null}
    </div>
  );
};

export default function OwnerStatsChart({ stats, loading }) {
  const data = buildData(stats);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-neutral-800">Platform Overview</h3>
        {loading ? <span className="text-xs text-neutral-500">Loading...</span> : null}
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.label}-${index}`}
                  fill={entry.color}
                  radius={[6, 6, 0, 0]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
