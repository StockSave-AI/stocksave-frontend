function ActionCard({
  title,
  description,
  buttonText,
  icon,
  bgColor,
  onClick,
}) {
  return (
    <div className={`rounded-card p-6 text-white shadow-card ${bgColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-lg">{title}</h4>
          <p className="text-sm mt-1 opacity-90">{description}</p>
        </div>

        <div className="bg-white/20 p-2 rounded-button">{icon}</div>
      </div>

      <button
        onClick={onClick}
        className="mt-6 bg-white text-neutral-800 px-4 py-2 rounded-button text-sm font-medium"
      >
        {buttonText}
      </button>
    </div>
  );
}

export default ActionCard;
