import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useOwnerRecentCash,
  useOwnerRecordDeposit,
  useOwnerSearchUsers,
  useOwnerStats,
} from "./hooks/useOwnerData";
import { clearAuthToken } from "../../utils/authStorage";
import OwnerDashboardHeader from "./OwnerDashboardHeader";
import OwnerDashboardActions from "./OwnerDashboardActions";

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
    () => statsQuery.data?.stats || statsQuery.data?.data || statsQuery.data || {},
    [statsQuery.data],
  );

  return (
    <div className="w-full space-y-10">
      <OwnerDashboardHeader stats={stats} loading={statsQuery.isLoading} />
      <OwnerDashboardActions onNavigate={navigate} />
    </div>
  );
}
