export default function SectionCard({ icon, title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 space-y-6">
      <div className="flex items-center gap-3 text-neutral-700 font-semibold">
        {icon}
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
