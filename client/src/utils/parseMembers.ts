type Props = {
  members: {
    _id: string;
    firstName: string;
    lastName: string;
  }[];
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
};
export const parseMembers = ({ members, createdBy }: Props) => {
  if (members.length === 0) return "";
  const names = members
    .sort((a, b) => {
      if (a._id === createdBy._id) return -1;
      if (b._id === createdBy._id) return 1;
      return 0;
    })
    .map((m) => `${m.firstName} ${m.lastName}`);
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
