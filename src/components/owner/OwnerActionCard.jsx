export default function OwnerActionCard({
  onClick,
  className,
  title,
  description,
  leftIcon,
  rightIcon,
}) {
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer p-6 rounded-2xl transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between">
        {leftIcon}
        {rightIcon}
      </div>

      <h3 className="mt-6 text-lg font-semibold">{title}</h3>
      <p className="text-sm mt-2">{description}</p>
    </div>
  );
}
