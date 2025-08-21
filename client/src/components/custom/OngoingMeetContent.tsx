import { useState } from "react";
import {
    useJoin,
    useLocalCameraTrack,
    useLocalMicrophoneTrack,
    usePublish,
    useRemoteUsers,
    useRemoteAudioTracks
} from "agora-rtc-react";
import UserCard from "@/components/custom/UserCard";
import { Button } from "@/components/ui/button";
import { LogOut, Mic, MicOff, MonitorUp, Video, VideoOff } from "lucide-react";

const APP_ID = import.meta.env.VITE_AGORA_APP_ID!;
const CHANNEL_NAME = "test-meeting";
const TOKEN = null;

const MeetingContent = () => {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [connected, setConnected] = useState(true);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  useJoin(
    {
      appid: APP_ID,
      channel: CHANNEL_NAME,
      token: TOKEN,
      uid: undefined,
    },
    connected
  );

  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  audioTracks.forEach((t) => t.play());

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#303438] p-4 md:p-6">
      <div className="flex flex-1 flex-col lg:flex-row gap-4 overflow-hidden">
        <div className="flex-1 flex items-center justify-center bg-neutral-900 rounded-sm overflow-hidden">
          {localCameraTrack && cameraOn ? (
            <div
              ref={(ref) => localCameraTrack.play(ref!)}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-white">Camera Off</div>
          )}

          {remoteUsers.map((user) => (
            <div key={user.uid} className="absolute top-2 left-2 w-1/3 h-1/3">
              {user.videoTrack && user.videoTrack.play && (
                <div ref={(ref) => user.videoTrack!.play(ref!)} />
              )}
            </div>
          ))}
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
        </div>
      </div>

      <div className="flex justify-center gap-4 py-4 text-white">
        <div className="flex flex-col items-center gap-1">
          <Button
            className="p-3 rounded-md bg-[#181A1C] hover:bg-[#080808]"
            onClick={() => setCameraOn((c) => !c)}
          >
            {cameraOn ? (
              <Video size={28} strokeWidth={2.5} />
            ) : (
              <VideoOff size={28} strokeWidth={2.5} />
            )}
          </Button>
          <p className="text-xs font-medium">Video</p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button
            className="p-3 rounded-md bg-[#181A1C] hover:bg-[#080808]"
            onClick={() => setMicOn((m) => !m)}
          >
            {
              micOn ? (
                <Mic size={28} strokeWidth={2.5} />
              ) : (
                <MicOff size={28} strokeWidth={2.5} />
              )
            }
          </Button>
          <p className="text-xs font-medium">Mic</p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button className="p-3 rounded-md bg-[#181A1C] hover:bg-[#080808]">
            <MonitorUp size={28} strokeWidth={2.5} />
          </Button>
          <p className="text-xs font-medium">Share</p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button
            className="p-3 rounded-md bg-[#F04438] text-white hover:bg-[#e12929]"
            onClick={() => setConnected(false)}
          >
            <LogOut size={28} strokeWidth={2.5} />
          </Button>
          <p className="text-xs font-medium">Leave</p>
        </div>
      </div>
    </div>
  );
};

export default MeetingContent;
