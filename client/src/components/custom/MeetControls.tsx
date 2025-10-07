import { Button } from "../ui/button";
import { LogOut, Mic, MicOff, MonitorUp, Video, VideoOff } from "lucide-react";

type Props = {
  cameraOn: boolean;
  micOn: boolean;
  isSharingScreen: boolean;
  screenLoading: boolean;
  toggleCamera: () => void;
  toggleMic: () => void;
  toggleScreenShare: () => void;
  leave: () => void;
};
const MeetControls = ({
  cameraOn,
  micOn,
  isSharingScreen,
  screenLoading,
  toggleCamera,
  toggleMic,
  leave,
  toggleScreenShare,
}: Props) => {
  return (
    <div className="flex justify-center gap-4 py-4 text-white">
      <div className="flex flex-col items-center gap-1">
        <Button
          disabled={screenLoading || isSharingScreen}
          size="lg"
          className={`p-3 rounded-md text-white ${
            cameraOn
              ? "bg-primary/90 hover:bg-primary"
              : " bg-[#181A1C] hover:bg-[#080808]"
          }`}
          onClick={toggleCamera}
        >
          {cameraOn ? (
            <Video size={28} strokeWidth={2.5} />
          ) : (
            <VideoOff size={28} strokeWidth={2.5} />
          )}
        </Button>
        <p className="text-xs font-medium text-black dark:text-white">Video</p>
      </div>

      <div className="flex flex-col items-center gap-1">
        <Button
          size="lg"
          className={`p-3 rounded-md text-white ${
            micOn
              ? "bg-primary/90 hover:bg-primary"
              : " bg-[#181A1C] hover:bg-[#080808]"
          }`}
          onClick={toggleMic}
        >
          {micOn ? (
            <Mic size={28} strokeWidth={2.5} />
          ) : (
            <MicOff size={28} strokeWidth={2.5} />
          )}
        </Button>
        <p className="text-xs font-medium text-black dark:text-white">Mic</p>
      </div>

      <div className="flex flex-col items-center gap-1">
        <Button
          disabled={screenLoading}
          size="lg"
          className={`p-3 rounded-md text-white ${
            isSharingScreen
              ? "bg-primary/90 hover:bg-primary"
              : " bg-[#181A1C] hover:bg-[#080808]"
          }`}
          onClick={toggleScreenShare}
        >
          <MonitorUp size={28} strokeWidth={2.5} />
        </Button>
        <p className="text-xs font-medium text-black dark:text-white">Share</p>
      </div>

      <div className="flex flex-col items-center gap-1">
        <Button
          size="lg"
          className="p-3 rounded-md bg-[#F04438] text-white hover:bg-[#e12929]"
          onClick={leave}
        >
          <LogOut size={28} strokeWidth={2.5} />
        </Button>
        <p className="text-xs font-medium text-black dark:text-white">Leave</p>
      </div>
    </div>
  );
};

export default MeetControls;
