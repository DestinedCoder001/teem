import { ListChecks, PhoneCall, UserRoundPlus } from "lucide-react";

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
    label: "Invitations",
    link: "/invitations",
    icon: <UserRoundPlus strokeWidth={1.5} />,
  },
];

export { navlinks };
