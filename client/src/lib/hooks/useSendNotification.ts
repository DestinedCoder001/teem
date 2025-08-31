import { useLocation, useNavigate } from "react-router-dom";

export const useSendNotification = () => {
  const navigate = useNavigate();
  const {pathname} = useLocation()

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
    if ("Notification" in window && Notification.permission === "granted") {
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