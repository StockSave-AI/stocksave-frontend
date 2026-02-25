export default function DeleteAccountModal({
  isOpen,
  account,
  isDeleting,
  onConfirm,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        role="presentation"
      />
      <div className="relative w-full max-w-md bg-white rounded-card border border-neutral-200 shadow-card p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-800">
            Delete Bank Account
          </h3>
          <p className="text-sm text-neutral-500 mt-1">
            This will remove{" "}
            <span className="font-medium text-neutral-700">
              {account?.bankName || "selected bank"} • ****
              {String(account?.accountNumber || "").slice(-4)}
            </span>{" "}
            from saved accounts.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-button border border-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-50"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-button bg-error text-white font-semibold hover:opacity-95 disabled:opacity-60"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
