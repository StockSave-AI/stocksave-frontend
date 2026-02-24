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
    <div className="space-y-2 p-4 border border-neutral-200 rounded-card">
      {settings.map((s) => (
        <div key={s.label} className="flex justify-between items-center">
          <div>
            <p className="font-semibold">{s.label}</p>
            <p className="text-neutral-400 text-sm">{s.desc}</p>
          </div>
          <ToggleSwitch />
        </div>
      ))}
    </div>
  );
}
