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
  useResumePlan,
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

const mapUpcoming = (items) =>
  items.map((item, index) => ({
    id: item.id || index,
    amount: formatCurrency(item.amount),
    date: formatDisplayDate(item.date, "-"),
    days: item.days ?? calculateDays(item.date),
    status: item.status || "Upcoming",
  }));

export default function PaymentPlan() {
  const location = useLocation();
  const shouldOpenCreateFromQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("create") === "1";
  }, [location.search]);

  const [openModalTick, setOpenModalTick] = useState(
    shouldOpenCreateFromQuery ? 1 : 0,
  );
  const [draftPlan, setDraftPlan] = useState(null);

  const plansQuery = usePlans();
  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();
  const pausePlanMutation = usePausePlan();
  const resumePlanMutation = useResumePlan();
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

    return {
      id: currentPlanRaw.id,
      status: currentPlanRaw.status || "inactive",
      frequency: currentPlanRaw.plan_type || "",
      monthlyAmount: Number(currentPlanRaw.amount || 0),
      durationMonths: Number(metrics.durationUnits || 0),
      startDate: currentPlanRaw.start_date || "",
      endDate: currentPlanRaw.end_date || metrics.endDate,
      nextPayment: currentPlanRaw.next_payment || metrics.nextPayment,
      totalTarget: Number(currentPlanRaw.target_amount || 0),
      paymentsMade: Number(metrics.completedIntervals || 0),
      totalSaved: Number(metrics.totalSaved || 0),
      missedPayments: Number(progressRaw.missed_payments || 0),
    };
  }, [currentPlanRaw, progressRaw]);

  const plan = draftPlan || fetchedPlan;
  const planMetrics = useMemo(
    () =>
      calculatePlanMetrics({
        plan,
        progressStats: progressRaw,
      }),
    [plan, progressRaw],
  );
  const history = useMemo(() => mapHistory(paymentHistoryRaw), [paymentHistoryRaw]);

  const upcoming = useMemo(() => {
    if (upcomingRaw.length > 0) {
      return mapUpcoming(upcomingRaw);
    }

    if (!planMetrics?.nextPayment) return [];

    return [
      {
        id: "calculated-next-payment",
        amount: formatCurrency(planMetrics.amountPerInterval),
        date: formatDisplayDate(planMetrics.nextPayment),
        days: calculateDays(planMetrics.nextPayment),
        status: "Upcoming",
      },
    ];
  }, [planMetrics, upcomingRaw]);

  const handlePlanSubmit = async ({ mode, payload: planPayload }) => {
    const previewMetrics = calculatePlanMetrics({
      plan: {
        id: plan?.id || "temp-plan",
        status: plan?.status || "active",
        plan_type: planPayload.plan_type,
        amount: planPayload.amount,
        target_amount: planPayload.target_amount,
        start_date: planPayload.start_date,
      },
      progressStats: { total_saved: plan?.totalSaved || 0 },
    });

    setDraftPlan({
      id: plan?.id || "temp-plan",
      status: plan?.status || "active",
      frequency: planPayload.plan_type,
      monthlyAmount: Number(planPayload.amount || 0),
      durationMonths: Number(previewMetrics.durationUnits || 0),
      startDate: planPayload.start_date,
      endDate: previewMetrics.endDate,
      nextPayment: previewMetrics.nextPayment,
      totalTarget: Number(planPayload.target_amount || 0),
      paymentsMade: Number(previewMetrics.completedIntervals || 0),
      totalSaved: Number(previewMetrics.totalSaved || 0),
      missedPayments: Number(plan?.missedPayments || 0),
    });

    try {
      if (mode === "create") {
        await createPlanMutation.mutateAsync(planPayload);
        toast.success("Plan created successfully.");
      } else if (plan?.id) {
        await updatePlanMutation.mutateAsync({
          id: plan.id,
          payload: {
            plan_type: planPayload.plan_type,
            amount: planPayload.amount,
            target_amount: planPayload.target_amount,
            duration_months: planPayload.duration_months,
            start_date: planPayload.start_date,
          },
        });
        toast.success("Plan updated successfully.");
      }

      await plansQuery.refetch();
      setDraftPlan(null);
      return true;
    } catch (error) {
      setDraftPlan(null);
      toast.error(error.message || "Failed to save plan.");
      return false;
    }
  };

  const handlePauseResume = async () => {
    if (!plan?.id) return;
    try {
      if (String(plan.status).toLowerCase() === "active") {
        await pausePlanMutation.mutateAsync(plan.id);
        toast.success("Plan paused.");
      } else {
        await resumePlanMutation.mutateAsync(plan.id);
        toast.success("Plan resumed.");
      }
      await plansQuery.refetch();
    } catch (error) {
      toast.error(error.message || "Unable to change plan status.");
    }
  };

  const handleUpdateSettings = async (nextSettings) => {
    if (!plan?.id) return;
    try {
      await updateSettingsMutation.mutateAsync({
        id: plan.id,
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

      {!plan && (
        <PlanEmptyState onCreatePlan={() => setOpenModalTick((value) => value + 1)} />
      )}

      <CurrentPlan
        plan={plan}
        metrics={planMetrics}
        onEditPlan={() => setOpenModalTick((value) => value + 1)}
      />
      {plan && <PlanProgress plan={plan} metrics={planMetrics} />}

      <UpcomingPayments upcoming={upcoming} />
      <PaymentHistorySection history={history} />

      <PlanActions
        key={`${plan?.id || "none"}-${openModalTick}`}
        plan={plan}
        openModalTick={openModalTick}
        onSubmitPlan={handlePlanSubmit}
        onPauseResume={handlePauseResume}
        isSubmitting={
          createPlanMutation.isPending ||
          updatePlanMutation.isPending ||
          pausePlanMutation.isPending ||
          resumePlanMutation.isPending
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
