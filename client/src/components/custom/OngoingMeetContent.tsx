import { useEffect, useState, useRef } from "react";
import {
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  useLocalScreenTrack,
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
import { VideoOff } from "lucide-react";

const APP_ID = import.meta.env.VITE_AGORA_APP_ID!;

const MeetingContent = () => {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [connected, setConnected] = useState(true);
  const [showSignal, setShowSignal] = useState(false);
  const [screenShareOn, setScreenShareOn] = useState(false);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  const {
    screenTrack,
    isLoading: screenLoading,
    error: screenError,
  } = useLocalScreenTrack(screenShareOn, {}, "disable");
  const { uplinkNetworkQuality, downlinkNetworkQuality } = useNetworkQuality();
  const { mutate, data } = useJoinMeeting();
  const { currentWsData } = useGetWsDetails();
  const { meetingId } = useParams();
  const { user } = useGetMe();
  const { _id: wsId } = currentWsDetails((state) => state);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!meetingId || !currentWsData) return;
    mutate(
      { meetingId, wsId: currentWsData._id },
      {
        onSuccess: (data) =>
          (document.title = `${data?.channel} - Teem Meeting`),
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

  usePublish(
    [
      localMicrophoneTrack,
      !screenShareOn ? localCameraTrack : null,
      screenTrack ? screenTrack : null,
    ],
    canJoin
  );

  const remoteUsers = useRemoteUsers();
  const { videoTracks } = useRemoteVideoTracks(remoteUsers);
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  audioTracks.forEach((t) => t.play());

  const remoteVideosMap = Object.fromEntries(
    videoTracks.map((vt) => [vt.getUserId(), vt])
  );
  const remoteAudioMap = Object.fromEntries(
    audioTracks.map((at) => [at.getUserId(), at])
  );

  const inCallUsers = ((currentWsData?.users as ChannelUser[]) || [])
    .filter((u) => remoteUsers.some((ru) => String(ru.uid) === u._id))
    .map(
      (
        u
      ): ChannelUser & {
        videoTrack?: IRemoteVideoTrack;
        hasVideo?: boolean;
        hasAudio?: boolean;
      } => {
        const videoTrack = remoteVideosMap[u._id];
        const audioTrack = remoteAudioMap[u._id];
        return {
          ...u,
          videoTrack,
          hasVideo: !!videoTrack,
          hasAudio: !!audioTrack,
        };
      }
    );

  const [remoteScreenTrack, setRemoteScreenTrack] =
    useState<IRemoteVideoTrack | null>(null);
  useEffect(() => {
    const screenCandidate = videoTracks.find((vt) =>
      vt.getMediaStreamTrack().label.toLowerCase().includes("screen")
    );
    setRemoteScreenTrack(screenCandidate || null);
  }, [videoTracks]);

  const mainUserIsScreenSharing =
    screenShareOn && screenTrack && !screenLoading;
  const anotherUserIsScreenSharing = !!remoteScreenTrack;

  useEffect(() => {
    if (!mainRef.current) return;
    mainRef.current.innerHTML = "";
    if (anotherUserIsScreenSharing) {
      remoteScreenTrack.play(mainRef.current);
    } else if (mainUserIsScreenSharing) {
      screenTrack.play(mainRef.current);
    } else if (cameraOn && localCameraTrack) {
      localCameraTrack.play(mainRef.current);
    }
  }, [
    anotherUserIsScreenSharing,
    mainUserIsScreenSharing,
    remoteScreenTrack,
    screenTrack,
    cameraOn,
    localCameraTrack,
  ]);

  useEffect(() => {
    if (screenTrack) {
      const handleTrackEnded = async () => {
        setScreenShareOn(false);
        try {
          await screenTrack.setEnabled(false);
          await screenTrack.close();
        } catch (e) {
          console.error("Failed to disable or close screen track:", e);
        }
        setCameraOn(true);
        toast.info("Screen sharing stopped");
      };
      screenTrack.on("track-ended", handleTrackEnded);
      return () => {
        screenTrack.off("track-ended", handleTrackEnded);
      };
    }
    if (screenError) {
      setScreenShareOn(false);
      setCameraOn(true);
      toast.error("Screen sharing failed");
    }
  }, [screenTrack, screenError]);

  const toggleMic = async () => {
    if (!localMicrophoneTrack) return;
    try {
      await localMicrophoneTrack.setEnabled(!micOn);
      setMicOn((v) => !v);
    } catch {
      toast.error("Couldn't toggle mic");
    }
  };

  const toggleCamera = async () => {
    if (!localCameraTrack) return;
    try {
      await localCameraTrack.setEnabled(!cameraOn);
      setCameraOn((v) => !v);
    } catch {
      toast.error("Couldn't toggle camera");
    }
  };

  const toggleScreenShare = () => {
    setScreenShareOn((v) => {
      if (!v) setCameraOn(false);
      return !v;
    });
  };

  const leave = () => setConnected(false);

  const showCameraOff =
    !anotherUserIsScreenSharing && !mainUserIsScreenSharing && !cameraOn;

  return (
    <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-white dark:bg-[#262728] pt-2 px-4 pb-4 md:pt-4 md:px-6 md:pb-6">
      {data?.channel && (
        <h2 className="text-lg mx-auto my-2 dark:text-white truncate">
          {data.channel}
        </h2>
      )}

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 flex items-center justify-center bg-neutral-900 rounded-sm overflow-hidden relative">
          {showSignal && (
            <div className="absolute top-4 left-4 bg-black/60 p-2 text-xs text-white z-10">
              <SignalDisplay
                up={uplinkNetworkQuality}
                down={downlinkNetworkQuality}
              />
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-black/60 p-2 text-white z-10 text-sm">
            {anotherUserIsScreenSharing
              ? "Screen Share"
              : mainUserIsScreenSharing
              ? "You (Sharing Screen)"
              : "You"}
          </div>
          <div ref={mainRef} className="w-full h-full object-contain" />
          {showCameraOff && (
            <div className="absolute inset-0 flex items-center justify-center text-white/50 text-2xl">
              <VideoOff size={40} color="#BBB" />
            </div>
          )}
        </div>
        <div className="flex lg:flex-col gap-4 overflow-auto no-scrollbar">
          {inCallUsers.map((user) => (
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
        toggleScreenShare={toggleScreenShare}
        isSharingScreen={screenShareOn}
        screenLoading={screenLoading}
      />
    </div>
  );
};

export default MeetingContent;
