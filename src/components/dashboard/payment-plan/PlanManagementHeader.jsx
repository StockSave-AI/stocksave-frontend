export default function PlanManagementHeader() {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">Payment Plan Management</h1>
        <p className="text-neutral-500 text-sm sm:text-base">
          View and manage your active savings plan
        </p>
      </div>
    </div>
  );
}
