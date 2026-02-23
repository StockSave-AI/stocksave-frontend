import React, { useState } from "react";
import { FaCreditCard } from "react-icons/fa";
import SectionHeader from "./SectionHeader";
import ToggleSwitch from "./ToggleSwitch";

const PaymentSection = () => {
  const [toggles, setToggles] = useState({
    card: true,
    transfer: true,
    cash: true,
  });

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="bg-white rounded-card shadow-card border border-neutral-100 p-6 md:p-8">
      <SectionHeader
        icon={FaCreditCard}
        title="Payment Options"
        colorClass="bg-warning"
      />

      <div className="space-y-4">
        {[
          { id: "card", label: "Allow customers pay with card" },
          { id: "transfer", label: "Allow customers pay with bank transfer" },
          { id: "cash", label: "Allow customers pay with cash" },
        ].map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center py-3 px-4 bg-neutral-50 rounded-xl border border-neutral-100"
          >
            <span className="text-sm font-medium text-neutral-700">
              {item.label}
            </span>
            <ToggleSwitch
              active={toggles[item.id]}
              onToggle={() => handleToggle(item.id)}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PaymentSection;
