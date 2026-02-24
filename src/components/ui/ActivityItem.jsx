export default function ActivityItem({
  icon,
  amount,
  source,
  status,
  date,
  statusColor,
  iconBg = "bg-primary-50",
  iconColor = "text-primary-500",
}) {
  return (
    <div className="border border-neutral-200 rounded-button p-4 flex justify-between items-center hover:shadow-sm transition">
      <div className="flex items-center gap-3">
        <div className={`${iconBg} ${iconColor} p-2 rounded-full`}>{icon}</div>

        <div>
          <p className="font-medium text-neutral-700">{amount}</p>
          <p className="text-xs text-neutral-500">{source}</p>
        </div>
      </div>

      <div className="text-right">
        <p className={`${statusColor} text-sm font-medium`}>{status}</p>
        <p className="text-xs text-neutral-400">{date}</p>
      </div>
    </div>
  );
}
