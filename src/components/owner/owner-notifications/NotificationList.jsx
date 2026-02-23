import React from "react";
import NotificationItem from "./NotificationItem";
import {
  FiShoppingCart,
  FiCreditCard,
  FiUserPlus,
  FiAlertTriangle,
  FiUserCheck,
  FiEye,
} from "react-icons/fi";

const notifications = [
  {
    id: 1,
    type: "New Booking",
    content: "Tolu booked 3 bags of rice.",
    time: "2 minutes ago",
    isUnread: true,
    icon: FiShoppingCart,
    iconBg: "bg-blue-50 text-secondary-400",
    actionLabel: "View Booking",
  },
  {
    id: 2,
    type: "Cash Deposit Pending",
    content: "Blessing marked ₦5,000 as deposited.",
    time: "15 minutes ago",
    isUnread: true,
    icon: FiCreditCard,
    iconBg: "bg-primary-50 text-primary-400",
    actionLabel: "Review Deposit",
  },
  {
    id: 3,
    type: "New User Registered",
    content: "David joined the platform.",
    time: "2 hours ago",
    isUnread: true,
    icon: FiUserPlus,
    iconBg: "bg-secondary-50 text-secondary-500",
    actionLabel: "View Profile",
  },
  {
    id: 4,
    type: "Stock Updated",
    content: "Beans inventory increased by 50 units.",
    time: "1 day ago",
    isUnread: false,
    icon: FiAlertTriangle,
    iconBg: "bg-error/10 text-error",
    actionLabel: "View Stock",
  },
  {
    id: 5,
    type: "User Profile Updated",
    content: "Chioma updated her phone number.",
    time: "2 days ago",
    isUnread: false,
    icon: FiUserCheck,
    iconBg: "bg-secondary-50 text-secondary-500",
    actionLabel: "View Changes",
  },
];

const NotificationList = () => {
  return (
    <div className="space-y-4">
      {notifications.map((notif) => (
        <NotificationItem key={notif.id} notif={notif} />
      ))}
    </div>
  );
};

export default NotificationList;
