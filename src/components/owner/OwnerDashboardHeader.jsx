import { Link } from "react-router-dom";
import { FiBarChart2 } from "react-icons/fi";
import { getAuthToken } from "../../utils/authStorage";

const getOwnerNameFromToken = () => {
  try {
    const token = getAuthToken();
    const payloadPart = token?.split(".")?.[1];
    if (!payloadPart) return "";
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(normalized));
    const first =
      payload?.first_name || payload?.user?.first_name || payload?.user?.firstName || "";
    const last =
      payload?.last_name || payload?.user?.last_name || payload?.user?.lastName || "";
    const joined = `${first} ${last}`.trim();
    return joined || payload?.name || payload?.user?.name || "";
  } catch {
    return "";
  }
};

function StatPreview({ label, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 shadow-md min-h-[110px] flex flex-col justify-center">
      <p className="text-sm text-indigo-100 truncate">{label}</p>
      <p className="text-2xl font-semibold mt-2 break-words">{value}</p>
    </div>
  );
}

export default function OwnerDashboardHeader({ stats, loading, ownerName: ownerNameProp }) {
  const totalUsers = Number(stats?.total_users || 0);
  const activeUsers = Number(stats?.active_users || 0);
  const totalDeposits = Number(stats?.total_deposits || 0);
  const totalWithdrawals = Number(stats?.total_withdrawals || 0);
  const pendingTransactions = Number(stats?.pending_transactions || 0);
  const totalBookings = Number(stats?.total_bookings || 0);
  const tokenName = getOwnerNameFromToken();
  const ownerName =
    ownerNameProp ||
    stats?.owner_name ||
    stats?.name ||
    stats?.first_name ||
    stats?.owner?.first_name ||
    stats?.profile?.first_name ||
    tokenName ||
    "Owner";

  return (
    <div className="w-full bg-gradient-to-r from-secondary-700 to-indigo-700 text-white rounded-2xl p-8 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl md:text-4xl font-bold">{ownerName}</h1>
        <Link
          to="/owner/analytics"
          className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white border border-white/25 hover:bg-white/25 transition"
        >
          <FiBarChart2 size={15} />
          <span>See Analytics</span>
        </Link>
      </div>

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
