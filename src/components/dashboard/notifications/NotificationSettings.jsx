import ToggleSwitch from "../../ui/ToggleSwitch";

export default function NotificationSettings() {
  const settings = [
    {
      label: "Payment Reminders",
      desc: "Get notified before payment due dates",
    },
    { label: "Stock Alerts", desc: "Receive updates about stock levels" },
    {
      label: "Redemption Updates",
      desc: "Get notified about withdrawal status",
    },
    { label: "Email Notifications", desc: "Receive notifications via email" },
    { label: "SMS Notifications", desc: "Receive notifications via SMS" },
  ];

  return (
    <div className="space-y-2 p-3 sm:p-4 border border-neutral-200 rounded-card">
      {settings.map((s) => (
        <div key={s.label} className="flex items-start sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold">{s.label}</p>
            <p className="text-neutral-400 text-sm break-words">{s.desc}</p>
          </div>
          <ToggleSwitch />
        </div>
      ))}
    </div>
  );
}
