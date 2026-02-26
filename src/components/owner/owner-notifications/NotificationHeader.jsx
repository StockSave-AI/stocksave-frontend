export default function NotificationHeader({
  title = "Notifications",
  subtitle = "",
  actions = null,
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-h2 text-neutral-900">{title}</h1>
        {subtitle ? <p className="text-neutral-500 text-sm">{subtitle}</p> : null}
      </div>
      {actions}
    </div>
  );
}
