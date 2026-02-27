const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const normalizeFrequency = (value) => {
  const normalized = String(value || "monthly").toLowerCase();
  if (normalized === "daily") return "daily";
  if (normalized === "weekly") return "weekly";
  return "monthly";
};

export const getIntervalLabel = (frequency) => {
  const normalized = normalizeFrequency(frequency);
  if (normalized === "daily") return "days";
  if (normalized === "weekly") return "weeks";
  return "months";
};

export const normalizeDurationUnit = (value, frequency = "monthly") => {
  const raw = String(value || "").toLowerCase();
  if (raw.startsWith("day")) return "days";
  if (raw.startsWith("week")) return "weeks";
  if (raw.startsWith("month")) return "months";
  return getIntervalLabel(frequency);
};

export const getAnnualIntervals = (frequency) => {
  const normalized = normalizeFrequency(frequency);
  if (normalized === "daily") return 365;
  if (normalized === "weekly") return 52;
  return 12;
};

export const calculateDurationUnits = ({ targetAmount, amountPerInterval }) => {
  const target = toNumber(targetAmount);
  const amount = toNumber(amountPerInterval);
  if (target <= 0 || amount <= 0) return 0;
  return Math.ceil(target / amount);
};

export const addIntervals = ({ startDate, frequency, count }) => {
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return "";

  const normalized = normalizeFrequency(frequency);
  const parsedCount = toNumber(count);
  const date = new Date(start);

  if (normalized === "daily") {
    date.setDate(date.getDate() + parsedCount);
  } else if (normalized === "weekly") {
    date.setDate(date.getDate() + parsedCount * 7);
  } else {
    date.setMonth(date.getMonth() + parsedCount);
  }

  return date.toISOString();
};

const advanceDateByFrequency = (source, frequency, step = 1) => {
  const target = new Date(source);
  const normalized = normalizeFrequency(frequency);

  if (normalized === "daily") {
    target.setDate(target.getDate() + step);
  } else if (normalized === "weekly") {
    target.setDate(target.getDate() + step * 7);
  } else {
    target.setMonth(target.getMonth() + step);
  }

  return target;
};

export const buildUpcomingPaymentDates = ({
  startDate,
  frequency,
  nextPayment,
  endDate,
  remainingIntervals,
  limit = 12,
}) => {
  const baseIso = nextPayment || startDate;
  if (!baseIso) return [];

  const cursor = new Date(baseIso);
  if (Number.isNaN(cursor.getTime())) return [];

  const finalEndDate = endDate ? new Date(endDate) : null;
  const iterations =
    Number.isFinite(remainingIntervals) && remainingIntervals > 0
      ? remainingIntervals
      : limit;

  const dates = [];
  let current = cursor;
  for (let i = 0; i < iterations; i += 1) {
    if (finalEndDate && current > finalEndDate) break;
    dates.push(current.toISOString());
    current = advanceDateByFrequency(current, frequency, 1);
  }

  return dates;
};

const isCompletedDeposit = (item) => {
  const status = String(item?.status || "").toLowerCase();
  const type = String(item?.type || "").toLowerCase();
  return status === "completed" && type === "deposit";
};

