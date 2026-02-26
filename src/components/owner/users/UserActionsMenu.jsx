import { FiMoreVertical, FiPlusCircle } from "react-icons/fi";

export default function UserActionsMenu({
  user,
  align = "right",
  isOpen,
  onToggle,
  onViewDetails,
  onRecordDeposit,
  loading,
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
            disabled={loading}
            onClick={() => onRecordDeposit?.(user)}
            className="w-full text-left px-2.5 py-1.5 rounded-button text-xs text-neutral-700 hover:bg-neutral-50 inline-flex items-center gap-1.5"
          >
            <FiPlusCircle size={14} />
            Record Deposit
          </button>
        </div>
      ) : null}
    </div>
  );
}
