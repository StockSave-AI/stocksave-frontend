import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
import { useVerifySavings } from "../hooks/useVerifySavings";

function CustomerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading, error } = useCustomerSummary();
  const { data: plansData } = usePlans();
  const verifyMutation = useVerifySavings();
  const verifiedRefs = useRef(new Set());

  const summary = data?.data;
  const plansPayload = plansData?.data || plansData || {};
  const currentPlan = plansPayload?.current_plan || null;
  const hasActivePlan = Boolean(currentPlan?.id);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reference = params.get("reference") || params.get("trxref");

    if (!reference) return;
    if (verifyMutation.isPending) return;
    if (verifiedRefs.current.has(reference)) return;

    verifiedRefs.current.add(reference);

    verifyMutation.mutate(reference, {
      onSuccess: () => {
        const cleaned = new URLSearchParams(location.search);
        cleaned.delete("reference");
        cleaned.delete("trxref");
        const nextQuery = cleaned.toString();
        const nextUrl = `${location.pathname}${nextQuery ? `?${nextQuery}` : ""}`;
        window.history.replaceState({}, "", nextUrl);
      },
      onError: () => {
        verifiedRefs.current.delete(reference);
      },
    });
  }, [location.pathname, location.search, verifyMutation]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Failed to load dashboard.</div>;
  }

  if (!summary) {
    return <div>No dashboard data available.</div>;
  }

  const recentActivity = (summary?.recent_activity || []).map((item, index) => {
    const rawType = String(item.type || "").toLowerCase();
    const isDeposit = rawType === "deposit";
    const isWithdrawal = rawType === "withdrawal" || rawType.includes("withdraw");
    const product =
      item.product_name ||
      item.item_name ||
      item.inventory_name ||
      item.name ||
      "Item";
    const variant = item.size_label || item.variant_name || "";
    const type = isDeposit
      ? "Deposit"
      : isWithdrawal
        ? "Withdrawal"
        : `Booked ${product}${variant ? ` (${variant})` : ""}`;
    const amount = Number.parseFloat(item.amount || 0);
    const status = String(
      item.status || (isDeposit ? "pending" : isWithdrawal ? "completed" : "booked"),
    ).toLowerCase();
    const time = (() => {
      const d = new Date(item.created_at);
      return Number.isNaN(d.getTime())
        ? ""
        : d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });
    })();
    return {
      type,
      date: `${formatDisplayDate(item.created_at, "-")}${time ? ` - ${time}` : ""}`,
      amount: isDeposit ? amount : -Math.abs(amount),
      status,
      id: index,
    };
  });

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

  const intervalLabel = planMetrics?.intervalLabel || planMetrics?.durationUnit || "periods";
  const completedLabel = `${planMetrics?.completedIntervals || 0}/${
    planMetrics?.durationUnits || 0
  } ${intervalLabel}`;

  const progressItems = [
    {
      title: planMetrics.periodLabel,
      saved: planMetrics.periodSaved,
      goal: planMetrics.periodGoal,
      color: "primary",
      subtitle: completedLabel,
    },
    {
      title: annualLabel,
      saved: planMetrics.annualProjection,
      goal: planMetrics.annualProjection,
      color: "secondary",
      subtitle: "Projected yearly savings",
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
