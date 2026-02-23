import React from "react";
import { FiCheckCircle, FiEye } from "react-icons/fi";

const NotificationItem = ({ notif }) => {
  const Icon = notif.icon;

  return (
    <div
      className={`group flex items-center justify-between p-5 rounded-card bg-white transition-all border-2 ${
        notif.isUnread
          ? "border-primary-300 shadow-md"
          : "border-transparent hover:border-neutral-200 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-5">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${notif.iconBg}`}
        >
          <Icon size={22} />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h4 className="font-bold text-neutral-900">{notif.type}</h4>
            {notif.isUnread && (
              <span className="bg-primary-400 text-white text-[10px] uppercase px-2 py-0.5 rounded-full font-bold">
                Unread
              </span>
            )}
          </div>
          <p className="text-neutral-600 text-sm mt-0.5">{notif.content}</p>
          <p className="text-neutral-400 text-xs mt-1">{notif.time}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {notif.isUnread && (
          <button
            className="text-primary-400 hover:text-primary-600 p-2"
            title="Mark as read"
          >
            <FiCheckCircle size={20} />
          </button>
        )}
        <button className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-button text-xs font-bold transition-colors">
          <FiEye size={14} />
          {notif.actionLabel}
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