const getCompletedDepositsInPeriod = ({ frequency, recentActivity = [] }) => {
  const now = new Date();
  const normalized = normalizeFrequency(frequency);
  return recentActivity.reduce((total, item) => {
    if (!isCompletedDeposit(item)) return total;
    const created = new Date(item?.created_at);
    if (Number.isNaN(created.getTime())) return total;

    let inPeriod = false;
    if (normalized === "daily") {
      inPeriod =
        created.getFullYear() === now.getFullYear() &&
        created.getMonth() === now.getMonth() &&
        created.getDate() === now.getDate();
    } else if (normalized === "weekly") {
      const diffDays = Math.floor(
        (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
      );
      inPeriod = diffDays >= 0 && diffDays < 7;
    } else {
      inPeriod =
        created.getFullYear() === now.getFullYear() &&
        created.getMonth() === now.getMonth();
    }

    if (!inPeriod) return total;
    return total + toNumber(item?.amount);
  }, 0);
};

export const calculatePlanMetrics = ({
  plan = null,
  progressStats = {},
  recentActivity = [],
  summaryProgress = {},
  paymentHistory = [],
}) => {
  const frequency = normalizeFrequency(
    plan?.plan_type || plan?.frequency || progressStats?.frequency,
  );
  const amountPerInterval = toNumber(plan?.amount || plan?.monthlyAmount);
  const targetAmount = toNumber(plan?.target_amount || plan?.totalTarget);
  const derivedDurationUnits = calculateDurationUnits({
    targetAmount,
    amountPerInterval,
  });
  const backendDuration = toNumber(plan?.duration || plan?.durationMonths, 0);
  const durationUnits = backendDuration > 0 ? backendDuration : derivedDurationUnits;
  const durationUnit = normalizeDurationUnit(plan?.duration_unit, frequency);
  const dailyExpected =
    durationUnit === "days" && durationUnits > 0
      ? targetAmount / durationUnits
      : null;

  const completedFromHistory = paymentHistory.reduce((total, item) => {
    const status = String(item?.status || "").toLowerCase();
    if (status !== "completed") return total;
    const type = String(item?.type || item?.method || item?.transaction_type || "").toLowerCase();
    const amount = toNumber(item?.amount);
    if (type.includes("withdraw")) return total - amount;
    return total + amount;
  }, 0);

  const completedFromRecentActivity = recentActivity.reduce((total, item) => {
    const status = String(item?.status || "").toLowerCase();
    if (status !== "completed") return total;
    const type = String(item?.type || item?.method || item?.transaction_type || "").toLowerCase();
    const amount = toNumber(item?.amount);
    if (type.includes("withdraw")) return total - amount;
    if (type.includes("deposit")) return total + amount;
    return total;
  }, 0);

  const hasProgressTotalSaved =
    progressStats &&
    Object.prototype.hasOwnProperty.call(progressStats, "total_saved");
  const totalSaved = Math.max(
    0,
    (() => {
      if (hasProgressTotalSaved) return toNumber(progressStats?.total_saved);
      if (paymentHistory.length > 0) return completedFromHistory;
      if (recentActivity.length > 0) return completedFromRecentActivity;
      return toNumber(plan?.totalSaved);
    })(),
  );
  const paymentsMade = amountPerInterval > 0 ? Math.floor(totalSaved / amountPerInterval) : 0;
  const dayCompleted =
    dailyExpected && dailyExpected > 0
      ? Math.floor(totalSaved / dailyExpected)
      : paymentsMade;
  const completedIntervals = Math.min(
    durationUnit === "days" ? dayCompleted : paymentsMade,
    durationUnits || dayCompleted,
  );
  const paymentProgressPercent =
    durationUnits > 0 ? Math.min((completedIntervals / durationUnits) * 100, 100) : 0;
  const savingsProgressPercent =
    targetAmount > 0 ? Math.min((totalSaved / targetAmount) * 100, 100) : 0;
  const remainingIntervals = Math.max(0, durationUnits - completedIntervals);
  const startDate = plan?.start_date || plan?.startDate || "";
  const computedEndDate = addIntervals({
    startDate,
    frequency,
    count: durationUnits,
  });
  const computedNextPayment = addIntervals({
    startDate,
    frequency,
    count: completedIntervals + 1,
  });
  const endDate = plan?.end_date || plan?.endDate || computedEndDate;
  const nextPayment =
    plan?.next_payment_date || plan?.next_payment || plan?.nextPayment || computedNextPayment;
  const upcomingDates = buildUpcomingPaymentDates({
    startDate,
    frequency,
    nextPayment,
    endDate,
    remainingIntervals,
    limit: durationUnits || 12,
  });

  const periodGoal = durationUnit === "days" && dailyExpected ? dailyExpected : amountPerInterval;
  const periodSavedFromSummary =
    frequency === "monthly"
      ? toNumber(summaryProgress?.monthly?.current)
      : frequency === "weekly"
        ? toNumber(summaryProgress?.weekly?.current)
        : toNumber(summaryProgress?.daily?.current);

  const periodSaved =
    periodSavedFromSummary > 0
      ? periodSavedFromSummary
      : getCompletedDepositsInPeriod({ frequency, recentActivity });
  const annualGoal = amountPerInterval * getAnnualIntervals(frequency);
  const annualProjection = annualGoal;

  const periodLabel =
    frequency === "daily"
      ? "Daily Target"
      : frequency === "weekly"
        ? "Weekly Target"
        : "Monthly Target";

  return {
    frequency,
    amountPerInterval,
    targetAmount,
    durationUnits,
    durationUnit,
    intervalLabel: durationUnit,
    totalSaved,
    paymentsMade,
    completedIntervals,
    remainingIntervals,
    paymentProgressPercent,
    savingsProgressPercent,
    startDate,
    endDate,
    nextPayment,
    periodGoal,
    periodSaved,
    periodLabel,
    annualGoal,
    annualProjection,
    upcomingDates,
  };
};
