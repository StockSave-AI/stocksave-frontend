import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";
import SectionCard from "./SectionCard";
import Input from "./Input";
import ActionButtons from "./ActionButtons";
import { useCustomerSummary } from "../../hooks/useCustomerSummary";
import { useUpdateProfile } from "../../hooks/useProfile";
import { formatDisplayDate } from "../../../utils/date";

export default function ProfileSection() {
  const [imagePreview, setImagePreview] = useState(null);
  const { data: summaryResponse, isLoading } = useCustomerSummary();
  const updateProfileMutation = useUpdateProfile();
  const profile = summaryResponse?.data?.profile || {};
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const initialForm = useMemo(
    () => ({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      email: profile.email || "",
      phone: profile.phone || "",
    }),
    [profile.email, profile.first_name, profile.last_name, profile.phone],
  );

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFieldChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateProfile = () => {
    if (!form.first_name.trim() || !form.last_name.trim()) {
      toast.error("First name and last name are required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Enter a valid email address.");
      return false;
    }

    const phoneRegex = /^[0-9+\-\s]{7,20}$/;
    if (!phoneRegex.test(form.phone)) {
      toast.error("Enter a valid phone number.");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateProfile()) return;

    try {
      await updateProfileMutation.mutateAsync(form);
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to update profile.");
    }
  };

  return (
    <SectionCard icon={<FaUser />} title="Profile Information">
      {}
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUser className="text-3xl text-neutral-500" />
          )}
        </div>

        <div>
          <label className="block">
            <span className="sr-only">Choose profile photo</span>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleImageChange}
              className="block w-full text-sm text-neutral-600
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100"
            />
          </label>
          <p className="text-xs text-neutral-500 mt-2">
            PNG or JPG. Max size 2MB.
          </p>
        </div>
      </div>

      {}
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          placeholder="First Name"
          value={form.first_name}
          onChange={(e) => handleFieldChange("first_name", e.target.value)}
          disabled={isLoading || updateProfileMutation.isPending}
        />
        <Input
          placeholder="Last Name"
          value={form.last_name}
          onChange={(e) => handleFieldChange("last_name", e.target.value)}
          disabled={isLoading || updateProfileMutation.isPending}
        />
        <Input
          placeholder="Email"
          className="md:col-span-2"
          value={form.email}
          onChange={(e) => handleFieldChange("email", e.target.value)}
          disabled={isLoading || updateProfileMutation.isPending}
        />
        <Input
          placeholder="Phone Number"
          className="md:col-span-2"
          value={form.phone}
          onChange={(e) => handleFieldChange("phone", e.target.value)}
          disabled={isLoading || updateProfileMutation.isPending}
        />
      </div>

      <div className="text-sm text-neutral-500">
        Member since: {formatDisplayDate(profile.member_since, "-")}
      </div>

      <ActionButtons
        primary={updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
        onPrimary={handleSave}
        onSecondary={() => setForm(initialForm)}
        primaryDisabled={isLoading || updateProfileMutation.isPending}
        secondaryDisabled={isLoading || updateProfileMutation.isPending}
      />
    </SectionCard>
  );
}
