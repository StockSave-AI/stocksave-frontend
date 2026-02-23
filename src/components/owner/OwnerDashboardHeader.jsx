function StatPreview({ label, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-md">
      <p className="text-sm text-indigo-100">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

export default function OwnerDashboardHeader({ stats, loading }) {
  const totalCustomers = Number(stats?.totalCustomers || stats?.total_users || 0);
  const totalSavings = Number(stats?.totalSavings || stats?.total_deposits || 0);
  const pendingCashCount = Number(
    stats?.pendingCashCount || stats?.pending_cash || 0,
  );
  const pendingCashValue = Number(stats?.pendingCashValue || 0);

  return (
    <div className="w-full bg-gradient-to-r from-secondary-700 to-indigo-700 text-white rounded-2xl p-8 shadow-xl">
      <h1 className="text-3xl md:text-4xl font-bold">Owner Dashboard</h1>
      <p className="mt-2 text-sm md:text-base text-indigo-100">
        Manage your platform, users, and inventory
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <StatPreview
          label="Total Customers"
          value={loading ? "..." : totalCustomers.toLocaleString()}
        />
        <StatPreview
          label="Total Savings"
          value={loading ? "..." : `₦${totalSavings.toLocaleString()}`}
        />
        <StatPreview
          label="Pending Cash"
          value={
            loading
              ? "..."
              : `${pendingCashCount.toLocaleString()} (₦${pendingCashValue.toLocaleString()})`
          }
        />
      </div>
    </div>
  );
}
