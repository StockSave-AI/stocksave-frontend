import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useInventoryCategories } from "../../hooks/useInventory";
import { addInventoryBatch } from "../../services/inventory";

export default function AddInventoryForm() {
  const queryClient = useQueryClient();
  const categoriesQuery = useInventoryCategories();
  const [variantId, setVariantId] = useState("");
  const [slots, setSlots] = useState("");

  const variants = useMemo(() => {
    const raw = categoriesQuery.data?.data || categoriesQuery.data || [];
    const categories = Array.isArray(raw?.categories) ? raw.categories : raw;
    if (!Array.isArray(categories)) return [];

    const list = [];
    categories.forEach((cat) => {
      const catName =
        cat?.category_name || cat?.name || cat?.category || "Uncategorized";
      (cat?.products || []).forEach((product) => {
        const productName = product?.product_name || product?.name || "Unnamed";
        (product?.variants || []).forEach((variant) => {
          list.push({
            id: variant?.variant_id || variant?.id,
            label: `${catName} � ${productName} � ${variant?.size_label || variant?.name || "Variant"}`,
          });
        });
      });
    });
    return list.filter((v) => v.id);
  }, [categoriesQuery.data]);

  const mutation = useMutation({
    mutationFn: ({ product_variant_id, total_slots }) =>
      addInventoryBatch({ product_variant_id, total_slots }),
    onSuccess: async () => {
      toast.success("Inventory batch added");
      setSlots("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["inventory-list"] }),
        queryClient.invalidateQueries({ queryKey: ["inventory-categories"] }),
        queryClient.invalidateQueries({ queryKey: ["food-items"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to add inventory");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mutation.isPending) return;
    const product_variant_id = Number(variantId);
    const total_slots = Number(slots);
    if (!product_variant_id || total_slots <= 0) {
      toast.error("Select a variant and enter slots > 0");
      return;
    }
    mutation.mutate({ product_variant_id, total_slots });
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        {categoriesQuery.isLoading ? (
          <span className="text-xs text-neutral-500">Loading variants�</span>
        ) : null}
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral-600">
            Variant
          </label>
          <select
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
            disabled={categoriesQuery.isLoading || mutation.isPending}
          >
            <option value="">Select variant</option>
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral-600">
            Total slots
          </label>
          <input
            type="number"
            min="1"
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
            value={slots}
            onChange={(e) => setSlots(e.target.value)}
            disabled={mutation.isPending}
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-primary-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-60"
        >
          {mutation.isPending ? "Adding..." : "Add Inventory"}
        </button>
      </form>
    </div>
  );
}
