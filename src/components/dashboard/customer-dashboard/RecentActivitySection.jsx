import RecentActivity from "../RecentActivity";

export default function RecentActivitySection({ activities }) {
  if (activities.length > 0) {
    return <RecentActivity activities={activities} />;
  }

  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <h3 className="text-h3">Recent Activity</h3>
      <p className="text-sm text-neutral-500">No activity yet</p>
    </div>
  );
}
