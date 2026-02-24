import React from "react";
import { FaStore, FaSave } from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";
import SectionHeader from "./SectionHeader";

const BusinessSection = () => {
  return (
    <section className="bg-white rounded-card shadow-card border border-neutral-100 p-6 md:p-8">
      <SectionHeader
        icon={FaStore}
        title="My Business"
        colorClass="bg-secondary-500"
      />

      <div className="space-y-6">
        <input
          type="text"
          defaultValue="Amaka Food Store"
          className="w-full px-4 py-3 rounded-button border border-neutral-200"
        />
        <textarea
          rows="3"
          className="w-full px-4 py-3 rounded-button border border-neutral-200 resize-none"
        />
        <input
          type="text"
          defaultValue="+234 803 456 7890"
          className="w-full px-4 py-3 rounded-button border border-neutral-200"
        />

        <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-button text-sm font-medium text-neutral-700 hover:bg-neutral-50">
          <MdOutlineFileUpload size={18} />
          Upload Logo
        </button>

        <button className="bg-primary-400 text-white px-8 py-3 rounded-button font-bold flex items-center gap-2 hover:bg-primary-500 shadow-md">
          <FaSave /> Save
        </button>
      </div>
    </section>
  );
};

export default BusinessSection;
