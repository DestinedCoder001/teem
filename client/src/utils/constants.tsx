import { Bell, ListChecks, PhoneCall } from "lucide-react";

const navlinks = [
  {
    label: "Tasks",
    link: "/tasks",
    icon: <ListChecks strokeWidth={1.5} />,
  },
  {
    label: "Meetings",
    link: "/meetings",
    icon: <PhoneCall strokeWidth={1.5} />,
  },
  {
    label: "Notifications",
    link: "/notifications",
    icon: <Bell strokeWidth={1.5} />,
  },
];

export { navlinks };
