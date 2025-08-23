import { useEffect, useState } from "react";
import {
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  useRemoteAudioTracks,
  useRemoteVideoTracks,
  type IRemoteVideoTrack,
} from "agora-rtc-react";
import UserCard from "@/components/custom/UserCard";
import { Button } from "@/components/ui/button";
import { LogOut, Mic, MicOff, MonitorUp, Video, VideoOff } from "lucide-react";
import useJoinMeeting from "@/lib/hooks/useJoinMeeting";
import { useParams } from "react-router-dom";
import { currentWsDetails } from "@/lib/store/userStore";
import useGetWsDetails from "@/lib/hooks/useGetWsDetails";
import useGetMe from "@/lib/hooks/useGetMe";
import type { ChannelUser } from "@/lib/types";

const APP_ID = import.meta.env.VITE_AGORA_APP_ID!;

const MeetingContent = () => {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [connected, setConnected] = useState(true);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  const { mutate, data } = useJoinMeeting();
  const { currentWsData } = useGetWsDetails();
  const { meetingId } = useParams();
  const { user } = useGetMe();
  const { _id: wsId } = currentWsDetails((state) => state);

  useEffect(() => {
    if (!meetingId || !currentWsData) return;
    mutate(
      { meetingId, wsId: currentWsData._id },
      {
        onSuccess: (data) => {
          document.title = `${data?.channel} - Teem Meeting`;
        },
      }
    );
  }, [meetingId, mutate, wsId, currentWsData]);

  const canJoin = !!data?.channel && !!data?.token && !!user?._id && connected;

  useJoin(
    {
      appid: APP_ID,
      channel: data?.channel,
      token: data?.token,
      uid: String(user?._id),
    },
    canJoin
  );

  usePublish([localMicrophoneTrack, localCameraTrack], canJoin);

  const remoteUsers = useRemoteUsers();
  const { videoTracks } = useRemoteVideoTracks(remoteUsers);
  const remoteUidsMap = Object.fromEntries(
    videoTracks.map((vt) => [vt.getUserId(), vt])
  );

  const inCallUsers = ((currentWsData?.users as ChannelUser[]) || [])
    .filter((u) => remoteUsers.some((ru) => String(ru.uid) === u._id))
    .map(
      (
        user
      ): ChannelUser & {
        videoTrack?: IRemoteVideoTrack;
        hasVideo?: boolean;
      } => ({
        ...user,
        videoTrack: remoteUidsMap[user._id],
        hasVideo: !!remoteUidsMap[user._id],
      })
    )
    .filter((u) => u._id !== user?._id);

  const toggleMic = async () => {
    if (!localMicrophoneTrack) return;
    const enabled = !micOn;
    await localMicrophoneTrack.setEnabled(enabled);
    setMicOn(enabled);
  };

  const toggleCamera = async () => {
    if (!localCameraTrack) return;
    const enabled = !cameraOn;
    await localCameraTrack.setEnabled(enabled);
    setCameraOn(enabled);
  };

  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  audioTracks.forEach((t) => t.play());

  return (
    <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-[#262728] p-4 md:p-6">
      <div className="flex flex-1 flex-col lg:flex-row gap-4 overflow-hidden">
        <div className="flex-1 flex items-center justify-center bg-neutral-900 rounded-sm overflow-hidden relative">
          {localCameraTrack && cameraOn ? (
            <div
              ref={(ref) => localCameraTrack.play(ref!)}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-white">Camera Off</div>
          )}
        </div>

        <div className="flex lg:flex-col gap-4 overflow-auto no-scrollbar">
          {inCallUsers?.map((user) => (
            <UserCard
              key={user._id}
              name={`${user.firstName} ${user.lastName}`}
              src={user.profilePicture}
              videoTrack={user.videoTrack}
              videoOn={user.hasVideo}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 py-4 text-white">
        <div className="flex flex-col items-center gap-1">
          <Button
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
          <p className="text-xs font-medium">Video</p>
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
          <p className="text-xs font-medium">Mic</p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button
            size="lg"
            className="p-3 rounded-md bg-[#181A1C] hover:bg-[#080808] text-white"
          >
            <MonitorUp size={28} strokeWidth={2.5} />
          </Button>
          <p className="text-xs font-medium">Share</p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button
            size="lg"
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
