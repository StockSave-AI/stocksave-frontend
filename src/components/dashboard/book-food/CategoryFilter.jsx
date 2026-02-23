import { FiFilter } from "react-icons/fi";

const CategoryFilter = ({ active, setActive, categories = [] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActive(cat)}
          className={`px-4 py-1.5 rounded-md text-xs font-medium border transition-all flex items-center gap-1 ${
            active === cat
              ? "bg-neutral-800 text-white border-neutral-800"
              : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400"
          }`}
        >
          <FiFilter
            size={14}
            className={active === cat ? "text-white" : "text-neutral-400"}
          />
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
