export default function PlanEmptyState({ onCreatePlan }) {
  return (
    <div className="bg-primary-50 border border-primary-200 rounded-card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-h3 text-primary-700">No Active Plan</h2>
          <p className="text-sm text-primary-700/80 mt-1">
            Create a payment plan to automate your savings and track upcoming contributions.
          </p>
      </div>
      <button
        onClick={onCreatePlan}
        className="bg-primary-500 text-white px-4 py-2 rounded-button hover:bg-primary-600 transition"
      >
        Create Plan
      </button>
    </div>
  );
}
