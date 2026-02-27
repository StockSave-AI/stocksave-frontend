import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaCamera, FaSave, FaUser } from "react-icons/fa";
import { useProfile } from "../../hooks/useProfile";
import { useUpdateOwnerSettings } from "../hooks/useOwnerSettings";
import SectionHeader from "./SectionHeader";

const readProfileData = (profileResponse) =>
  profileResponse?.data ||
  profileResponse?.profile ||
  profileResponse?.data?.profile ||
  profileResponse ||
  {};

const ProfileSection = () => {
  const { data: profileResponse } = useProfile();
  const profile = readProfileData(profileResponse);
  const updateSettingsMutation = useUpdateOwnerSettings();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    profile_picture: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const resolved = useMemo(
    () => ({
      first_name: form.first_name || profile?.first_name || "",
      last_name: form.last_name || profile?.last_name || "",
      phone: form.phone || profile?.phone || "",
      profile_picture: form.profile_picture || profile?.profile_picture || "",
    }),
    [
      form.first_name,
      form.last_name,
      form.phone,
      form.profile_picture,
      profile?.first_name,
      profile?.last_name,
      profile?.phone,
      profile?.profile_picture,
    ],
  );

  const initials = (resolved.first_name || "O").slice(0, 1).toUpperCase();
  const isSaving = updateSettingsMutation.isPending;

  const handleFieldChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file must be 2MB or less.");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!resolved.first_name.trim()) {
      toast.error("First name is required.");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("first_name", resolved.first_name.trim());
      if (resolved.last_name.trim())
        payload.append("last_name", resolved.last_name.trim());
      if (resolved.phone.trim()) payload.append("phone", resolved.phone.trim());
      if (selectedFile) {
        payload.append("profile_picture", selectedFile);
      } else if (resolved.profile_picture.trim()) {
        const value = resolved.profile_picture.trim();
        if (!value.startsWith("data:")) {
          payload.append("profile_picture", value);
        }
      }

      await updateSettingsMutation.mutateAsync(payload);
      toast.success("Profile settings updated.");
    } catch (error) {
      toast.error(error?.message || "Failed to update profile settings.");
    }
  };

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
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold overflow-hidden">
              {previewUrl || resolved.profile_picture ? (
                <img
                  src={previewUrl || resolved.profile_picture}
                  alt="Owner profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <label className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-button text-sm font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer">
              <FaCamera size={14} />
              Upload Photo
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleFileChange}
                disabled={isSaving}
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            value={resolved.first_name}
            onChange={(e) => handleFieldChange("first_name", e.target.value)}
            placeholder="First name"
            className="w-full px-4 py-3 rounded-button border border-neutral-200 focus:ring-2 focus:ring-primary-300 outline-none"
            disabled={isSaving}
          />
          <input
            type="text"
            value={resolved.last_name}
            onChange={(e) => handleFieldChange("last_name", e.target.value)}
            placeholder="Last name"
            className="w-full px-4 py-3 rounded-button border border-neutral-200 focus:ring-2 focus:ring-primary-300 outline-none"
            disabled={isSaving}
          />
          <input
            type="text"
            value={resolved.phone}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            placeholder="Phone number"
            className="w-full px-4 py-3 rounded-button border border-neutral-200 focus:ring-2 focus:ring-primary-300 outline-none"
            disabled={isSaving}
          />
          <input
            type="text"
            value={resolved.profile_picture}
            onChange={(e) =>
              handleFieldChange("profile_picture", e.target.value)
            }
            placeholder="Profile image URL (optional)"
            className="w-full px-4 py-3 rounded-button border border-neutral-200 focus:ring-2 focus:ring-primary-300 outline-none"
            disabled={isSaving}
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary-400 text-white px-8 py-3 rounded-button font-bold flex items-center gap-2 hover:bg-primary-500 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FaSave />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </section>
  );
};

export default ProfileSection;
