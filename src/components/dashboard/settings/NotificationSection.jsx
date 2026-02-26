import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaBell } from "react-icons/fa";
import SectionCard from "./SectionCard";
import {
  getSettingsNotifications,
  patchSettingsNotifications,
} from "../../services/settings";

const LOCAL_SETTINGS_NOTIFICATIONS_KEY = "settings_notifications_fallback_v1";

const readLocalFallback = () => {
  try {
    const raw = localStorage.getItem(LOCAL_SETTINGS_NOTIFICATIONS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

const saveLocalFallback = (value) => {
  localStorage.setItem(LOCAL_SETTINGS_NOTIFICATIONS_KEY, JSON.stringify(value));
};

export default function NotificationSection() {
  const notificationsQuery = useQuery({
    queryKey: ["settings-notifications"],
    queryFn: getSettingsNotifications,
    retry: false,
  });
  const updateMutation = useMutation({
    mutationFn: patchSettingsNotifications,
  });
  const [notifications, setNotifications] = useState({
    payment_reminders: false,
    booking_updates: false,
    email_notifications: false,
    sms_notifications: false,
  });

  const initial = useMemo(() => {
    if (
      notificationsQuery.isError &&
      notificationsQuery.error?.status === 404
    ) {
      return (
        readLocalFallback() || {
          payment_reminders: true,
          booking_updates: true,
          email_notifications: true,
          sms_notifications: false,
        }
      );
    }

    const payload =
      notificationsQuery.data?.data || notificationsQuery.data || {};
    return {
      payment_reminders: Boolean(payload?.payment_reminders),
      booking_updates: Boolean(payload?.booking_updates),
      email_notifications: Boolean(payload?.email_notifications),
      sms_notifications: Boolean(payload?.sms_notifications),
    };
  }, [
    notificationsQuery.data,
    notificationsQuery.isError,
    notificationsQuery.error?.status,
  ]);

  useEffect(() => {
    setNotifications(initial);
  }, [initial]);

  const toggle = async (key) => {
    const next = { ...notifications, [key]: !notifications[key] };
    setNotifications(next);
    if (
      notificationsQuery.isError &&
      notificationsQuery.error?.status === 404
    ) {
      saveLocalFallback(next);
      toast.success(
        "Saved on this device. Backend notifications endpoint not available.",
      );
      return;
    }
    try {
      await updateMutation.mutateAsync(next);
      toast.success("Notification preferences updated.");
    } catch (error) {
      setNotifications(notifications);
      toast.error(
        error?.message || "Failed to update notification preferences.",
      );
    }
  };

  const items = {
    payment_reminders: "Payment Reminders",
    booking_updates: "Booking Updates",
    email_notifications: "Email Notifications",
    sms_notifications: "SMS Notifications",
  };

  return (
    <SectionCard icon={<FaBell />} title="Notification Preferences">
      <div className="space-y-4">
        {Object.entries(items).map(([key, label]) => (
          <div key={key} className="flex justify-between items-center">
            <span>{label}</span>
            <button
              onClick={() => toggle(key)}
              disabled={
                notificationsQuery.isLoading || updateMutation.isPending
              }
              className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                notifications[key] ? "bg-green-500" : "bg-neutral-300"
              } disabled:opacity-60`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                  notifications[key] ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
