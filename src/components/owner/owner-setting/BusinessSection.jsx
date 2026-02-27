import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaSave, FaStore } from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";
import { useProfile } from "../../hooks/useProfile";
import { useUpdateOwnerSettings } from "../hooks/useOwnerSettings";
import SectionHeader from "./SectionHeader";

const readProfileData = (profileResponse) =>
  profileResponse?.data ||
  profileResponse?.profile ||
  profileResponse?.data?.profile ||
  profileResponse ||
  {};

const BusinessSection = () => {
  const { data: profileResponse } = useProfile();
  const profile = readProfileData(profileResponse);
  const updateSettingsMutation = useUpdateOwnerSettings();
  const [form, setForm] = useState({
    business_name: "",
    business_phone: "",
    business_description: "",
    business_logo: "",
  });

  const business = profile?.business || {};
  const initialForm = useMemo(
    () => ({
      business_name: business?.business_name || profile?.business_name || "",
      business_phone: business?.business_phone || profile?.business_phone || "",
      business_description:
        business?.business_description || profile?.business_description || "",
      business_logo: business?.business_logo || profile?.business_logo || "",
    }),
    [
      business?.business_description,
      business?.business_logo,
      business?.business_name,
      business?.business_phone,
      profile?.business_description,
      profile?.business_logo,
      profile?.business_name,
      profile?.business_phone,
    ],
  );

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const handleSave = async () => {
    if (!form.business_name.trim()) {
      toast.error("Business name is required.");
      return;
    }

    try {
      await updateSettingsMutation.mutateAsync({
        business_name: form.business_name.trim(),
        business_phone: form.business_phone.trim() || null,
        business_description: form.business_description.trim() || null,
        business_logo: form.business_logo.trim() || null,
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
          value={form.business_name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, business_name: e.target.value }))
          }
          placeholder="Business name"
          className="w-full px-4 py-3 rounded-button border border-neutral-200 focus:ring-2 focus:ring-primary-300 outline-none"
          disabled={updateSettingsMutation.isPending}
        />
        <input
          type="text"
          value={form.business_phone}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, business_phone: e.target.value }))
          }
          placeholder="Business phone (optional)"
          className="w-full px-4 py-3 rounded-button border border-neutral-200 focus:ring-2 focus:ring-primary-300 outline-none"
          disabled={updateSettingsMutation.isPending}
        />
        <textarea
          value={form.business_description}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              business_description: e.target.value,
            }))
          }
          placeholder="Business description (optional)"
          rows={3}
          className="w-full px-4 py-3 rounded-button border border-neutral-200 focus:ring-2 focus:ring-primary-300 outline-none resize-y"
          disabled={updateSettingsMutation.isPending}
        />
        <input
          type="text"
          value={form.business_logo}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, business_logo: e.target.value }))
          }
          placeholder="Business logo URL (optional)"
          className="w-full px-4 py-3 rounded-button border border-neutral-200 focus:ring-2 focus:ring-primary-300 outline-none"
          disabled={updateSettingsMutation.isPending}
        />

        <div className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-button text-sm font-medium text-neutral-500">
          <MdOutlineFileUpload size={18} />
          Use logo URL or upload support via multipart endpoint
        </div>

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
