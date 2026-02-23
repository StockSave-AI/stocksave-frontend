import { FaEdit } from "react-icons/fa";
import { FiTarget } from "react-icons/fi";

export default function PlanStateBanner({
  hasActivePlan,
  onCreatePlan,
  onEditPlan,
}) {
  if (!hasActivePlan) {
    return (
      <div className="bg-white rounded-card shadow-card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary-50 text-primary-600 p-3 rounded-button">
            <FiTarget />
          </div>
          <div>
            <h3 className="text-h3">No active payment plan</h3>
            <p className="text-sm text-neutral-500">
              Create a plan to automate your savings and track progress.
            </p>
          </div>
        </div>
        <button
          onClick={onCreatePlan}
          className="bg-primary-500 text-white px-4 py-2 rounded-button hover:bg-primary-600 transition"
        >
          Set Payment Plan
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-card shadow-card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h3 className="text-h3">Your payment plan is active</h3>
        <p className="text-sm text-neutral-500">
          Update your contribution amount, frequency, or settings at any time.
        </p>
      </div>
      <button
        onClick={onEditPlan}
        className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-button hover:bg-purple-200 transition"
      >
        <FaEdit className="text-sm" />
        <span>Edit Plan</span>
      </button>
    </div>
  );
}
