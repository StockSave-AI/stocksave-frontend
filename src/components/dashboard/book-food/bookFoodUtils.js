export const normalizeFoodItems = (payload = []) => {
  const rawPayload = payload?.data || payload;
  const inventoryItems = Array.isArray(rawPayload?.items)
    ? rawPayload.items
    : Array.isArray(rawPayload?.inventory)
      ? rawPayload.inventory
      : Array.isArray(rawPayload)
        ? rawPayload.filter(
            (entry) =>
              !Array.isArray(entry?.products) &&
              (entry?.inventory_id !== undefined ||
                entry?.available_slots !== undefined ||
                entry?.total_slots !== undefined),
          )
        : [];
  const categories = Array.isArray(rawPayload)
    ? rawPayload
    : rawPayload?.categories || [];
  const productList = Array.isArray(rawPayload?.products)
    ? rawPayload.products
    : !Array.isArray(rawPayload) && Array.isArray(rawPayload?.data)
      ? rawPayload.data
      : [];

  const normalized = [];

  if (inventoryItems.length > 0) {
    inventoryItems.forEach((item, index) => {
      const quantity = Number(
        item?.available_slots ?? item?.quantity ?? item?.total_slots ?? 0,
      );
      const inventoryId = item?.inventory_id ?? item?.id ?? null;

      normalized.push({
        id: item?.id || inventoryId || index,
        name: item?.name || item?.product_name || item?.item_name || "Unnamed Item",
        category:
          item?.category_name || item?.category?.name || item?.category || "Others",
        available: quantity,
        unit: item?.unit || "slots",
        image: item?.image || item?.image_url || "",
        sizes: [
          {
            label: item?.size_label || item?.variant_name || "Default",
            price: Number(item?.price || 0),
            inventory_id: inventoryId,
            available_slots: quantity,
          },
        ],
      });
    });

    return normalized;
  }

  if (categories.length > 0) {
    categories.forEach((category, categoryIndex) => {
      const categoryName =
        category?.category_name ||
        category?.name ||
        category?.category ||
        `Category ${categoryIndex + 1}`;
      const products = category?.products || category?.items || [];

      products.forEach((product, productIndex) => {
        const variants = product?.variants || product?.sizes || [];
        const fallbackPrice = Number(product?.price || 0);
        const fallbackInventoryId = product?.inventory_id || null;
        const fallbackStock =
          product?.available_slots || product?.quantity || product?.stock || 0;

        const sizes =
          variants.length > 0
            ? variants.map((variant, variantIndex) => ({
                label:
                  variant?.size_label ||
                  variant?.name ||
                  variant?.label ||
                  variant?.size ||
                  `Variant ${variantIndex + 1}`,
                price: Number(variant?.price || 0),
                inventory_id: variant?.inventory_id || fallbackInventoryId || null,
                available_slots:
                  variant?.stock_quantity ||
                  variant?.available_slots ||
                  variant?.stock ||
                  fallbackStock ||
                  0,
              }))
            : [
                {
                  label: "Default",
                  price: fallbackPrice,
                  inventory_id: fallbackInventoryId || null,
                  available_slots: fallbackStock || 0,
                },
              ];

        normalized.push({
          id:
            product?.id ||
            fallbackInventoryId ||
            `${categoryIndex}-${productIndex}`,
          name: product?.product_name || product?.name || "Unnamed Item",
          category: categoryName,
          available: fallbackStock,
          unit: product?.unit || "slots",
          image: product?.image || product?.image_url || "",
          sizes,
        });
      });
    });
    return normalized;
  }

  productList.forEach((product, productIndex) => {
    const variants = product?.variants || product?.sizes || [];
    const categoryName =
      product?.category_name ||
      product?.category?.category_name ||
      product?.category?.name ||
      "Others";
    const fallbackPrice = Number(product?.price || 0);
    const fallbackInventoryId = product?.inventory_id || null;
    const fallbackStock =
      product?.available_slots ||
      product?.stock_quantity ||
      product?.quantity ||
      product?.stock ||
      0;

    const sizes =
      variants.length > 0
        ? variants.map((variant, variantIndex) => ({
            label:
              variant?.size_label ||
              variant?.name ||
              variant?.label ||
              variant?.size ||
              `Variant ${variantIndex + 1}`,
            price: Number(variant?.price || fallbackPrice || 0),
            inventory_id: variant?.inventory_id || fallbackInventoryId || null,
            available_slots:
              variant?.available_slots ||
              variant?.stock_quantity ||
              variant?.stock ||
              fallbackStock ||
              0,
          }))
        : [
            {
              label: "Default",
              price: fallbackPrice,
              inventory_id: fallbackInventoryId || null,
              available_slots: fallbackStock || 0,
            },
          ];

    normalized.push({
      id: product?.id || fallbackInventoryId || productIndex,
      name: product?.product_name || product?.name || "Unnamed Item",
      category: categoryName,
      available: fallbackStock,
      unit: product?.unit || "slots",
      image: product?.image || product?.image_url || "",
      sizes,
    });
  });

  return normalized;
};
