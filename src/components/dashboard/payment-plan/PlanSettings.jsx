import { FiRefreshCw, FiBell, FiShield } from "react-icons/fi";

export default function PlanSettings({
  settings = {},
  onUpdateSettings,
  isUpdating,
}) {
  const autoRenewal = Boolean(settings.auto_renewal);
  const paymentReminders = Boolean(settings.payment_reminders);
  const autoDebit = Boolean(settings.auto_debit);

  const updateSetting = (key, value) => {
    onUpdateSettings({
      auto_renewal: key === "auto_renewal" ? value : autoRenewal,
      payment_reminders:
        key === "payment_reminders" ? value : paymentReminders,
      auto_debit: key === "auto_debit" ? value : autoDebit,
    });
  };

  return (
    <div className="bg-white shadow-card rounded-card p-6 space-y-6">
      <h2 className="text-h3">Plan Settings</h2>

      <ToggleRow
        icon={<FiRefreshCw className="text-primary-500" />}
        title="Auto-renewal"
        description="Automatically renew when plan ends"
        enabled={autoRenewal}
        onToggle={(next) => updateSetting("auto_renewal", next)}
        disabled={isUpdating}
      />

      <ToggleRow
        icon={<FiBell className="text-primary-500" />}
        title="Payment Reminders"
        description="Get notified before payment due"
        enabled={paymentReminders}
        onToggle={(next) => updateSetting("payment_reminders", next)}
        disabled={isUpdating}
      />

      <ToggleRow
        icon={<FiShield className="text-primary-500" />}
        title="Auto-debit"
        description="Automatically deduct from linked account"
        enabled={autoDebit}
        onToggle={(next) => updateSetting("auto_debit", next)}
        disabled={isUpdating}
      />
    </div>
  );
}

function ToggleRow({ icon, title, description, enabled, onToggle, disabled }) {
  return (
    <div className="flex justify-between items-center border border-neutral-200 rounded-button p-4">
      <div className="flex items-start gap-3">
        {icon}
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-neutral-500">{description}</p>
        </div>
      </div>

      <button
        onClick={() => onToggle(!enabled)}
        disabled={disabled}
        className={`w-12 h-6 rounded-full transition relative ${
          enabled ? "bg-primary-500" : "bg-neutral-300"
        } disabled:opacity-50`}
      >
        <div
          className={`absolute top-0 left-0 h-6 w-6 bg-white rounded-full shadow transform transition ${
            enabled ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
}
