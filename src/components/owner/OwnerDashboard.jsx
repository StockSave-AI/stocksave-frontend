import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthToken } from "../../utils/authStorage";
import {
  useOwnerRecentCash,
  useOwnerRecordDeposit,
  useOwnerSearchUsers,
  useOwnerStats,
} from "./hooks/useOwnerData";
import OwnerDashboardActions from "./OwnerDashboardActions";
import OwnerDashboardHeader from "./OwnerDashboardHeader";
import OwnerStatsChart from "./OwnerStatsChart";

const useDebouncedValue = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
};

const isUnauthorized = (error) => error?.status === 401;

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [showCharts, setShowCharts] = useState(false);
  const debouncedSearch = useDebouncedValue("", 400);

  const statsQuery = useOwnerStats();
  const recentCashQuery = useOwnerRecentCash();
  const searchQuery = useOwnerSearchUsers(debouncedSearch);
  useOwnerRecordDeposit();

  useEffect(() => {
    if (
      isUnauthorized(statsQuery.error) ||
      isUnauthorized(recentCashQuery.error) ||
      isUnauthorized(searchQuery.error)
    ) {
      clearAuthToken();
      navigate("/login", { replace: true });
    }
  }, [statsQuery.error, recentCashQuery.error, searchQuery.error, navigate]);

  const stats = useMemo(
    () =>
      statsQuery.data?.stats || statsQuery.data?.data || statsQuery.data || {},
    [statsQuery.data],
  );

  return (
    <div className="w-full space-y-10">
      <OwnerDashboardHeader stats={stats} loading={statsQuery.isLoading} />
      <button
        onClick={() => setShowCharts((prev) => !prev)}
        className="px-4 py-2 rounded-lg border border-neutral-200 text-sm font-semibold bg-white hover:bg-neutral-50 transition"
      >
        {showCharts ? "Hide Charts" : "Show Charts"}
      </button>
      {showCharts ? (
        <OwnerStatsChart stats={stats} loading={statsQuery.isLoading} />
      ) : null}
      <OwnerDashboardActions onNavigate={navigate} />
    </div>
  );
}
