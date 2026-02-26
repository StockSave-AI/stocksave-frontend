import { apiClient } from "../../../api/apiClient";

const BASE = "/api/analytics";

export const fetchAnalyticsFinancialSummary = () =>
  apiClient(`${BASE}/financial-summary`);

export const fetchAnalyticsOverview = () => apiClient(`${BASE}/overview`);

export const fetchAnalyticsMonthlyTrend = () => apiClient(`${BASE}/monthly-trend`);

export const fetchAnalyticsWeeklyTrend = () => apiClient(`${BASE}/weekly-trend`);

export const fetchAnalyticsStockTurnover = () => apiClient(`${BASE}/stock-turnover`);

export const fetchAnalyticsMostDemanded = () => apiClient(`${BASE}/most-demanded`);

export const fetchAnalyticsDisputePatterns = () =>
  apiClient(`${BASE}/dispute-patterns`);
