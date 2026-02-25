import { format } from "date-fns";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "MMM d, yyyy");
};

export default function InventoryBatchesModal({ open, onClose, variantName, query }) {
  if (!open) return null;

  const batches = query.data?.data?.batches || query.data?.batches || [];
  const total = query.data?.data?.total_remaining ?? query.data?.total_remaining;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        role="presentation"
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-500">FIFO Batches</p>
            <h3 className="text-lg font-semibold text-neutral-800">{variantName}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-sm text-neutral-500 hover:text-neutral-800 px-3 py-1 rounded-lg hover:bg-neutral-100"
          >
            Close
          </button>
        </div>

        {query.isLoading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-2 border-neutral-200 border-t-primary-500 animate-spin" />
          </div>
        ) : null}

        {!query.isLoading && query.isError ? (
          <div className="h-32 flex items-center justify-center text-sm text-error">
            Failed to load batches.
          </div>
        ) : null}

        {!query.isLoading && !query.isError ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-neutral-700">
              <span className="font-semibold">Total remaining:</span>
              <span className="text-primary-700 font-semibold">
                {typeof total === "number" ? total.toLocaleString() : "—"} slots
              </span>
            </div>

            {batches.length === 0 ? (
              <div className="h-28 flex items-center justify-center text-sm text-neutral-500">
                No batches yet for this variant.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-neutral-500 border-b">
                      <th className="py-2 pr-3">Batch ID</th>
                      <th className="py-2 pr-3">Added</th>
                      <th className="py-2 pr-3">Qty Added</th>
                      <th className="py-2 pr-3">Qty Remaining</th>
                      <th className="py-2 pr-3">Product</th>
                      <th className="py-2 pr-3">Variant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.map((batch) => (
                      <tr key={batch.id} className="border-b last:border-0">
                        <td className="py-2 pr-3 font-semibold text-neutral-800">
                          #{batch.id}
                        </td>
                        <td className="py-2 pr-3">{formatDate(batch.date_added)}</td>
                        <td className="py-2 pr-3">{batch.quantity_added?.toLocaleString?.() ?? batch.quantity_added}</td>
                        <td className="py-2 pr-3 text-primary-700 font-semibold">
                          {batch.quantity_remaining?.toLocaleString?.() ?? batch.quantity_remaining}
                        </td>
                        <td className="py-2 pr-3">{batch.product_name || "—"}</td>
                        <td className="py-2 pr-3">{batch.size_label || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
