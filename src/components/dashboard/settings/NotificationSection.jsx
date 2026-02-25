import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import SectionCard from "./SectionCard";
import { getNotificationPreferences } from "../../services/customer";
import { getAuthToken } from "../../../utils/authStorage";

export default function NotificationSection() {
  const token = getAuthToken();
  const [notifications, setNotifications] = useState({});

  useEffect(() => {
    let isMounted = true;
    if (!token) return undefined;

    getNotificationPreferences(token)
      .then((response) => {
        if (!isMounted) return;
        const data = response?.data || response || {};
        setNotifications(data);
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error("Failed to fetch notification preferences:", error);
        setNotifications({});
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const toggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const items = {
    email: "Email Notifications",
    sms: "SMS Notifications",
    reminders: "Payment Reminders",
    stock: "Stock Alerts",
    marketing: "Marketing Emails",
  };

  return (
    <SectionCard icon={<FaBell />} title="Notification Preferences">
      <div className="space-y-4">
        {Object.entries(items).map(([key, label]) => (
          <div key={key} className="flex justify-between items-center">
            <span>{label}</span>
            <button
              onClick={() => toggle(key)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                notifications[key] ? "bg-green-500" : "bg-neutral-300"
              }`}
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
