import { useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import {
  addIntervals,
  calculateDurationUnits,
  getIntervalLabel,
  normalizeFrequency,
} from "./planCalculations";

function formatDateInput(date) {
  return new Date(date).toISOString().split("T")[0];
}

export default function EditPlanModal({
  mode = "update",
  plan,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  const today = new Date();
  const todayStr = formatDateInput(today);

  const [planType, setPlanType] = useState(
    normalizeFrequency(plan?.frequency),
  );
  const [amount, setAmount] = useState(plan?.monthlyAmount || 0);
  const [targetAmount, setTargetAmount] = useState(plan?.totalTarget || 0);
  const [startDate, setStartDate] = useState(
    plan?.startDate ? formatDateInput(plan.startDate) : todayStr,
  );

  const calculatedDuration = useMemo(() => {
    return calculateDurationUnits({
      targetAmount,
      amountPerInterval: amount,
    });
  }, [amount, targetAmount]);

  const endDate = useMemo(() => {
    const iso = addIntervals({
      startDate,
      frequency: planType,
      count: calculatedDuration,
    });
    return iso ? formatDateInput(iso) : "";
  }, [calculatedDuration, planType, startDate]);

  const nextPayment = useMemo(() => {
    const iso = addIntervals({
      startDate,
      frequency: planType,
      count: 1,
    });
    return iso ? formatDateInput(iso) : "";
  }, [planType, startDate]);

  const canSubmit =
    Number(amount) > 0 &&
    Number(targetAmount) > 0 &&
    calculatedDuration > 0 &&
    Boolean(startDate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    await onSubmit({
      plan_type: planType,
      amount: Number(amount),
      target_amount: Number(targetAmount),
      duration: Number(calculatedDuration),
      duration_unit: getIntervalLabel(planType),
      duration_months: Number(calculatedDuration),
      start_date: startDate,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] p-6 relative shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-700 transition"
        >
          <FiX size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4">
          {mode === "create" ? "Create Plan" : "Edit Plan"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-600 mb-1">Frequency</label>
            <select
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
              className="w-full border-2 border-primary-200 bg-primary-50 rounded-button px-3 py-2 focus:outline-none focus:border-primary-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-neutral-600 mb-1">Amount</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border-2 border-primary-200 bg-primary-50 rounded-button px-3 py-2 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-600 mb-1">
              Target Amount
            </label>
            <input
              type="number"
              min="1"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full border-2 border-primary-200 bg-primary-50 rounded-button px-3 py-2 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-600 mb-1">
              Duration (
              {getIntervalLabel(planType)}
              )
            </label>
            <input
              type="text"
              value={calculatedDuration}
              disabled
              className="w-full border border-neutral-300 rounded-button px-3 py-2 bg-neutral-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-600 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              min={todayStr}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border-2 border-primary-200 bg-primary-50 rounded-button px-3 py-2 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-600 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              disabled
              className="w-full border border-neutral-300 rounded-button px-3 py-2 bg-neutral-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-600 mb-1">
              Next Payment
            </label>
            <input
              type="date"
              value={nextPayment}
              disabled
              className="w-full border border-neutral-300 rounded-button px-3 py-2 bg-neutral-100 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !canSubmit}
            className="w-full bg-primary-500 text-white py-3 rounded-button hover:bg-primary-600 transition font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
