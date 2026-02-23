import { formatCurrency } from "../../../utils/currency";
import { fullName } from "./userHelpers";

export default function UserDetailsModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-card border border-neutral-100 shadow-card w-full max-w-md p-5">
        <h3 className="text-lg font-semibold text-neutral-800">User Details</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-neutral-600">
          <div>
            <p className="text-neutral-400">Name</p>
            <p className="font-medium text-neutral-800">{fullName(user)}</p>
          </div>
          <div>
            <p className="text-neutral-400">Email</p>
            <p className="font-medium text-neutral-800">{user.email || "-"}</p>
          </div>
          <div>
            <p className="text-neutral-400">Phone</p>
            <p className="font-medium text-neutral-800">{user.phone || "-"}</p>
          </div>
          <div>
            <p className="text-neutral-400">Current Balance</p>
            <p className="font-medium text-neutral-800">
              {formatCurrency(user.currentBalance)}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-button border border-neutral-200 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
