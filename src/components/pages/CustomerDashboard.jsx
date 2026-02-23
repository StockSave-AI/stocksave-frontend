import { useNavigate } from "react-router-dom";

import WelcomeCard from "../../components/dashboard/WelcomeCard";
import ProgressSection from "../../components/dashboard/ProgressSection";
import { useCustomerSummary } from "../hooks/useCustomerSummary";
import { usePlans } from "../hooks/usePlans";
import Loader from "../ui/Loader";
import { formatDisplayDate } from "../../utils/date";
import { formatCurrency } from "../../utils/currency";
import DashboardStatsGrid from "../../components/dashboard/customer-dashboard/DashboardStatsGrid";
import DashboardActionsGrid from "../../components/dashboard/customer-dashboard/DashboardActionsGrid";
import PlanStateBanner from "../../components/dashboard/customer-dashboard/PlanStateBanner";
import RecentActivitySection from "../../components/dashboard/customer-dashboard/RecentActivitySection";
import { calculatePlanMetrics, normalizeFrequency } from "../dashboard/payment-plan/planCalculations";

function CustomerDashboard() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useCustomerSummary();
  const { data: plansData } = usePlans();

  const summary = data?.data;
  const plansPayload = plansData?.data || plansData || {};
  const currentPlan = plansPayload?.current_plan || null;
  const hasActivePlan = Boolean(currentPlan?.id);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Failed to load dashboard.</div>;
  }

  if (!summary) {
    return <div>No dashboard data available.</div>;
  }

  const recentActivity = (summary?.recent_activity || []).map((item, index) => ({
    type: `${item.type}${item.method ? ` (${item.method})` : ""}`,
    date: formatDisplayDate(item.created_at, "-"),
    amount:
      String(item.type || "").toLowerCase() === "deposit"
        ? Number.parseFloat(item.amount || 0)
        : -Number(item.amount || 0),
    status: String(item.status || "").toLowerCase(),
    id: index,
  }));

  const planMetrics = calculatePlanMetrics({
    plan: currentPlan,
    progressStats: {
      total_saved:
        plansPayload?.progress_stats?.total_saved ?? summary?.summary_cards?.total_savings ?? 0,
    },
    recentActivity: summary?.recent_activity || [],
    summaryProgress: summary?.progress || {},
  });

  const frequency = normalizeFrequency(currentPlan?.plan_type || "monthly");
  const annualLabel =
    frequency === "daily"
      ? "Annual Projection (Daily)"
      : frequency === "weekly"
        ? "Annual Projection (Weekly)"
        : "Annual Projection (Monthly)";

  const progressItems = [
    {
      title: planMetrics.periodLabel,
      saved: planMetrics.periodSaved,
      goal: planMetrics.periodGoal,
      color: "primary",
      subtitle: `${planMetrics.completedIntervals}/${planMetrics.durationUnits} ${planMetrics.intervalLabel} completed`,
    },
    {
      title: annualLabel,
      saved: planMetrics.annualProjectionSaved,
      goal: planMetrics.annualGoal,
      color: "secondary",
      subtitle: `${formatCurrency(planMetrics.totalSaved)} / ${formatCurrency(planMetrics.targetAmount)} overall plan progress`,
    },
  ];

  return (
    <div className="space-y-8">
      <WelcomeCard
        name={summary?.profile?.first_name || "User"}
        greeting={summary?.greeting}
      />

      <DashboardStatsGrid
        formatCurrency={formatCurrency}
        summary={summary}
        currentPlan={currentPlan}
        formatDisplayDate={formatDisplayDate}
      />

      <ProgressSection
        items={progressItems}
      />

      <DashboardActionsGrid onNavigate={(path) => navigate(path)} />

      <PlanStateBanner
        hasActivePlan={hasActivePlan}
        onCreatePlan={() => navigate("/dashboard/payment-plan?create=1")}
        onEditPlan={() => navigate("/dashboard/payment-plan")}
      />

      <RecentActivitySection activities={recentActivity} />
    </div>
  );
}

export default CustomerDashboard;
