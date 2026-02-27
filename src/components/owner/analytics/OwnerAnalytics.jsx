import { useMemo } from "react";
import { FiBarChart2 } from "react-icons/fi";
import {
  useAnalyticsDisputePatterns,
  useAnalyticsFinancialSummary,
  useAnalyticsMonthlyTrend,
  useAnalyticsOverview,
  useAnalyticsStockTurnover,
  useAnalyticsWeeklyTrend,
} from "../hooks/useOwnerAnalytics";
import { toArray } from "./analyticsUtils";
import OverviewChartsSection from "./OverviewChartsSection";
import StockTurnoverSection from "./StockTurnoverSection";
import DisputePatternsSection from "./DisputePatternsSection";

export default function OwnerAnalytics() {
  const financialSummaryQuery = useAnalyticsFinancialSummary();
  const overviewQuery = useAnalyticsOverview();
  const monthlyTrendQuery = useAnalyticsMonthlyTrend();
  const weeklyTrendQuery = useAnalyticsWeeklyTrend();
  const stockTurnoverQuery = useAnalyticsStockTurnover();
  const disputesQuery = useAnalyticsDisputePatterns();

  const financial = useMemo(
    () => financialSummaryQuery.data?.data || financialSummaryQuery.data || {},
    [financialSummaryQuery.data],
  );
  const overview = useMemo(
    () => overviewQuery.data?.data || overviewQuery.data || {},
    [overviewQuery.data],
  );

  const monthlyChartData = useMemo(
    () =>
      toArray(monthlyTrendQuery.data).map((item) => ({
        label: item?.month_label || item?.month || "-",
        deposits: Number(item?.deposits || 0),
        withdrawals: Number(item?.withdrawals || 0),
      })),
    [monthlyTrendQuery.data],
  );

  const weeklyChartData = useMemo(
    () =>
      toArray(weeklyTrendQuery.data).map((item) => ({
        label: item?.week_start || `W${item?.week_number || "-"}`,
        deposits: Number(item?.deposits || 0),
        withdrawals: Number(item?.withdrawals || 0),
      })),
    [weeklyTrendQuery.data],
  );

  const turnover = useMemo(
    () => toArray(stockTurnoverQuery.data),
    [stockTurnoverQuery.data],
  );

  const disputes = useMemo(() => toArray(disputesQuery.data), [disputesQuery.data]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-neutral-900">
          <FiBarChart2 className="w-6 h-6" />
          <span>Analytics</span>
        </h1>
        <p className="text-sm text-neutral-500">
          Financial, demand, stock turnover and dispute insights from live analytics endpoints.
        </p>
      </div>

      <OverviewChartsSection
        financial={financial}
        overview={overview}
        monthlyChartData={monthlyChartData}
        weeklyChartData={weeklyChartData}
        loading={{
          summary: financialSummaryQuery.isLoading || overviewQuery.isLoading,
          monthly: monthlyTrendQuery.isLoading,
          weekly: weeklyTrendQuery.isLoading,
        }}
      />

      <StockTurnoverSection turnover={turnover} />

      <DisputePatternsSection disputes={disputes} />
    </div>
  );
}
