import { Bell, ListChecks } from "lucide-react";

const navlinks = [
  {
    label: "Tasks",
    link: "/tasks",
    icon: <ListChecks />,
  },
  {
    label: "Notifications",
    link: "/notifications",
    icon: <Bell />,
  },
];

const allowedAttachments = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export { navlinks, allowedAttachments };
