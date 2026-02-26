import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaSave, FaStore } from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";
import { useProfile } from "../../hooks/useProfile";
import { useUpdateOwnerSettings } from "../hooks/useOwnerSettings";
import SectionHeader from "./SectionHeader";

const readProfileData = (profileResponse) =>
  profileResponse?.profile || profileResponse?.data?.profile || profileResponse || {};

const BusinessSection = () => {
  const { data: profileResponse } = useProfile();
  const profile = readProfileData(profileResponse);
  const updateSettingsMutation = useUpdateOwnerSettings();
  const [businessName, setBusinessName] = useState("");

  const initialName = useMemo(
    () => profile?.business_name || "",
    [profile?.business_name],
  );

  useEffect(() => {
    setBusinessName(initialName);
  }, [initialName]);

  const handleSave = async () => {
    if (!businessName.trim()) {
      toast.error("Business name is required.");
      return;
    }

    try {
      await updateSettingsMutation.mutateAsync({
        business_name: businessName.trim(),
      });
      toast.success("Business settings updated.");
    } catch (error) {
      toast.error(error?.message || "Failed to update business settings.");
    }
  };

  return (
    <section className="bg-white rounded-card shadow-card border border-neutral-100 p-6 md:p-8">
      <SectionHeader icon={FaStore} title="My Business" colorClass="bg-secondary-500" />

      <div className="space-y-6">
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Business name"
          className="w-full px-4 py-3 rounded-button border border-neutral-200 focus:ring-2 focus:ring-primary-300 outline-none"
          disabled={updateSettingsMutation.isPending}
        />

        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-button text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          <MdOutlineFileUpload size={18} />
          Upload Logo
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={updateSettingsMutation.isPending}
          className="bg-primary-400 text-white px-8 py-3 rounded-button font-bold flex items-center gap-2 hover:bg-primary-500 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FaSave />
          {updateSettingsMutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </section>
  );
};

export default BusinessSection;
