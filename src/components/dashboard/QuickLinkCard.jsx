function QuickLinkCard({ icon, title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-card shadow-card p-6 cursor-pointer hover:shadow-md transition"
    >
      <div className="mb-4">{icon}</div>

      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-neutral-500">{description}</p>
    </div>
  );
}

export default QuickLinkCard;
