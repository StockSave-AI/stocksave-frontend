function StatsCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white rounded-card shadow-card p-5 flex justify-between items-center">
      <div>
        <p className="text-sm text-neutral-500">{title}</p>
        <h3 className="text-h3 mt-1">{value}</h3>
        {subtitle && (
          <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>
        )}
      </div>

      <div className="bg-primary-50 text-primary-600 p-3 rounded-button">
        {icon}
      </div>
    </div>
  );
}

export default StatsCard;
