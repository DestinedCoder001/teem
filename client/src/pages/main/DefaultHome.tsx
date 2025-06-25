import wsHolder from "@/assets/ws-holder.png";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

function DefaultHome() {
  const {data} =useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("http://localhost:3001/api/users/me");
      return res.data;
    },
    retry: false
  })

  console.log(data)

  return (
    <div className="h-screen">
      <div className="h-full w-full flex flex-col items-center justify-center text-center">
        <div className="relative w-96 h-96">
          <img src={wsHolder} className="absolute top-0 left-0 h-full w-full grayscale-100 opacity-50" />
          {/* <Button className="absolute bottom-8 left-1/2 -translate-x-1/2 -translate-y-1/2">Create workspace</Button> */}
        </div>
      </div>
    </div>
  );
}

export default DefaultHome;
