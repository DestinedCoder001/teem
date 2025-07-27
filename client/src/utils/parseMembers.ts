import { useUserStore } from "@/lib/store/userStore";

type Props = {
  members: {
    _id: string;
    firstName: string;
    lastName: string;
  }[];
};
export const parseMembers = ({ members }: Props) => {
  const user = useUserStore.getState().user;
  if (members.length === 0) return "";
  const names = members
    .sort((a, b) => {
      if (a._id === user?._id) return -1;
      if (b._id === user?._id) return 1;
      return 0;
    })
    .map((m) => {
      if (m._id === user?._id) {
        return "You";
      } else {
        return `${m.firstName} ${m.lastName}`;
      }
    });
  if (members.length === 1) {
    return names[0];
  }
  if (members.length === 2) {
    return `${names[0]} and ${names[1]}`;
  }
  const othersCount = members.length - 2;
  return `${names[0]}, ${names[1]} and ${othersCount} ${
    othersCount === 1 ? "other" : "others"
  }`;
};
