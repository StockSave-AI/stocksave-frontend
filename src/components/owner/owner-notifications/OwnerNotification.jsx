import React from "react";
import NotificationHeader from "./NotificationHeader";
import NotificationFilter from "./NotificationFilter";
import NotificationList from "./NotificationList";

const OwnerNotifications = () => {
  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <NotificationHeader />
        <NotificationFilter />
        <NotificationList />
      </div>
    </div>
  );
};

export default OwnerNotifications;
