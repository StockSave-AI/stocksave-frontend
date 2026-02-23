import { FaEdit } from "react-icons/fa";
import { formatDisplayDate } from "../../../utils/date";
import { formatCurrency } from "../../../utils/currency";
export default function CurrentPlan({ plan, metrics, onEditPlan }) {
  if (!plan) return null;

  const frequency = String(metrics?.frequency || plan.frequency || "monthly").toLowerCase();
  const duration = Number(metrics?.durationUnits || plan.durationMonths || 0);
  const endDate = metrics?.endDate || plan.endDate;
  const nextPayment = metrics?.nextPayment || plan.nextPayment;
  const amount = metrics?.amountPerInterval ?? plan.monthlyAmount;

  return (
    <div className="bg-white shadow-card rounded-card p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-h3">Current Plan</h2>
          {String(plan.status).toLowerCase() === "active" && (
            <span className="text-xs font-medium text-success bg-success/10 px-3 py-1 rounded-full">
              ACTIVE
            </span>
          )}
        </div>

        <button
          onClick={onEditPlan}
          className="flex items-center gap-2 bg-secondary-100 text-secondary-700 px-4 py-2 rounded-button hover:bg-secondary-200 transition"
        >
          <FaEdit className="text-sm" />
          <span>Edit Plan</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 text-sm">
        <Detail label="Frequency" value={plan.frequency || "-"} />
        <Detail
          label="Amount"
          value={formatCurrency(amount)}
        />
        <Detail
          label="Duration"
          value={`${duration} ${
            frequency === "daily"
              ? "days"
              : frequency === "weekly"
                ? "weeks"
                : "months"
          }`}
        />
        <Detail
          label="Start Date"
          value={plan.startDate ? formatDisplayDate(plan.startDate) : "-"}
        />
        <Detail label="End Date" value={formatDisplayDate(endDate, "-")} />
        <Detail
          label="Next Payment"
          value={formatDisplayDate(nextPayment, "-")}
        />
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-neutral-500">{label}</p>
      <p className="font-semibold text-neutral-800">{value}</p>
    </div>
  );
}
