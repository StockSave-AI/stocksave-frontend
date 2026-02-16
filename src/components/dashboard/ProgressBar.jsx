function ProgressBar({ label, percent }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm mb-2">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>

      <div className="w-full bg-neutral-200 rounded-full h-2">
        <div
          className="bg-primary-500 h-2 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
