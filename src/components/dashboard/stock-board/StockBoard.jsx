import { useState, useMemo } from "react";
import { FiShoppingCart, FiBox, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { StockCard } from "./StockCard";
import { StockAlerts } from "./StockAlerts";
import { RecentUpdates } from "./RecentUpdates";
import { StockCategory } from "./StockCategory";
import StockSearch from "./StockSearch";
import { useStockBoardData } from "../../hooks/useInventory";

const normalizeStockData = (response) => {
  const payload = response?.data ?? response ?? {};
  const source = Array.isArray(payload) ? { items: payload } : payload;
  const productsPayload = Array.isArray(source?.products) ? source.products : [];

  let rawItems =
    source.items || source.inventory || source.products || response?.items || [];
  const rawAlerts =
    source.low_stock_alerts || source.alerts || response?.alerts || [];
  let rawCategories =
    source.categories || response?.categories || [];

  const looksLikeCategoryPayload =
    Array.isArray(payload) &&
    payload.some((entry) => Array.isArray(entry?.products));

  if (looksLikeCategoryPayload) {
    rawCategories = payload.map((category) => ({
      id: category.id,
      name: category.category_name || category.name || "Others",
      products: category.products || [],
      count: Array.isArray(category.products) ? category.products.length : 0,
    }));

    rawItems = payload.flatMap((category) =>
      (category.products || []).flatMap((product) => {
        const productName = product.product_name || product.name || "Unnamed Item";
        const variants = product.variants || [];
        const productImage = product.image_url || product.image || "";

        if (variants.length === 0) {
          return [
            {
              id: product.id,
              name: productName,
              quantity: 0,
              image: productImage,
            },
          ];
        }

        return variants.map((variant) => ({
          id: variant.variant_id || variant.id,
          name: `${productName} (${variant.size_label || variant.size || "Default"})`,
          quantity:
            Number(
              variant.stock_quantity ??
                variant.available_slots ??
                variant.quantity ??
                0,
            ) || 0,
          image: productImage,
        }));
      }),
    );
  }

  if (!looksLikeCategoryPayload && productsPayload.length > 0) {
    rawCategories = Array.from(
      new Set(
        productsPayload.map((product) => {
          return (
            product?.category_name ||
            product?.category?.category_name ||
            product?.category?.name ||
            "Others"
          );
        }),
      ),
    ).map((name, index) => ({ id: index, name, count: 0 }));

    rawItems = productsPayload.flatMap((product, productIndex) => {
      const productName = product?.product_name || product?.name || "Unnamed Item";
      const variants = Array.isArray(product?.variants) ? product.variants : [];

      if (variants.length === 0) {
        return [
          {
            id: product?.id || product?.inventory_id || productIndex,
            name: productName,
            quantity:
              Number(
                product?.stock_quantity ??
                  product?.available_slots ??
                  product?.quantity ??
                  0,
              ) || 0,
            image: product?.image || product?.image_url || "",
          },
        ];
      }

      return variants.map((variant, variantIndex) => ({
        id:
          variant?.inventory_id ||
          variant?.variant_id ||
          variant?.id ||
          `${productIndex}-${variantIndex}`,
        name: `${productName} (${variant?.size_label || variant?.size || "Default"})`,
        quantity:
          Number(
            variant?.stock_quantity ??
              variant?.available_slots ??
              variant?.quantity ??
              0,
          ) || 0,
        image: product?.image || product?.image_url || "",
      }));
    });
  }

  return {
    items: rawItems
      .map((item, index) => ({
        id: item.id || item.inventory_id || index,
        name: item.name || item.product_name || item.item_name || "Unnamed Item",
        quantity:
          item.quantity ??
          item.available_slots ??
          item.total_slots ??
          item.available ??
          0,
        image: item.image || "",
      }))
      .filter((item) => Number(item.quantity) > 0),
    alerts: rawAlerts.map((alert, index) => ({
      id: alert.id || index,
      item: alert.item || alert.product_name || alert.name || "Low stock item",
      status:
        alert.status ||
        `Only ${alert.remaining_slots ?? alert.quantity ?? 0} left`,
    })),
    updates: source.updates || source.recent_updates || source.stock_updates || [],
    categories: rawCategories.map((category, index) => ({
      id: category.id || index,
      name: category.name || category.category || "Others",
      count:
        category.count ??
        category.products_count ??
        (Array.isArray(category.products) ? category.products.length : 0),
    })),
  };
};

const StockBoard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const stockBoardQuery = useStockBoardData();
  const stockData = useMemo(
    () => normalizeStockData(stockBoardQuery.data),
    [stockBoardQuery.data],
  );

  const filteredItems = useMemo(() => {
    return stockData.items.filter((item) =>
      String(item.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, stockData.items]);

  return (
    <div className="space-y-6 p-6 bg-neutral-50 min-h-screen">
      <div
        className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0"
        onClick={() => navigate("/dashboard/book-food")}
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">
            Shared Stock Board
          </h1>
          <p className="text-neutral-500 text-sm sm:text-base">
            View available food items and current inventory levels
          </p>
        </div>
        <button className="bg-primary-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center transition-colors">
          <FiShoppingCart size={20} />
          <span>Book Items</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white px-6 py-5 rounded-xl border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-neutral-400 uppercase font-semibold tracking-wide">
                Total Items
              </span>

              <p className="text-3xl font-bold text-neutral-800 mt-1">
                {stockData.items.length}
              </p>
            </div>

            <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
              <FiBox size={24} className="text-primary-600" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white px-6 py-5 rounded-xl border border-neutral-200 shadow-sm">
          <div className="w-full">
            <StockSearch onQueryChange={setSearchQuery} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
        {stockBoardQuery.isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full border-2 border-neutral-200 border-t-primary-500 animate-spin" />
          </div>
        ) : null}

        {!stockBoardQuery.isLoading && stockBoardQuery.isError ? (
          <div className="h-40 flex items-center justify-center text-sm text-error">
            Failed to load stock board data.
          </div>
        ) : null}

        {!stockBoardQuery.isLoading &&
        !stockBoardQuery.isError &&
        filteredItems.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-neutral-400">
            <FiSearch size={40} />
            <p className="mt-3 text-sm font-medium">No food available</p>
          </div>
        ) : null}

        {!stockBoardQuery.isLoading &&
        !stockBoardQuery.isError &&
        filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <StockCard key={item.id || index} item={item} />
            ))}
          </div>
        ) : null}
      </div>

      <StockAlerts alerts={stockData.alerts} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockCategory categories={stockData.categories} />
        <RecentUpdates
          updates={stockData.updates}
          isLoading={stockBoardQuery.isLoading}
          isError={stockBoardQuery.isError}
        />
      </div>
    </div>
  );
};

export default StockBoard;
