import { formatCurrency } from "../../../utils/currency";
import { fullName } from "./userHelpers";

const resolveBalance = (user) => {
  const raw = user?.balance ?? user?.currentBalance ?? 0;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function UserDetailsModal({ user, loading, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-card border border-neutral-100 shadow-card w-full max-w-lg p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-neutral-900">User Details</h3>
            <p className="text-xs text-neutral-500 mt-1">Customer profile and account summary</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary-50 text-primary-700 border border-primary-100">
            {user?.status || "Active"}
          </span>
        </div>

        {loading ? (
          <p className="mt-2 text-xs text-neutral-500">Loading latest user details...</p>
        ) : null}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-neutral-600">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-neutral-400">Name</p>
            <p className="font-semibold text-neutral-800 mt-1">{fullName(user)}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-neutral-400">Email</p>
            <p className="font-medium text-neutral-800 mt-1 break-all">{user.email || "-"}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-neutral-400">Phone</p>
            <p className="font-medium text-neutral-800 mt-1">{user.phone || "-"}</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-emerald-700">Current Balance</p>
            <p className="font-medium text-neutral-800">
              {formatCurrency(resolveBalance(user))}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-button border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
