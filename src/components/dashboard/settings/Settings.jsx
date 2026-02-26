import AccountSettingsSection from "./AccountSettingsSection";
import DangerZoneSection from "./DangerSection";
import HelpSupportSection from "./HelpSupportSection";
import NotificationSection from "./NotificationSection";
import PaymentMethodsSection from "./PaymentMethodsSection";

import ProfileSection from "./ProfileSection";
import SecuritySection from "./SecutitySection";
import SettingsHeader from "./SettingsHeader";

export default function Settings() {
  return (
    <div className="p-6 space-y-8 bg-neutral-50 min-h-screen">
      <SettingsHeader />

      <ProfileSection />
      <SecuritySection />
      <NotificationSection />
      <PaymentMethodsSection />
      <AccountSettingsSection />
      <HelpSupportSection />
      <DangerZoneSection />
    </div>
  );
}
