import UserCard from "@/components/custom/UserCard";
import { Button } from "@/components/ui/button";
import { LogOut, Mic, MonitorUp, Video } from "lucide-react";
import cover from "@/assets/nikolai-lehmann-agEBTnS_Nuc-unsplash.jpg";

const Meeting = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#303438] p-4 md:p-6">
      <div className="flex flex-1 flex-col lg:flex-row gap-4 overflow-hidden">
        <div className="flex-1 flex items-center justify-center bg-neutral-900 rounded-sm overflow-hidden">
          <img
            src={cover}
            alt="Shared Screen"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex lg:flex-col gap-4 overflow-auto no-scrollbar">
          <UserCard
            name="Display Name"
            src="https://randomuser.me/api/portraits/women/44.jpg"
          />
          <UserCard
            name="Display Name"
            src="https://randomuser.me/api/portraits/women/65.jpg"
          />
          <UserCard
            name="Display Name"
            src="https://randomuser.me/api/portraits/women/44.jpg"
          />
          <UserCard
            name="Display Name"
            src="https://randomuser.me/api/portraits/women/65.jpg"
          />
          <UserCard
            name="Display Name"
            src="https://randomuser.me/api/portraits/women/44.jpg"
          />
          <UserCard
            name="Display Name"
            src="https://randomuser.me/api/portraits/women/65.jpg"
          />
        </div>
      </div>

      <div className="flex justify-center gap-4 py-4">
        
        <div className="flex flex-col items-center gap-1 text-white">
          <Button className="p-3 rounded-md bg-[#181A1C]  hover:bg-[#080808]">
            <Video size={28} strokeWidth={2.5} />
          </Button>
          <p className="text-xs font-medium">Video</p>
        </div>

        <div className="flex flex-col items-center gap-1 text-white">
          <Button className="p-3 rounded-md bg-[#181A1C] hover:bg-[#080808]">
            <Mic size={28} strokeWidth={2.5} />
          </Button>
          <p className="text-xs font-medium">Mic</p>
        </div>

        <div className="flex flex-col items-center gap-1 text-white">
          <Button className="p-3 rounded-md bg-[#181A1C] hover:bg-[#080808]">
            <MonitorUp size={28} strokeWidth={2.5} />
          </Button>
          <p className="text-xs font-medium">Share</p>
        </div>

        <div className="flex flex-col items-center gap-1 text-white">
          <Button className="p-3 rounded-md bg-[#F04438] text-white hover:bg-[#e12929]">
            <LogOut size={28} strokeWidth={2.5} />
          </Button>
          <p className="text-xs font-medium">Leave</p>
        </div>

      </div>
    </div>
  );
};

export default Meeting;
