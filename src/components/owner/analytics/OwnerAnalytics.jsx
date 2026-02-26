import { useMemo } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useAnalyticsDisputePatterns,
  useAnalyticsFinancialSummary,
  useAnalyticsMonthlyTrend,
  useAnalyticsMostDemanded,
  useAnalyticsOverview,
  useAnalyticsStockTurnover,
  useAnalyticsWeeklyTrend,
} from "../hooks/useOwnerAnalytics";

const currency = (value) =>
  Number(value || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  });

const compactNaira = (value) => {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "₦0";
  if (Math.abs(num) >= 1_000_000) return `₦${(num / 1_000_000).toFixed(1)}m`;
  if (Math.abs(num) >= 1_000) return `₦${(num / 1_000).toFixed(0)}k`;
  return `₦${num.toFixed(0)}`;
};

const toArray = (payload) => {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.by_booking_count)) return payload.by_booking_count;
  return [];
};

const ChartCard = ({ title, children, loading }) => (
  <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
      {loading ? <span className="text-xs text-neutral-500">Loading...</span> : null}
    </div>
    {children}
  </div>
);

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-neutral-200 bg-white/95 backdrop-blur-sm shadow-lg px-3 py-2 min-w-[170px]">
      <p className="text-xs font-semibold text-neutral-700 mb-1">{label}</p>
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={`${item.dataKey}-${item.value}`} className="flex items-center justify-between gap-3">
            <span className="text-xs text-neutral-600">{item.name || item.dataKey}</span>
            <span className="text-xs font-semibold text-neutral-900">{currency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SectionTable = ({ title, columns, rows, emptyText = "No data available." }) => (
  <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
    <h3 className="text-sm font-semibold text-neutral-800 mb-3">{title}</h3>
    {rows.length === 0 ? (
      <p className="text-sm text-neutral-500">{emptyText}</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-500 border-b border-neutral-200">
              {columns.map((column) => (
                <th key={column} className="py-2 pr-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={`row-${index}`}
                className="border-b border-neutral-100 last:border-0 text-neutral-700"
              >
                {row.map((cell, cellIndex) => (
                  <td key={`cell-${index}-${cellIndex}`} className="py-2 pr-3 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default function OwnerAnalytics() {
  const financialSummaryQuery = useAnalyticsFinancialSummary();
  const overviewQuery = useAnalyticsOverview();
  const monthlyTrendQuery = useAnalyticsMonthlyTrend();
  const weeklyTrendQuery = useAnalyticsWeeklyTrend();
  const stockTurnoverQuery = useAnalyticsStockTurnover();
  const mostDemandedQuery = useAnalyticsMostDemanded();
  const disputesQuery = useAnalyticsDisputePatterns();

  const financial = useMemo(
    () =>
      financialSummaryQuery.data?.data ||
      financialSummaryQuery.data ||
      {},
    [financialSummaryQuery.data],
  );
  const overview = useMemo(
    () => overviewQuery.data?.data || overviewQuery.data || {},
    [overviewQuery.data],
  );
  const monthly = useMemo(() => toArray(monthlyTrendQuery.data), [monthlyTrendQuery.data]);
  const weekly = useMemo(() => toArray(weeklyTrendQuery.data), [weeklyTrendQuery.data]);
  const turnover = useMemo(() => toArray(stockTurnoverQuery.data), [stockTurnoverQuery.data]);
  const mostDemandedPayload = useMemo(
    () => mostDemandedQuery.data?.data || mostDemandedQuery.data || {},
    [mostDemandedQuery.data],
  );
  const mostDemandedByBookings = useMemo(
    () =>
      Array.isArray(mostDemandedPayload?.by_booking_count)
        ? mostDemandedPayload.by_booking_count
        : [],
    [mostDemandedPayload],
  );
  const mostDemandedByHolds = useMemo(
    () =>
      Array.isArray(mostDemandedPayload?.by_transaction_holds)
        ? mostDemandedPayload.by_transaction_holds
        : [],
    [mostDemandedPayload],
  );
  const disputes = useMemo(() => toArray(disputesQuery.data), [disputesQuery.data]);

  const monthlyChartData = monthly.map((item) => ({
    label: item?.month_label || item?.month || "-",
    deposits: Number(item?.deposits || 0),
    withdrawals: Number(item?.withdrawals || 0),
  }));

  const weeklyChartData = weekly.map((item) => ({
    label: item?.week_start || `W${item?.week_number || "-"}`,
    deposits: Number(item?.deposits || 0),
    withdrawals: Number(item?.withdrawals || 0),
  }));

  const statsPieData = [
    { name: "Revenue", value: Number(financial.total_revenue || 0), color: "#10b981" },
    { name: "Withdrawals", value: Number(financial.total_withdrawals || 0), color: "#ef4444" },
    {
      name: "Pending Deposits",
      value: Number(financial.total_pending_deposits || 0),
      color: "#f59e0b",
    },
    {
      name: "Booking Holds",
      value: Number(financial.total_booking_holds || 0),
      color: "#8b5cf6",
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Analytics</h1>
        <p className="text-sm text-neutral-500">
          Financial, demand, stock turnover and dispute insights from live analytics endpoints.
        </p>
      </div>

      <ChartCard title="Stats Breakdown" loading={financialSummaryQuery.isLoading || overviewQuery.isLoading}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statsPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={64}
                  outerRadius={98}
                  paddingAngle={3}
                >
                  {statsPieData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => currency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 text-sm">
            <div className="rounded-lg border border-neutral-200 p-3">
              <p className="text-neutral-500">Net Balance</p>
              <p className="font-semibold text-neutral-900">{currency(financial.net_balance)}</p>
            </div>
            <div className="rounded-lg border border-neutral-200 p-3">
              <p className="text-neutral-500">Pending Transactions</p>
              <p className="font-semibold text-neutral-900">
                {Number(overview.pending_transactions || 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 p-3">
              <p className="text-neutral-500">Total Bookings</p>
              <p className="font-semibold text-neutral-900">
                {Number(overview.bookings || 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 p-3">
              <p className="text-neutral-500">Customers</p>
              <p className="font-semibold text-neutral-900">
                {Number(overview.customers || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartCard title="Monthly Deposits vs Withdrawals" loading={monthlyTrendQuery.isLoading}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyChartData}
                barCategoryGap="28%"
                barGap={4}
                maxBarSize={18}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={compactNaira} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="deposits" barSize={14} fill="#10b981" name="Deposits" radius={[8, 8, 0, 0]}>
                  {monthlyChartData.map((_, index) => (
                    <Cell key={`deposit-cell-${index}`} fill={index % 2 === 0 ? "#10b981" : "#34d399"} />
                  ))}
                </Bar>
                <Bar
                  dataKey="withdrawals"
                  barSize={14}
                  fill="#ef4444"
                  name="Withdrawals"
                  radius={[8, 8, 0, 0]}
                >
                  {monthlyChartData.map((_, index) => (
                    <Cell key={`withdrawal-cell-${index}`} fill={index % 2 === 0 ? "#ef4444" : "#f87171"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Deposits
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 px-2 py-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Withdrawals
            </span>
          </div>
        </ChartCard>

        <ChartCard title="Weekly Trend (8 Weeks)" loading={weeklyTrendQuery.isLoading}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={weeklyChartData}>
                <defs>
                  <linearGradient id="depositGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={compactNaira} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="deposits"
                  stroke="#0ea5e9"
                  fill="url(#depositGradient)"
                  strokeWidth={2}
                  name="Deposits"
                />
                <Line
                  type="monotone"
                  dataKey="withdrawals"
                  stroke="#ea580c"
                  strokeWidth={3}
                  connectNulls
                  dot={{ r: 4, fill: "#ea580c", stroke: "#ffffff", strokeWidth: 1.5 }}
                  activeDot={{ r: 5.5 }}
                  name="Withdrawals"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-700 px-2 py-1">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              Deposits area
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 text-orange-700 px-2 py-1">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Withdrawals line
            </span>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <SectionTable
          title="Most Demanded (By Booking Count)"
          columns={["Product", "Bookings", "Total Holds"]}
          rows={mostDemandedByBookings.map((item) => [
            item?.product_name || "-",
            Number(item?.booking_count || 0).toLocaleString(),
            currency(item?.total_holds || 0),
          ])}
        />
        <SectionTable
          title="Most Demanded (By Transaction Holds)"
          columns={["Product", "Total Holds", "Bookings"]}
          rows={mostDemandedByHolds.map((item) => [
            item?.product_name || "-",
            currency(item?.total_holds || 0),
            Number(item?.booking_count || 0).toLocaleString(),
          ])}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <SectionTable
          title="Stock Turnover"
          columns={["Product", "Variant", "Units Sold", "Turnover %"]}
          rows={turnover.map((item) => [
            item?.product_name || "-",
            item?.size_label || "-",
            Number(item?.units_sold || 0).toLocaleString(),
            `${Number(item?.turnover_rate_percent || 0).toFixed(1)}%`,
          ])}
        />
        <SectionTable
          title="Dispute Patterns (Failed Tx > 2)"
          columns={["User", "Email", "Failed Tx", "Last Failure"]}
          rows={disputes.map((item) => [
            `${item?.first_name || ""} ${item?.last_name || ""}`.trim() || "-",
            item?.email || "-",
            Number(item?.failed_transactions || 0).toLocaleString(),
            item?.last_failure
              ? new Date(item.last_failure).toLocaleString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-",
          ])}
          emptyText="No users with repeated failed transactions."
        />
      </div>
    </div>
  );
}
