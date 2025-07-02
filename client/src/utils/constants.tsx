import { ListChecks, Mail, Rss } from "lucide-react"

const navlinks = [
    {
        label: "Channels",
        link: "/",
        icon: <Rss />
    },
    {
        label: "Tasks",
        link: "/tasks",
        icon: <ListChecks />
    },
    {
        label: "DMs",
        link: "/dms",
        icon: <Mail />
    },
]

export {navlinks}