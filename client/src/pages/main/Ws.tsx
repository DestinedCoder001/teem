import { useUserStore } from "@/lib/store/userStore"

const Ws = () => {
  const user = useUserStore((state) => state.user)
  return (
    <div>{user?.firstName} {user?.email} {user?.lastName} {user?.id}</div>
  )
}

export default Ws