import { FiCopy } from "react-icons/fi";

export default function ApprovalCodeModal({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-card border border-neutral-100 shadow-card w-full max-w-sm p-5">
        <h3 className="text-base font-semibold text-neutral-800">Approval Code Generated</h3>
        <p className="text-xs text-neutral-500 mt-1">
          Share this code with the customer to complete cash approval.
        </p>
        <div className="mt-4 p-4 rounded-card border border-neutral-200 bg-neutral-50">
          <p className="text-xs text-neutral-500">Transaction ID</p>
          <p className="font-semibold text-neutral-800">{data.transactionId}</p>
          <p className="text-xs text-neutral-500 mt-3">Approval Code</p>
          <p className="text-2xl font-bold tracking-wider text-primary-600">{data.code}</p>
        </div>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(String(data.code || ""))}
            className="flex-1 px-3 py-2 rounded-button border border-neutral-200 text-sm inline-flex items-center justify-center gap-2"
          >
            <FiCopy size={14} />
            Copy Code
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-3 py-2 rounded-button bg-primary-500 text-white text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
