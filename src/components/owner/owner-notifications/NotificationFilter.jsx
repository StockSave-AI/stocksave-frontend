import React from "react";

const NotificationFilter = () => {
  return (
    <div className="bg-white border border-neutral-100 rounded-card p-5 flex justify-between items-center text-sm">
      <div className="flex items-center gap-2">
        <span className="text-neutral-500">Filter by:</span>
        <select className="bg-transparent font-semibold text-neutral-800 outline-none cursor-pointer">
          <option>All Notifications</option>
          <option>Bookings</option>
          <option>Payments</option>
        </select>
      </div>
      <span className="text-neutral-400">Showing 7 of 7 notifications</span>
    </div>
  );
};

export default NotificationFilter;
