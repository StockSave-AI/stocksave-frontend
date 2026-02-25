const toNumber = (value) => Number(value ?? 0);

export const canAfford = (price, balance) => {
  const normalizedPrice = Number(price);
  const normalizedBalance = Number(balance ?? 0);
  const safePrice = Number.isFinite(normalizedPrice) ? normalizedPrice : 0;
  const safeBalance = Number.isFinite(normalizedBalance) ? normalizedBalance : 0;
  return safeBalance >= safePrice;
};

export const isBookableSize = (size = {}) => {
  const price = Number(size?.price ?? 0);
  const stock = Number(size?.available_slots ?? 0);
  const inventoryId = Number(size?.inventory_id ?? 0);
  return (
    Number.isFinite(price) &&
    price > 0 &&
    Number.isFinite(stock) &&
    stock > 0 &&
    Number.isFinite(inventoryId) &&
    inventoryId > 0
  );
};

const buildSize = ({ variant, fallback, inventoryLookup }) => {
  const image =
    variant?.image_url ||
    variant?.image ||
    fallback.image ||
    fallback.productImage ||
    "";

  return {
    label:
      variant?.size_label ||
      variant?.name ||
      variant?.label ||
      variant?.size ||
      fallback.label ||
      "Default",
    price: toNumber(variant?.price ?? fallback.price ?? 0),
    inventory_id:
      inventoryLookup?.[variant?.variant_id] ??
      inventoryLookup?.[variant?.id] ??
      inventoryLookup?.[variant?.product_variant_id] ??
      variant?.inventory_id ??
      fallback.inventory_id ??
      null,
    available_slots:
      toNumber(variant?.stock_quantity) ||
      toNumber(variant?.available_slots) ||
      toNumber(variant?.stock) ||
      fallback.available_slots ||
      0,
    image,
  };
};

const buildSizesFromVariants = (variants = [], fallback, inventoryLookup) => {
  if (variants.length === 0) {
    return [buildSize({ variant: {}, fallback, inventoryLookup })];
  }

  return variants.map((variant) =>
    buildSize({ variant, fallback, inventoryLookup }),
  );
};

export const normalizeFoodItems = (payload = [], inventoryLookup = {}) => {
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

  const categories =
    Array.isArray(rawPayload?.data) &&
    rawPayload.data.every((item) => item?.category_name)
      ? rawPayload.data
      : Array.isArray(rawPayload)
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
      const quantity = toNumber(
        item?.available_slots ?? item?.quantity ?? item?.total_slots ?? 0,
      );
      const inventoryId = item?.inventory_id ?? item?.id ?? null;

        const size = {
          label: item?.size_label || item?.variant_name || "Default",
          price: toNumber(item?.price),
          inventory_id: inventoryId,
          available_slots: quantity,
          image: item?.image || item?.image_url || "",
        };
        normalized.push({
          id: item?.id || inventoryId || index,
          name: item?.name || item?.product_name || item?.item_name || "Unnamed Item",
          category:
            item?.category_name || item?.category?.name || item?.category || "Others",
          available: quantity,
          unit: item?.unit || "slots",
          image: item?.image || item?.image_url || "",
          sizes: [size],
          bookable: isBookableSize(size),
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
        const fallbackPrice = toNumber(product?.price);
        const fallbackInventoryId =
          product?.inventory_id ?? null;
        const fallbackStock =
          toNumber(product?.available_slots) ||
          toNumber(product?.quantity) ||
          toNumber(product?.stock) ||
          0;

        const fallback = {
          price: fallbackPrice || 0,
          inventory_id: fallbackInventoryId,
          available_slots: fallbackStock,
          image: product?.image_url || product?.image || "",
          productImage: product?.image_url || product?.image || "",
          label: "Default",
        };

        const sizes = buildSizesFromVariants(variants, fallback, inventoryLookup);

        const bookable = sizes.some((size) => isBookableSize(size));
        normalized.push({
          id:
            product?.id ||
            fallbackInventoryId ||
            `${categoryIndex}-${productIndex}`,
          name: product?.product_name || product?.name || "Unnamed Item",
          category: categoryName,
          available: fallbackStock,
          unit: product?.unit || "slots",
          image: product?.image_url || product?.image || "",
          sizes,
          bookable,
        });
      });
    });
    return normalized;
  }

  if (productList.length > 0) {
    productList.forEach((product, productIndex) => {
      const variants = product?.variants || product?.sizes || [];
      const categoryName =
        product?.category_name ||
        product?.category?.category_name ||
        product?.category?.name ||
        "Others";
      const fallbackPrice = toNumber(product?.price);
      const fallbackInventoryId =
        product?.inventory_id ?? null;
      const fallbackStock =
        toNumber(product?.available_slots) ||
        toNumber(product?.stock_quantity) ||
        toNumber(product?.quantity) ||
        toNumber(product?.stock) ||
        0;

      const fallback = {
        price: fallbackPrice || 0,
        inventory_id: fallbackInventoryId,
        available_slots: fallbackStock,
        image: product?.image_url || product?.image || "",
        productImage: product?.image_url || product?.image || "",
        label: "Default",
      };

      const sizes = buildSizesFromVariants(variants, fallback, inventoryLookup);

      const bookable = sizes.some((size) => isBookableSize(size));
      normalized.push({
        id: product?.id || fallbackInventoryId || productIndex,
        name: product?.product_name || product?.name || "Unnamed Item",
        category: categoryName,
        available: fallbackStock,
        unit: product?.unit || "slots",
        image: product?.image || product?.image_url || "",
        sizes,
        bookable,
      });
    });
    return normalized;
  }

  return normalized;
};
