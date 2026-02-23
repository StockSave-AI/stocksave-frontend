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
}) => {
  const frequency = normalizeFrequency(
    plan?.plan_type || plan?.frequency || progressStats?.frequency,
  );
  const amountPerInterval = toNumber(plan?.amount || plan?.monthlyAmount);
  const targetAmount = toNumber(plan?.target_amount || plan?.totalTarget);
  const derivedDuration = calculateDurationUnits({
    targetAmount,
    amountPerInterval,
  });
  const totalSaved = toNumber(progressStats?.total_saved || plan?.totalSaved);
  const paymentsMade = amountPerInterval > 0 ? Math.floor(totalSaved / amountPerInterval) : 0;
  const completedIntervals = Math.min(paymentsMade, derivedDuration || paymentsMade);
  const paymentProgressPercent =
    derivedDuration > 0 ? Math.min((completedIntervals / derivedDuration) * 100, 100) : 0;
  const savingsProgressPercent =
    targetAmount > 0 ? Math.min((totalSaved / targetAmount) * 100, 100) : 0;
  const remainingIntervals = Math.max(0, derivedDuration - completedIntervals);
  const startDate = plan?.start_date || plan?.startDate || "";
  const endDate = addIntervals({
    startDate,
    frequency,
    count: derivedDuration,
  });
  const nextPayment = addIntervals({
    startDate,
    frequency,
    count: completedIntervals + 1,
  });

  const periodGoal = amountPerInterval;
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
  const periodRatio = amountPerInterval > 0 ? Math.min(periodSaved / amountPerInterval, 1) : 0;
  const annualProjectionSaved = annualGoal * periodRatio;

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
    durationUnits: derivedDuration,
    intervalLabel: getIntervalLabel(frequency),
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
    annualProjectionSaved,
  };
};

