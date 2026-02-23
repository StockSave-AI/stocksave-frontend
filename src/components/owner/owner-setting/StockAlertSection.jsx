import React from "react";
import { FaBell } from "react-icons/fa";
import SectionHeader from "./SectionHeader";

const StockAlertSection = () => {
  return (
    <section className="bg-white rounded-card shadow-card border border-neutral-100 p-6 md:p-8">
      <SectionHeader icon={FaBell} title="Stock Alert" colorClass="bg-error" />

      <div className="space-y-4">
        <p className="text-sm text-neutral-600">
          Alert me when stock is below:
        </p>

        <div className="flex items-center gap-3">
          <input
            type="number"
            defaultValue="10"
            className="w-24 px-4 py-3 rounded-button border border-neutral-200 text-center font-bold"
          />
          <span className="text-neutral-500 font-medium">items</span>
        </div>

        <p className="text-xs text-neutral-400 italic">
          You will get notified when stock falls below this number
        </p>
      </div>
    </section>
  );
};

export default StockAlertSection;
