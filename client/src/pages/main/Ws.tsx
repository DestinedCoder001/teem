import { useUserStore } from "@/lib/store/userStore";

const Ws = () => {
  const user = useUserStore((state) => state.user);
  return (
    <>
      <div>
        {user?.firstName} {user?.email} {user?.lastName} {user?.id}
      </div>
      <img src={user?.profilePicture} width={1000} height={1000} className="mt-[500px]" />
    </>
  );
};

export default Ws;
