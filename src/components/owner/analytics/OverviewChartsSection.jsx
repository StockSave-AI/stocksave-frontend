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
import { ChartCard } from "./AnalyticsShared";
import { CurrencyChartTooltip } from "./AnalyticsTooltips";
import { compactNaira, currency } from "./analyticsUtils";

export default function OverviewChartsSection({
  financial,
  overview,
  monthlyChartData,
  weeklyChartData,
  loading,
}) {
  const statsPieData = [
    { name: "Revenue", value: Number(financial.total_revenue || 0), color: "#10b981" },
    { name: "Withdrawals", value: Number(financial.total_withdrawals || 0), color: "#ef4444" },
    { name: "Pending Deposits", value: Number(financial.total_pending_deposits || 0), color: "#f59e0b" },
    { name: "Booking Holds", value: Number(financial.total_booking_holds || 0), color: "#8b5cf6" },
  ].filter((item) => item.value > 0);

  return (
    <>
      <ChartCard title="Stats Breakdown" loading={loading.summary}>
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
              <p className="font-semibold text-neutral-900">{Number(overview.pending_transactions || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartCard title="Monthly Deposits vs Withdrawals" loading={loading.monthly}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData} barCategoryGap="28%" barGap={4} maxBarSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={compactNaira} axisLine={false} tickLine={false} />
                <Tooltip content={<CurrencyChartTooltip />} />
                <Bar dataKey="deposits" barSize={14} fill="#10b981" name="Deposits" radius={[8, 8, 0, 0]}>
                  {monthlyChartData.map((_, index) => (
                    <Cell key={`deposit-cell-${index}`} fill={index % 2 === 0 ? "#10b981" : "#34d399"} />
                  ))}
                </Bar>
                <Bar dataKey="withdrawals" barSize={14} fill="#ef4444" name="Withdrawals" radius={[8, 8, 0, 0]}>
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

        <ChartCard title="Weekly Trend (8 Weeks)" loading={loading.weekly}>
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
                <Tooltip content={<CurrencyChartTooltip />} />
                <Area type="monotone" dataKey="deposits" stroke="#0ea5e9" fill="url(#depositGradient)" strokeWidth={2} name="Deposits" />
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
    </>
  );
}
