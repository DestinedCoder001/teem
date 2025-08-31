import { useLocation, useNavigate } from "react-router-dom";
import { useAllowNotifications } from "../store/uiStore";

export const useSendNotification = () => {
  const navigate = useNavigate();
  const {pathname} = useLocation()
  const {subscribe} = useAllowNotifications(state => state);

  const requestPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  };

  const send = ({
    title,
    body,
    icon,
    tag,
    route,
  }: {
    title: string;
    body: string;
    icon?: string;
    tag?: string;
    route?: string;
  }) => {
    const notificationsAllowed = "Notification" in window && Notification.permission === "granted" && subscribe
    if (notificationsAllowed) {
      const isCurrentRoute = route && pathname === route
      if (!isCurrentRoute || document.hidden) {
        const notification = new Notification(title, {
          body,
          icon,
          tag,
        });

        notification.onclick = () => {
          window.focus();
          if (route) {
            navigate(route);
          }
        };
      }
    }
  };

  return { requestPermission, send };
};