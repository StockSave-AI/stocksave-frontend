import { FiBox } from "react-icons/fi";

export const RecentUpdates = ({ updates = [], isLoading = false, isError = false }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200">
      <h3 className="text-neutral-500 font-semibold mb-4 text-sm uppercase">
        Recent Stock Updates
      </h3>
      {isLoading ? (
        <div className="h-36 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-neutral-200 border-t-primary-500 animate-spin" />
        </div>
      ) : null}

      {!isLoading && isError ? (
        <div className="h-36 flex items-center justify-center text-sm text-error">
          Failed to load stock updates.
        </div>
      ) : null}

      {!isLoading && !isError && updates.length === 0 ? (
        <div className="h-36 flex items-center justify-center text-sm text-neutral-500">
          No updates here yet.
        </div>
      ) : null}

      {!isLoading && !isError && updates.length > 0 ? (
        <div className="divide-y divide-neutral-100">
          {updates.slice(0, 5).map((update, i) => (
            <div
              key={update.id || i}
              className="py-3 flex justify-between items-center"
            >
              <div className="flex gap-3 items-center">
                <FiBox className="w-8 h-8 text-neutral-400" />
                <div>
                  <p className="text-sm font-bold">{update.title}</p>
                  <p className="text-xs text-neutral-500">{update.desc}</p>
                </div>
              </div>
              <span className="text-[10px] text-neutral-400">{update.time}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
