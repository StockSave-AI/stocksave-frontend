import { FiBox } from "react-icons/fi";

export const RecentUpdates = ({ updates = [], isLoading = false, isError = false }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-neutral-600 font-semibold text-sm uppercase tracking-wide">
          Recent Stock Updates
        </h3>
        <span className="text-[11px] px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold">
          Live Alerts
        </span>
      </div>
      <p className="text-xs text-neutral-500 mb-4">
        Fresh inventory updates from recent stock activity.
      </p>
      <h3 className="sr-only">
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
        <div className="space-y-3">
          {updates.slice(0, 5).map((update, i) => (
            <div
              key={update.id || i}
              className="p-3 rounded-xl border border-amber-200 bg-amber-50/70 flex justify-between items-start gap-3"
            >
              <div className="flex gap-3 items-start min-w-0">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <FiBox className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-800">{update.title}</p>
                  <p className="text-xs text-neutral-600 break-words">{update.desc}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[10px] text-neutral-500">{update.time}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-amber-200 text-amber-700 font-medium">
                  Stock Alert
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
