import { FiCheckCircle, FiKey, FiMoreVertical, FiXCircle } from "react-icons/fi";
import { isPendingCashDeposit } from "./userHelpers";

export default function UserActionsMenu({
  user,
  align = "right",
  isOpen,
  onToggle,
  onViewDetails,
  onViewDeposits,
  isPending,
  pendingDeposit,
  pendingPaystack,
  onApprove,
  onReject,
  onVerify,
  onGenerateCode,
  updating,
  verifying,
  generatingCode,
}) {
  const menuPositionClass = align === "left" ? "left-0" : "right-0";

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={onToggle}
        className="h-8 w-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50"
      >
        <FiMoreVertical size={16} />
      </button>

      {isOpen ? (
        <div className={`absolute ${menuPositionClass} mt-2 w-36 bg-white border border-neutral-200 rounded-card shadow-card z-20 p-1.5 space-y-1`}>
          <button
            type="button"
            onClick={() => onViewDetails(user)}
            className="w-full text-left px-2.5 py-1.5 rounded-button text-xs text-neutral-700 hover:bg-neutral-50"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={() => onViewDeposits(user)}
            className="w-full text-left px-2.5 py-1.5 rounded-button text-xs text-neutral-700 hover:bg-neutral-50"
          >
            View Deposits
          </button>

          {isPending && pendingDeposit ? (
            <>
              <button
                type="button"
                disabled={updating}
                onClick={() => onApprove(pendingDeposit)}
                className="w-full text-left px-2.5 py-1.5 rounded-button text-xs bg-primary-500 text-white disabled:opacity-40 inline-flex items-center gap-1.5"
              >
                <FiCheckCircle size={14} />
                Approve
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={() => onReject(pendingDeposit)}
                className="w-full text-left px-2.5 py-1.5 rounded-button text-xs bg-red-500 text-white disabled:opacity-40 inline-flex items-center gap-1.5"
              >
                <FiXCircle size={14} />
                Reject
              </button>
            </>
          ) : null}

          {pendingPaystack ? (
            <button
              type="button"
              disabled={verifying}
              onClick={() => onVerify(pendingPaystack)}
              className="w-full text-left px-2.5 py-1.5 rounded-button text-xs bg-yellow-500 text-white disabled:opacity-40"
            >
              Verify
            </button>
          ) : null}

          {isPending && pendingDeposit && isPendingCashDeposit(pendingDeposit) ? (
            <button
              type="button"
              disabled={generatingCode}
              onClick={() => onGenerateCode(pendingDeposit)}
              className="w-full text-left px-2.5 py-1.5 rounded-button text-xs bg-indigo-500 text-white disabled:opacity-40 inline-flex items-center gap-1.5"
            >
              <FiKey size={14} />
              Generate Code
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
