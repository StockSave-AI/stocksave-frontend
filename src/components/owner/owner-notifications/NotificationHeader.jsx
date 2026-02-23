import React from "react";
import { FiCheckCircle } from "react-icons/fi";

const NotificationHeader = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-h2 text-neutral-900">Notifications</h1>
        <p className="text-neutral-500 text-sm">
          You have 4 unread notifications
        </p>
      </div>
      <button className="flex items-center gap-2 bg-primary-400 hover:bg-primary-500 text-white px-6 py-2.5 rounded-button font-bold text-sm transition-all shadow-md active:scale-95">
        <FiCheckCircle size={18} />
        Mark All as Read
      </button>
    </div>
  );
};

export default NotificationHeader;
