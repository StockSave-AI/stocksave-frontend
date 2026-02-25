function StatPreview({ label, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 shadow-md min-h-[110px] flex flex-col justify-center">
      <p className="text-sm text-indigo-100 truncate">{label}</p>
      <p className="text-2xl font-semibold mt-2 break-words">{value}</p>
    </div>
  );
}

export default function OwnerDashboardHeader({ stats, loading }) {
  const totalUsers = Number(stats?.total_users || 0);
  const activeUsers = Number(stats?.active_users || 0);
  const totalDeposits = Number(stats?.total_deposits || 0);
  const totalWithdrawals = Number(stats?.total_withdrawals || 0);
  const pendingTransactions = Number(stats?.pending_transactions || 0);
  const totalBookings = Number(stats?.total_bookings || 0);

  return (
    <div className="w-full bg-gradient-to-r from-secondary-700 to-indigo-700 text-white rounded-2xl p-8 shadow-xl">
      <h1 className="text-3xl md:text-4xl font-bold">Owner Dashboard</h1>

      <p className="mt-2 text-sm md:text-base text-indigo-100">
        Manage your platform, users, and inventory
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <StatPreview
          label="Total Users"
          value={loading ? "..." : totalUsers.toLocaleString()}
        />

        <StatPreview
          label="Active Users"
          value={loading ? "..." : activeUsers.toLocaleString()}
        />

        <StatPreview
          label="Total Deposits"
          value={loading ? "..." : `₦${totalDeposits.toLocaleString()}`}
        />

        <StatPreview
          label="Total Withdrawals"
          value={loading ? "..." : `₦${totalWithdrawals.toLocaleString()}`}
        />

        <StatPreview
          label="Pending Transactions"
          value={loading ? "..." : pendingTransactions.toLocaleString()}
        />

        <StatPreview
          label="Total Bookings"
          value={loading ? "..." : totalBookings.toLocaleString()}
        />
      </div>
    </div>
  );
}
