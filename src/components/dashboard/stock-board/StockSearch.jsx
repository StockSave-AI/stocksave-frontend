import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

export default function StockSearch({ onQueryChange }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onQueryChange(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, onQueryChange]);

  return (
    <div className="relative">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search stock items..."
        className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-300 outline-none"
      />
    </div>
  );
}
