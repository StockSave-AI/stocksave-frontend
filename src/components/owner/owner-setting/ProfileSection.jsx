import React from "react";
import { FaUser, FaCamera, FaSave, FaLock } from "react-icons/fa";
import SectionHeader from "./SectionHeader";

const ProfileSection = () => {
  return (
    <section className="bg-white rounded-card shadow-card border border-neutral-100 p-6 md:p-8">
      <SectionHeader
        icon={FaUser}
        title="My Profile"
        colorClass="bg-primary-500"
      />

      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold text-neutral-500 mb-3">
            Profile Picture
          </p>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold">
              A
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-button text-sm font-medium text-neutral-700 hover:bg-neutral-50">
              <FaCamera size={14} />
              Upload Photo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            defaultValue="Amaka Okonkwo"
            className="w-full px-4 py-3 rounded-button border border-neutral-200 focus:ring-2 focus:ring-primary-300 outline-none"
          />
          <input
            type="text"
            defaultValue="+234 803 456 7890"
            className="w-full px-4 py-3 rounded-button border border-neutral-200 focus:ring-2 focus:ring-primary-300 outline-none"
          />
        </div>

        <button className="text-sm font-bold text-neutral-700 px-4 py-2 bg-neutral-100 rounded-button hover:bg-neutral-200 flex items-center gap-2">
          <FaLock size={12} />
          Update Password
        </button>

        <button className="bg-primary-400 text-white px-8 py-3 rounded-button font-bold flex items-center gap-2 hover:bg-primary-500 shadow-md">
          <FaSave /> Save Changes
        </button>
      </div>
    </section>
  );
};

export default ProfileSection;
