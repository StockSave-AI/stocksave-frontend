export const ChartCard = ({ title, children, loading, headerActions = null }) => (
  <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
      <div className="flex items-center gap-2">
        {headerActions}
        {loading ? <span className="text-xs text-neutral-500">Loading...</span> : null}
      </div>
    </div>
    {children}
  </div>
);

export const SectionTable = ({
  title,
  columns,
  rows,
  emptyText = "No data available.",
  headerActions = null,
  rowClassName,
}) => (
  <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
    <div className="mb-3 flex items-center justify-between gap-3">
      <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
      {headerActions}
    </div>
    {rows.length === 0 ? (
      <p className="text-sm text-neutral-500">{emptyText}</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-500 border-b border-neutral-200">
              {columns.map((column) => (
                <th key={column} className="py-2 pr-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={`row-${index}`}
                className={`border-b border-neutral-100 last:border-0 text-neutral-700 ${rowClassName ? rowClassName(index, row) : ""}`}
              >
                {row.map((cell, cellIndex) => (
                  <td key={`cell-${index}-${cellIndex}`} className="py-2 pr-3 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
