
type UserCardProps = {
  name: string;
  src: string;
};

const UserCard = ({ name, src }: UserCardProps) => {
  return (
    <div className="rounded-sm overflow-hidden shrink-0 w-48 relative">
      <img src={src} alt={name} className="w-full h-28 object-cover" />
      <div className="absolute left-1 bottom-1 rounded-xs px-1 bg-black/60 text-sm text-white">{name}</div>
    </div>
  );
};

export default UserCard;
