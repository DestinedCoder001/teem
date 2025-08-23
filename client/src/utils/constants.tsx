import { Bell, ListChecks, PhoneCall } from "lucide-react";

const navlinks = [
  {
    label: "Tasks",
    link: "/tasks",
    icon: <ListChecks className="" />,
  },
  {
    label: "Meetings",
    link: "/meetings",
    icon: <PhoneCall className="" />,
  },
  {
    label: "Notifications",
    link: "/notifications",
    icon: <Bell className="" />,
  },
];

export { navlinks };
