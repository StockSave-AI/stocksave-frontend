import { toArray } from "./utils";

const StockMatchModal = ({ open, onClose, variantId, query }) => {
  if (!open) return null;
  const payload = query.data?.data || query.data || {};
  const batches = toArray(payload?.batches || payload);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        role="presentation"
      />
      <div className="relative w-full max-w-2xl bg-white rounded-card border border-yellow-200 shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-800">
            FIFO Stock Batches
          </h3>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-button border border-neutral-200 text-sm"
          >
            Close
          </button>
        </div>
        <p className="text-sm text-neutral-600 mb-3">Variant ID: {variantId}</p>

        {query.isLoading ? (
          <div className="h-24 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-2 border-neutral-200 border-t-yellow-500 animate-spin" />
          </div>
        ) : null}

        {!query.isLoading && query.isError ? (
          <div className="h-24 flex items-center justify-center text-sm text-error">
            Failed to load stock batches.
          </div>
        ) : null}

        {!query.isLoading && !query.isError && batches.length === 0 ? (
          <div className="h-24 flex items-center justify-center text-sm text-neutral-500">
            No available batches.
          </div>
        ) : null}

        {!query.isLoading && !query.isError && batches.length > 0 ? (
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            {batches.map((batch, index) => (
              <div
                key={batch?.stock_batch_id || batch?.id || index}
                className="rounded-xl border border-yellow-200 bg-yellow-50/40 p-3"
              >
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-neutral-800">
                    Batch #{batch?.stock_batch_id || batch?.id || index + 1}
                  </span>
                  <span className="text-neutral-500">
                    {batch?.date_added || "N/A"}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-neutral-700">
                  <span>Qty Remaining: {batch?.quantity_remaining ?? 0}</span>
                  <span>Product: {batch?.product_name || "N/A"}</span>
                  <span>Variant: {batch?.size_label || "N/A"}</span>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StockMatchModal;
