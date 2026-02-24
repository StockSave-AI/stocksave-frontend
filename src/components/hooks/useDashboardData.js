import { useCustomerSummary } from "./useCustomerSummary";

export default function useDashboardData() {
  const { data, isLoading, error } = useCustomerSummary();
  return { data: data?.data || null, loading: isLoading, error };
}
