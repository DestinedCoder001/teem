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
  useNetworkQuality,
} from "agora-rtc-react";
import UserCard from "@/components/custom/UserCard";
import useJoinMeeting from "@/lib/hooks/useJoinMeeting";
import { useParams } from "react-router-dom";
import { currentWsDetails } from "@/lib/store/userStore";
import useGetWsDetails from "@/lib/hooks/useGetWsDetails";
import useGetMe from "@/lib/hooks/useGetMe";
import type { ChannelUser } from "@/lib/types";
import { toast } from "sonner";
import SignalDisplay from "./SignalDisplay";
import MeetControls from "./MeetControls";

const APP_ID = import.meta.env.VITE_AGORA_APP_ID!;

const MeetingContent = () => {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [connected, setConnected] = useState(true);
  const [showSignal, setShowSignal] = useState(false);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  const { uplinkNetworkQuality, downlinkNetworkQuality } = useNetworkQuality();
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
  const remoteVideosMap = Object.fromEntries(
    videoTracks.map((vt) => [vt.getUserId(), vt])
  );
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  audioTracks.forEach((t) => t.play());
  const remoteAudioMap = Object.fromEntries(
    audioTracks.map((at) => [at.getUserId(), at])
  );

  const inCallUsers = ((currentWsData?.users as ChannelUser[]) || [])
    .filter((u) => remoteUsers.some((ru) => String(ru.uid) === u._id))
    .map(
      (
        user
      ): ChannelUser & {
        videoTrack?: IRemoteVideoTrack;
        hasVideo?: boolean;
        hasAudio?: boolean;
      } => {
        const videoTrack = remoteVideosMap[user._id];
        const audioTrack = remoteAudioMap[user._id];
        return {
          ...user,
          videoTrack,
          hasVideo: !!videoTrack,
          hasAudio: !!audioTrack,
        };
      }
    );

  const toggleMic = async () => {
    if (!localMicrophoneTrack) return;
    const enabled = !micOn;
    try {
      await localMicrophoneTrack.setEnabled(enabled);
      setMicOn(enabled);
    } catch {
      toast.error("Couldn't toggle mic", { position: "top-center" });
    }
  };

  const toggleCamera = async () => {
    if (!localCameraTrack) return;
    const enabled = !cameraOn;
    try {
      await localCameraTrack.setEnabled(enabled);
      setCameraOn(enabled);
    } catch {
      toast.error("Couldn't toggle camera", { position: "top-center" });
    }
  };

  const leave = () => {
    setConnected(false);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-white dark:bg-[#262728] pt-2 px-4 pb-4 md:pt-4 md:px-6 md:pb-6">
      {data?.channel && (
        <h2
          title={data.channel}
          className="text-xl mx-auto font-medium dark:text-white w-max max-w-[300px] my-2 truncate"
        >
          {data.channel}
        </h2>
      )}
      <div className="flex flex-1 flex-col lg:flex-row gap-4 overflow-hidden">
        <div className="flex-1 flex items-center justify-center bg-neutral-900 rounded-sm overflow-hidden relative">
          {showSignal && (
            <div className="absolute bg-black/60 top-4 px-2 py-1 left-4 rounded-xs z-10 text-xs opacity-70">
              <SignalDisplay
                up={uplinkNetworkQuality}
                down={downlinkNetworkQuality}
              />
            </div>
          )}
          <div className="absolute bg-black/60 text-white bottom-4 px-2 py-1 left-4 rounded-xs z-10 text-sm">
            You
          </div>
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
              audioOn={user.hasAudio}
            />
          ))}
        </div>
      </div>

      <MeetControls
        cameraOn={cameraOn}
        micOn={micOn}
        toggleCamera={toggleCamera}
        toggleMic={toggleMic}
        leave={leave}
        showSignal={showSignal}
        setShowSignal={setShowSignal}
      />
    </div>
  );
};

export default MeetingContent;
