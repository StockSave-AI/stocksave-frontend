import { useMemo, useState } from "react";
import { FiBarChart2, FiBox, FiLayers } from "react-icons/fi";
import {
  useInventoryCategories,
  useInventoryList,
  useStockBatches,
} from "../../hooks/useInventory";
import { formatCurrency } from "../../../utils/currency";
import AddInventoryForm from "./AddInventoryForm";
import InventoryBatchesModal from "./InventoryBatchesModal";

const flattenVariants = (categoriesRaw) => {
  const categories = Array.isArray(categoriesRaw?.categories)
    ? categoriesRaw.categories
    : Array.isArray(categoriesRaw)
      ? categoriesRaw
      : [];

  const list = [];
  categories.forEach((cat) => {
    const category = cat?.category_name || cat?.name || "Uncategorized";
    (cat?.products || []).forEach((product) => {
      const productName = product?.product_name || product?.name || "Unnamed";
      const image = product?.image_url;
      (product?.variants || []).forEach((variant) => {
        list.push({
          variant_id: variant?.variant_id || variant?.id,
          size_label: variant?.size_label || variant?.name,
          price: variant?.price,
          total_remaining:
            variant?.total_remaining ??
            variant?.totalRemaining ??
            product?.total_remaining ??
            product?.totalRemaining ??
            null,
          stock_quantity: variant?.stock_quantity,
          product_name: productName,
          category,
          image,
        });
      });
    });
  });
  return list;
};

function VariantCard({ variant, onViewBatches, slotsOverride }) {
  const displayedSlots =
    slotsOverride !== null && slotsOverride !== undefined
      ? Number(slotsOverride)
      : variant?.total_remaining !== null && variant?.total_remaining !== undefined
        ? Number(variant.total_remaining)
        : Number(variant?.stock_quantity ?? 0);

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {variant.image ? (
        <div className="h-40 w-full overflow-hidden">
          <img
            src={variant.image}
            alt={variant.product_name}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="h-40 w-full bg-neutral-100 flex items-center justify-center text-neutral-400">
          <FiBox size={28} />
        </div>
      )}

      <div className="p-4 space-y-2 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500">{variant.category}</p>
            <h3 className="text-base font-semibold text-neutral-800">{variant.product_name}</h3>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-100">
            {variant.size_label}
          </span>
        </div>
        <p className="text-sm text-neutral-600">Price: {formatCurrency(variant.price)}</p>
        <p className="text-sm text-neutral-600">
          Stock:{" "}
          <span className="font-semibold text-primary-700">
            {(Number.isFinite(displayedSlots) ? displayedSlots : 0).toLocaleString()} slots
          </span>
        </p>
      </div>

      <div className="p-4 pt-0 flex gap-2">
        <button
          onClick={() => onViewBatches(variant)}
          className="flex-1 px-3 py-2 text-sm font-semibold rounded-lg border border-neutral-200 hover:bg-neutral-50 transition flex items-center justify-center gap-2"
        >
          <FiLayers />
          View FIFO batches
        </button>
      </div>
    </div>
  );
}

export default function OwnerInventory() {
  const categoriesQuery = useInventoryCategories();
  const inventoryListQuery = useInventoryList();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showAddInventory, setShowAddInventory] = useState(true);
  const batchesQuery = useStockBatches(selectedVariant?.variant_id, Boolean(selectedVariant));

  const variants = useMemo(
    () => flattenVariants(categoriesQuery.data?.data || categoriesQuery.data || []),
    [categoriesQuery.data],
  );
  const inventorySlotMap = useMemo(() => {
    const raw = inventoryListQuery.data?.data || inventoryListQuery.data || [];
    const items =
      raw?.items ||
      raw?.inventory ||
      (Array.isArray(raw) ? raw : raw?.data) ||
      [];
    const map = new Map();
    if (!Array.isArray(items)) return map;

    items.forEach((item) => {
      const variantId =
        item?.product_variant_id ??
        item?.variant_id ??
        item?.variantId ??
        item?.product_variant ??
        null;
      if (!variantId) return;
      const total =
        item?.total_remaining ??
        item?.quantity_remaining ??
        item?.available_slots ??
        item?.stock_quantity ??
        item?.total_slots ??
        null;
      const parsed = Number(total);
      if (!Number.isFinite(parsed)) return;
      map.set(Number(variantId), parsed);
    });
    return map;
  }, [inventoryListQuery.data]);

  const hasData = variants.length > 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-card border border-neutral-100 shadow-card p-6">
        <div className="flex items-start justify-between flex-col sm:flex-row gap-3">
          <div>
            <p className="text-xs text-neutral-500 uppercase">Inventory</p>
            <h2 className="text-2xl font-semibold text-neutral-800">Manage Stock and FIFO Batches</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Add batches, view remaining slots, and track consumption order.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <FiBarChart2 className="text-primary-600" />
            <span>{hasData ? `${variants.length} variants` : "No variants loaded"}</span>
          </div>
        </div>
      </div>

      <section className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-neutral-800">Add Inventory Batch</h3>
          <button
            type="button"
            onClick={() => setShowAddInventory((prev) => !prev)}
            className="px-3 py-1.5 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition"
          >
            {showAddInventory ? "Hide" : "Show"}
          </button>
        </div>
        {showAddInventory ? (
          <div className="max-w-2xl mt-4">
            <AddInventoryForm />
          </div>
        ) : (
          <p className="text-sm text-neutral-500 mt-4">
            Add Inventory panel is hidden.
          </p>
        )}
      </section>

      <section className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-neutral-800">All Variants</h3>
          {categoriesQuery.isLoading ? (
            <span className="text-xs text-neutral-500">Loading...</span>
          ) : null}
        </div>

        {categoriesQuery.isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="h-9 w-9 rounded-full border-2 border-neutral-200 border-t-primary-500 animate-spin" />
          </div>
        ) : null}

        {!categoriesQuery.isLoading && categoriesQuery.isError ? (
          <div className="h-48 flex items-center justify-center text-sm text-error">
            Failed to load inventory.
          </div>
        ) : null}

        {!categoriesQuery.isLoading && !categoriesQuery.isError && variants.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-sm text-neutral-500">
            No inventory found. Add a batch to get started.
          </div>
        ) : null}

        {!categoriesQuery.isLoading && !categoriesQuery.isError && variants.length > 0 ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {variants.map((variant) => (
              <VariantCard
                key={variant.variant_id}
                variant={variant}
                onViewBatches={setSelectedVariant}
                slotsOverride={inventorySlotMap.get(Number(variant.variant_id))}
              />
            ))}
          </div>
        ) : null}
      </section>

      <InventoryBatchesModal
        open={Boolean(selectedVariant)}
        onClose={() => setSelectedVariant(null)}
        variantName={
          selectedVariant
            ? `${selectedVariant.product_name} - ${selectedVariant.size_label}`
            : ""
        }
        query={batchesQuery}
      />
    </div>
  );
}
