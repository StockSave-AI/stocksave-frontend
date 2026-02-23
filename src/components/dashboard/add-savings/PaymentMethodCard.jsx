export default function PaymentMethodCard({
  title,
  description,
  active,
  onClick,
  icon,
  footerText,
  footerClass,
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-4 p-4 rounded-button border cursor-pointer transition
        ${active ? "border-primary-500 bg-primary-50" : "border-neutral-200 hover:border-primary-400"}`}
    >
      {icon && (
        <div className="flex-shrink-0 text-primary-500 bg-neutral-100 p-3 border rounded-lg shadow-md">
          {icon}
        </div>
      )}
      <div className="flex flex-col flex-1">
        <p className="font-medium text-neutral-700">{title}</p>
        <p className="text-sm text-neutral-500 mt-1">{description}</p>
        {footerText && (
          <p className={`mt-1 ${footerClass || "text-xs text-neutral-400"}`}>
            {footerText}
          </p>
        )}
      </div>
    </div>
  );
}
