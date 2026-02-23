import { formatCurrency } from "../../../utils/currency";

export default function PlanProgress({ plan, metrics }) {
  const totalIntervals = Number(metrics?.durationUnits || plan?.durationMonths || 0);
  const completedIntervals = Number(metrics?.completedIntervals || 0);
  const totalSaved = Number(metrics?.totalSaved || 0);
  const totalTarget = Number(metrics?.targetAmount || plan?.totalTarget || 0);
  const paymentProgress = Number(metrics?.paymentProgressPercent || 0);
  const savingsProgress = Number(metrics?.savingsProgressPercent || 0);
  const remainingPayments = Number(metrics?.remainingIntervals || 0);
  const intervalLabel = metrics?.intervalLabel || "months";
  const missedPayments = Number(plan?.missedPayments || 0);
  const onTimePercentage =
    completedIntervals === 0
      ? 0
      : Math.round(
          ((completedIntervals - Number(missedPayments || 0)) / completedIntervals) *
            100,
        );

  return (
    <div className="bg-white shadow-card rounded-card p-6 space-y-8">
      <h2 className="text-h3">Plan Progress</h2>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <p className="text-neutral-500">Payments Made</p>
          <p className="font-medium">
            {completedIntervals} / {totalIntervals} {intervalLabel}
          </p>
        </div>

        <div className="w-full bg-neutral-200 rounded-full h-3">
          <div
            className="bg-primary-500 h-3 rounded-full transition-all"
            style={{ width: `${paymentProgress}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <p className="text-neutral-500">Total Saved</p>
          <p className="font-medium">
            {formatCurrency(totalSaved)} / {formatCurrency(totalTarget)}
          </p>
        </div>

        <div className="w-full bg-neutral-200 rounded-full h-3">
          <div
            className="bg-success h-3 rounded-full transition-all"
            style={{ width: `${savingsProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox label="Completed" value={completedIntervals} />
        <StatBox label="Remaining" value={remainingPayments} />
        <StatBox label="Missed" value={missedPayments} />
        <StatBox label="On-time" value={`${onTimePercentage}%`} />
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="border border-neutral-200 rounded-button p-4 text-center">
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-sm text-neutral-500">{label}</p>
    </div>
  );
}
