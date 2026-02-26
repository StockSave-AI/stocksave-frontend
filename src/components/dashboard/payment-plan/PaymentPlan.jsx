import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import CurrentPlan from "./CurrentPlan";
import PlanProgress from "./PlanProgress";
import UpcomingPayments from "./UpcomingPayments";
import PlanActions from "./PlanActions";
import PlanSettings from "./PlanSettings";
import Loader from "../../ui/Loader";
import {
  useCreatePlan,
  usePausePlan,
  usePlans,
  useUpdatePlan,
  useUpdatePlanSettings,
} from "../../hooks/usePlans";
import { formatDisplayDate } from "../../../utils/date";
import { formatCurrency } from "../../../utils/currency";
import { calculatePlanMetrics } from "./planCalculations";
import PlanManagementHeader from "./PlanManagementHeader";
import PlanEmptyState from "./PlanEmptyState";
import PaymentHistorySection from "./PaymentHistorySection";

const calculateDays = (value) => {
  if (!value) return 0;
  const now = new Date();
  const target = new Date(value);
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const mapHistory = (items) =>
  items.map((item, index) => ({
    id: item.id || index,
    amount: formatCurrency(item.amount),
    date: formatDisplayDate(item.created_at || item.date),
    status: item.status || "Pending",
    type: item.method || item.type || "-",
  }));

const PLAN_TYPE_MAP = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

const normalizePlanTypeValue = (value) => {
  const normalized = String(value || "monthly").toLowerCase();
  return ["daily", "weekly", "monthly"].includes(normalized) ? normalized : "monthly";
};

const formatPlanTypePayload = (value) => {
  const normalized = normalizePlanTypeValue(value);
  return PLAN_TYPE_MAP[normalized];
};

export default function PaymentPlan() {
  const location = useLocation();
  const shouldOpenCreateFromQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("create") === "1";
  }, [location.search]);

  const [openModalTick, setOpenModalTick] = useState(
    shouldOpenCreateFromQuery ? 1 : 0,
  );

  const plansQuery = usePlans();
  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();
  const pausePlanMutation = usePausePlan();
  const updateSettingsMutation = useUpdatePlanSettings();

  const payload = useMemo(
    () => plansQuery.data?.data || plansQuery.data || {},
    [plansQuery.data],
  );

  const currentPlanRaw = payload.current_plan || null;
  const progressRaw = useMemo(() => payload.progress_stats || {}, [payload]);
  const paymentHistoryRaw = useMemo(() => payload.payment_history || [], [payload]);
  const upcomingRaw = useMemo(() => payload.upcoming_payments || [], [payload]);
  const settingsRaw = payload.settings || {};

  const fetchedPlan = useMemo(() => {
    if (!currentPlanRaw) return null;

    const metrics = calculatePlanMetrics({
      plan: currentPlanRaw,
      progressStats: progressRaw,
    });

    const rawStatus = String(currentPlanRaw.status || "").toLowerCase();
    const normalizedStatus =
      rawStatus === "paused" || rawStatus === "closed"
        ? "closed"
        : rawStatus === "active"
          ? "active"
          : "inactive";

    return {
      id: currentPlanRaw.id,
      status: normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1),
      plan_type: currentPlanRaw.plan_type,
      frequency: currentPlanRaw.plan_type || "",
      monthlyAmount: Number(currentPlanRaw.amount || 0),
      durationMonths: Number(currentPlanRaw.duration || metrics.durationUnits || 0),
      durationUnit: currentPlanRaw.duration_unit || metrics.durationUnit || metrics.intervalLabel,
      startDate: currentPlanRaw.start_date || "",
      endDate: currentPlanRaw.end_date || metrics.endDate || "",
      nextPayment:
        currentPlanRaw.next_payment_date ||
        currentPlanRaw.next_payment ||
        metrics.nextPayment ||
        "",
      totalTarget: Number(currentPlanRaw.target_amount || 0),
      paymentsMade: Number(metrics.completedIntervals || 0),
      totalSaved: Number(metrics.totalSaved || 0),
      missedPayments: Number(progressRaw.missed_payments || 0),
    };
  }, [currentPlanRaw, progressRaw]);

  const hasFetchedPlan = Boolean(fetchedPlan);
  const isActivePlan = hasFetchedPlan && String(fetchedPlan.status || "").toLowerCase() === "active";
  const activePlan = isActivePlan ? fetchedPlan : null;
  const previousPlan = hasFetchedPlan && !isActivePlan ? fetchedPlan : null;
  const planForMetrics = activePlan || previousPlan;
  const planMetrics = useMemo(
    () =>
      calculatePlanMetrics({
        plan: planForMetrics,
        progressStats: progressRaw,
        paymentHistory: paymentHistoryRaw,
      }),
    [planForMetrics, progressRaw, paymentHistoryRaw],
  );
  const history = useMemo(() => mapHistory(paymentHistoryRaw), [paymentHistoryRaw]);

  const upcoming = useMemo(() => {
    if (!activePlan) return [];
    if (upcomingRaw.length > 0) {
      return upcomingRaw.map((item, index) => ({
        id: item.id || index,
        amount: formatCurrency(item.amount),
        date: formatDisplayDate(item.date, "-"),
        days: item.days ?? calculateDays(item.date),
        status: item.status || "Upcoming",
      }));
    }

    if (!planMetrics?.upcomingDates?.length) return [];

    return planMetrics.upcomingDates.map((date, index) => ({
      id: `calculated-upcoming-${index}`,
      amount: formatCurrency(planMetrics.amountPerInterval),
      date: formatDisplayDate(date, "-"),
      days: calculateDays(date),
      status: "Upcoming",
    }));
  }, [activePlan, planMetrics, upcomingRaw]);

  const handlePlanSubmit = async ({ mode, payload: planPayload }) => {
    const normalizedPayload = {
      ...planPayload,
      plan_type: normalizePlanTypeValue(planPayload.plan_type),
    };

    try {
      if (mode === "create") {
        await createPlanMutation.mutateAsync({
          ...normalizedPayload,
          plan_type: formatPlanTypePayload(normalizedPayload.plan_type),
        });
        toast.success("Plan created successfully.");
      } else if (planForMetrics?.id) {
        await updatePlanMutation.mutateAsync({
          id: planForMetrics.id,
          payload: {
            plan_type: formatPlanTypePayload(normalizedPayload.plan_type),
            amount: normalizedPayload.amount,
            target_amount: normalizedPayload.target_amount,
            duration: normalizedPayload.duration,
            duration_unit: normalizedPayload.duration_unit,
            duration_months: normalizedPayload.duration_months,
            start_date: normalizedPayload.start_date,
          },
        });
        toast.success("Plan updated successfully.");
      }

      await plansQuery.refetch();
      return true;
    } catch (error) {
      toast.error(error.message || "Failed to save plan.");
      return false;
    }
  };

  const handlePauseResume = async () => {
    const referencePlan = activePlan || previousPlan;
    if (!referencePlan) return;

    const status = String(referencePlan.status || "").toLowerCase();

    try {
      if (status === "active") {
        await pausePlanMutation.mutateAsync(referencePlan.id);
        toast.success("Plan closed.");
      } else {
        await createPlanMutation.mutateAsync({
          plan_type: formatPlanTypePayload(referencePlan.frequency),
          amount: Number(referencePlan.monthlyAmount || 0),
          target_amount: Number(referencePlan.totalTarget || 0),
          duration: Number(referencePlan.durationMonths || 0),
          duration_unit: referencePlan.durationUnit || planMetrics?.durationUnit,
          duration_months: Number(referencePlan.durationMonths || 0),
          start_date: new Date().toISOString().split("T")[0],
        });
        toast.success("New plan resumed from previous settings.");
      }
      await plansQuery.refetch();
    } catch (error) {
      toast.error(error.message || "Unable to change plan status.");
    }
  };

  const handleUpdateSettings = async (nextSettings) => {
    if (!activePlan) return;
    try {
      await updateSettingsMutation.mutateAsync({
        id: activePlan.id,
        payload: nextSettings,
      });
      toast.success("Plan settings updated.");
      await plansQuery.refetch();
    } catch (error) {
      toast.error(error.message || "Failed to update settings.");
    }
  };

  if (plansQuery.isLoading) {
    return <Loader />;
  }

  if (plansQuery.isError) {
    return <div className="p-6">Failed to load plans.</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <PlanManagementHeader />

      {!activePlan && (
        <PlanEmptyState onCreatePlan={() => setOpenModalTick((value) => value + 1)} />
      )}

      {activePlan && (
        <>
          <CurrentPlan
            plan={activePlan}
            metrics={planMetrics}
            onEditPlan={() => setOpenModalTick((value) => value + 1)}
          />
          <PlanProgress plan={activePlan} metrics={planMetrics} />
          <UpcomingPayments upcoming={upcoming} />
        </>
      )}

      <PaymentHistorySection history={history} />

      <PlanActions
        key={`${planForMetrics?.id || "none"}-${openModalTick}`}
        plan={planForMetrics}
        openModalTick={openModalTick}
        onSubmitPlan={handlePlanSubmit}
        onPauseResume={handlePauseResume}
        isSubmitting={
          createPlanMutation.isPending ||
          updatePlanMutation.isPending ||
          pausePlanMutation.isPending
        }
      />

      <PlanSettings
        settings={settingsRaw}
        onUpdateSettings={handleUpdateSettings}
        isUpdating={updateSettingsMutation.isPending}
      />
    </div>
  );
}
