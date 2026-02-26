import CategoryFilter from "./CategoryFilter";
import FoodItemCard from "./FoodItemCard";

export default function AvailableFoodSection({
  categories,
  selectedCategory,
  onSelectCategory,
  isLoading,
  isError,
  foodItems,
  onAddToCart,
  userBalance = 0,
  onLockedAction,
  stockAlerts = [],
}) {
  const filteredItems = foodItems.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory,
  );

  return (
    <>
      <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
        <p className="text-sm font-semibold text-neutral-600 mb-4">Filter by Category</p>
        <CategoryFilter
          active={selectedCategory}
          setActive={onSelectCategory}
          categories={categories}
        />
      </div>

      <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
        <h3 className="text-neutral-500 font-semibold mb-6 text-sm uppercase">
          Available Food Items
        </h3>
        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full border-2 border-neutral-200 border-t-primary-500 animate-spin" />
          </div>
        ) : null}

        {!isLoading && isError ? (
          <div className="h-40 flex items-center justify-center text-sm text-error">
            Failed to load available food.
          </div>
        ) : null}

        {!isLoading && !isError ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8 xl:gap-x-10">
            {filteredItems.map((item) => (
              <FoodItemCard
                key={item.id}
                item={item}
                onAddToCart={onAddToCart}
                userBalance={userBalance}
                onLockedAction={onLockedAction}
                stockAlerts={stockAlerts}
              />
            ))}
          </div>
        ) : null}

        {!isLoading && !isError && filteredItems.length === 0 ? (
          <div className="h-28 flex items-center justify-center text-sm text-neutral-500">
            No food available
          </div>
        ) : null}
      </div>
    </>
  );
}
