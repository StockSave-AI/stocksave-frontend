import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaCamera, FaSave, FaUser } from "react-icons/fa";
import { useProfile } from "../../hooks/useProfile";
import { useUpdateOwnerSettings } from "../hooks/useOwnerSettings";
import SectionHeader from "./SectionHeader";

const readProfileData = (profileResponse) =>
  profileResponse?.profile || profileResponse?.data?.profile || profileResponse || {};

const estimateDataUrlBytes = (dataUrl) => {
  if (!dataUrl || !dataUrl.startsWith("data:")) return 0;
  const base64 = dataUrl.split(",")[1] || "";
  return Math.floor((base64.length * 3) / 4);
};

const compressImageToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Invalid image file."));
      image.onload = () => {
        const maxDimension = 480;
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Unable to process image."));
          return;
        }
        context.drawImage(image, 0, 0, width, height);

        const qualities = [0.75, 0.6, 0.5, 0.4, 0.3];
        let best = "";
        for (const quality of qualities) {
          const output = canvas.toDataURL("image/jpeg", quality);
          best = output;
          if (estimateDataUrlBytes(output) <= 150 * 1024) break;
        }
        resolve(best);
      };
      image.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  });

const ProfileSection = () => {
  const { data: profileResponse } = useProfile();
  const profile = readProfileData(profileResponse);
  const updateSettingsMutation = useUpdateOwnerSettings();

  const [form, setForm] = useState({
    first_name: "",
    profile_picture: "",
  });

  const initialForm = useMemo(
    () => ({
      first_name: profile?.first_name || "",
      profile_picture: profile?.profile_picture || "",
    }),
    [profile?.first_name, profile?.profile_picture],
  );

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const initials = (form.first_name || "O").slice(0, 1).toUpperCase();
  const isSaving = updateSettingsMutation.isPending;

  const handleFieldChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    compressImageToDataUrl(file)
      .then((compressedDataUrl) => {
        if (estimateDataUrlBytes(compressedDataUrl) > 150 * 1024) {
          toast.error("Image is still too large. Use a smaller image or paste image URL.");
          return;
        }
        handleFieldChange("profile_picture", compressedDataUrl);
      })
      .catch((error) => {
        toast.error(error?.message || "Failed to process image.");
      });
  };

  const handleSave = async () => {
    if (!form.first_name.trim()) {
      toast.error("First name is required.");
      return;
    }

    if (
      form.profile_picture &&
      form.profile_picture.startsWith("data:") &&
      estimateDataUrlBytes(form.profile_picture) > 150 * 1024
    ) {
      toast.error("Profile image is too large to upload. Use a smaller image or URL.");
      return;
    }

    try {
      await updateSettingsMutation.mutateAsync({
        first_name: form.first_name.trim(),
        profile_picture: form.profile_picture || null,
      });
      toast.success("Profile settings updated.");
    } catch (error) {
      toast.error(error?.message || "Failed to update profile settings.");
    }
  };

  return (
    <section className="bg-white rounded-card shadow-card border border-neutral-100 p-6 md:p-8">
      <SectionHeader icon={FaUser} title="My Profile" colorClass="bg-primary-500" />

      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold text-neutral-500 mb-3">Profile Picture</p>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold overflow-hidden">
              {form.profile_picture ? (
                <img
                  src={form.profile_picture}
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
            value={form.first_name}
            onChange={(e) => handleFieldChange("first_name", e.target.value)}
            placeholder="First name"
            className="w-full px-4 py-3 rounded-button border border-neutral-200 focus:ring-2 focus:ring-primary-300 outline-none"
            disabled={isSaving}
          />
          <input
            type="text"
            value={form.profile_picture}
            onChange={(e) => handleFieldChange("profile_picture", e.target.value)}
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
