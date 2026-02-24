import { useState } from "react";
import { getNotifications } from "../services/notificationsService";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  const loadMore = async () => {
    const data = await getNotifications();
    setNotifications([...notifications, ...data]);
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return { notifications, loadMore, markAllRead };
}
