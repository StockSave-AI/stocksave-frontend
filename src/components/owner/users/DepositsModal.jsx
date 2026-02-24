import { FiKey } from "react-icons/fi";
import { formatCurrency } from "../../../utils/currency";
import { formatDisplayDate } from "../../../utils/date";
import {
  asList,
  fullName,
  isPaystackPending,
  isPendingCashDeposit,
  isPendingDeposit,
} from "./userHelpers";

export default function DepositsModal({
  user,
  onClose,
  onApprove,
  onReject,
  onVerify,
  onGenerateCode,
  generatingCode,
  updating,
  verifying,
}) {
  if (!user) return null;

  const deposits = asList(user.transactions).filter((tx) => {
    const type = String(tx?.type || tx?.transaction_type || "").toLowerCase();
    return !type.includes("withdraw");
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-card border border-neutral-100 shadow-card w-full max-w-4xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-800">
            Deposits - {fullName(user)}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-button border border-neutral-200 text-sm"
          >
            Close
          </button>
        </div>
        <p className="text-xs text-neutral-500 mt-2">
          Showing recent cash deposits available to owner access.
        </p>

        {deposits.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-neutral-500 text-sm">
            No deposits for this user.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-neutral-500 border-b border-neutral-100">
                  <th className="py-3">Date</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Method</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((tx, index) => (
                  <tr key={tx?.id || index} className="border-b border-neutral-100">
                    <td className="py-3 text-neutral-700">
                      {formatDisplayDate(tx?.created_at || tx?.date, "-")}
                    </td>
                    <td className="py-3 font-medium text-neutral-800">
                      {formatCurrency(tx?.amount)}
                    </td>
                    <td className="py-3">{tx?.method || "-"}</td>
                    <td className="py-3">{tx?.status || "-"}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => onApprove(tx)}
                          disabled={updating || !isPendingDeposit(tx)}
                          className="px-3 py-1 rounded-button bg-primary-500 text-white disabled:opacity-40"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => onReject(tx)}
                          disabled={updating || !isPendingDeposit(tx)}
                          className="px-3 py-1 rounded-button bg-red-500 text-white disabled:opacity-40"
                        >
                          Reject
                        </button>
                        {isPaystackPending(tx) ? (
                          <button
                            type="button"
                            onClick={() => onVerify(tx)}
                            disabled={verifying}
                            className="px-3 py-1 rounded-button bg-yellow-500 text-white disabled:opacity-40"
                          >
                            Verify
                          </button>
                        ) : null}
                        {isPendingCashDeposit(tx) ? (
                          <button
                            type="button"
                            onClick={() => onGenerateCode(tx)}
                            disabled={generatingCode}
                            className="px-3 py-1 rounded-button bg-indigo-500 text-white disabled:opacity-40 inline-flex items-center gap-1"
                          >
                            <FiKey size={12} />
                            Generate Code
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
