import { useState } from "react";
import { formatCurrency } from "../../utils/currency";

function ProgressBar({ title, saved = 0, goal = 0, color = "primary", subtitle }) {
  const percent = goal > 0 ? Math.min(Math.round((saved / goal) * 100), 100) : 0;
  const remaining = goal - saved > 0 ? goal - saved : 0;

  const percentageStyles =
    color === "secondary" ? "bg-blue-100 text-blue-600" : "bg-success/10 text-success";
  const progressColor = color === "secondary" ? "bg-blue-500" : "bg-success";

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm items-start">
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-neutral-500 text-xs">
            {subtitle || `${formatCurrency(remaining)} remaining to reach your goal`}
          </p>
        </div>

        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${percentageStyles}`}>
          {percent}%
        </span>
      </div>

      <div className="w-full bg-neutral-200 h-2 rounded-full">
        <div className={`h-2 rounded-full ${progressColor}`} style={{ width: `${percent}%` }} />
      </div>

      <div className="flex justify-between text-xs text-neutral-400">
        <span>{formatCurrency(saved)} saved</span>
        <span>{formatCurrency(goal)} goal</span>
      </div>
    </div>
  );
}

export default function ProgressSection({ monthly, yearly, items = [] }) {
  const [showDetails, setShowDetails] = useState(true);

  const progressItems =
    items.length > 0
      ? items
      : [
          {
            title: "Monthly Target",
            saved: monthly?.saved,
            goal: monthly?.goal,
            color: "primary",
          },
          {
            title: "Annual Target",
            saved: yearly?.saved,
            goal: yearly?.goal,
            color: "secondary",
          },
        ];

  return (
    <div className="bg-white rounded-card shadow-card p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-h3">Savings Progress</h3>
          <p className="text-sm text-neutral-500 mb-4">Track your active plan performance</p>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm border border-neutral-300 px-3 py-1 rounded-button hover:bg-neutral-100 transition"
        >
          {showDetails ? "Hide Details" : "View Details"}
        </button>
      </div>

      {showDetails ? (
        <>
          {progressItems.map((item) => (
            <ProgressBar
              key={item.title}
              title={item.title}
              saved={item.saved}
              goal={item.goal}
              color={item.color}
              subtitle={item.subtitle}
            />
          ))}
        </>
      ) : null}
    </div>
  );
}

