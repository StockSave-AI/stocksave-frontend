import { useQuery } from "@tanstack/react-query";
import {
  fetchAnalyticsDisputePatterns,
  fetchAnalyticsFinancialSummary,
  fetchAnalyticsMonthlyTrend,
  fetchAnalyticsMostDemanded,
  fetchAnalyticsOverview,
  fetchAnalyticsStockTurnover,
  fetchAnalyticsWeeklyTrend,
} from "../services/ownerAnalyticsApi";

export const useAnalyticsFinancialSummary = () =>
  useQuery({
    queryKey: ["owner-analytics-financial-summary"],
    queryFn: fetchAnalyticsFinancialSummary,
  });

export const useAnalyticsOverview = () =>
  useQuery({
    queryKey: ["owner-analytics-overview"],
    queryFn: fetchAnalyticsOverview,
  });

export const useAnalyticsMonthlyTrend = () =>
  useQuery({
    queryKey: ["owner-analytics-monthly-trend"],
    queryFn: fetchAnalyticsMonthlyTrend,
  });

export const useAnalyticsWeeklyTrend = () =>
  useQuery({
    queryKey: ["owner-analytics-weekly-trend"],
    queryFn: fetchAnalyticsWeeklyTrend,
  });

export const useAnalyticsStockTurnover = () =>
  useQuery({
    queryKey: ["owner-analytics-stock-turnover"],
    queryFn: fetchAnalyticsStockTurnover,
  });

export const useAnalyticsMostDemanded = () =>
  useQuery({
    queryKey: ["owner-analytics-most-demanded"],
    queryFn: fetchAnalyticsMostDemanded,
  });

export const useAnalyticsDisputePatterns = () =>
  useQuery({
    queryKey: ["owner-analytics-dispute-patterns"],
    queryFn: fetchAnalyticsDisputePatterns,
  });
