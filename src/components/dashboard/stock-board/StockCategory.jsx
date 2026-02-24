import {
  GiCannedFish,
  GiFishCooked,
  GiSaltShaker,
  GiWheat,
} from "react-icons/gi";

const iconMap = {
  grains: GiWheat,
  proteins: GiFishCooked,
  "canned goods": GiCannedFish,
  condiments: GiSaltShaker,
};

export const StockCategory = ({ categories = [] }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200">
      <h3 className="text-neutral-500 font-semibold mb-6 text-sm uppercase">
        Stock by Category
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category, index) => {
          const Icon =
            iconMap[String(category.name || "").toLowerCase()] || GiWheat;
          return (
            <div
              key={category.id || category.name || index}
              className="border border-neutral-200 rounded-lg p-4 flex flex-col items-center text-center hover:border-blue-300 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-3">
                <Icon size={24} className="text-blue-500" />
              </div>
              <p className="text-neutral-800 font-semibold text-sm">
                {category.name}
              </p>
              <p className="text-neutral-500 text-xs">{category.count} items</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
