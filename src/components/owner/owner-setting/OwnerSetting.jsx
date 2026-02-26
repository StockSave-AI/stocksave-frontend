import React from "react";
import ProfileSection from "./ProfileSection";
import BusinessSection from "./BusinessSection";
import PaymentSection from "./PaymentSection";
import StockAlertSection from "./StockAlertSection";
import SecuritySection from "./SecuritySection";

const OwnerSettings = () => {
  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-h2 text-neutral-900">Owner Settings</h1>
          <p className="text-neutral-500 text-sm">
            Manage your profile and business information
          </p>
        </header>

        <ProfileSection />
        <SecuritySection />
        <BusinessSection />
        <PaymentSection />
        <StockAlertSection />
      </div>
    </div>
  );
};

export default OwnerSettings;
