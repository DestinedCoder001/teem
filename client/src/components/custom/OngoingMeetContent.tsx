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
  } = useLocalScreenTrack(screenShareOn, {systemAudio: "include"}, "auto");

  const { uplinkNetworkQuality, downlinkNetworkQuality } = useNetworkQuality();
  const { mutate, data } = useJoinMeeting();
  const { currentWsData } = useGetWsDetails();
  const { meetingId } = useParams();
  const { user } = useGetMe();
  const { _id: wsId } = currentWsDetails((state) => state);

  const mainRef = useRef<HTMLDivElement>(null);

  // Track selected user for main display
  const [selectedUser, setSelectedUser] = useState<{
    _id: string;
    name: string;
    profilePicture?: string;
    videoTrack?: IRemoteVideoTrack;
    hasVideo?: boolean;
  } | null>(null);

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

  const trackToPublish =
    screenShareOn && screenTrack
      ? Array.isArray(screenTrack)
        ? screenTrack // [video, audio]
        : [screenTrack] // only video
      : null;

  usePublish(
    [
      micOn ? localMicrophoneTrack : null,
      !screenShareOn && cameraOn ? localCameraTrack : null,
      ...(trackToPublish ?? []),
    ],
    canJoin
  );

  // Remote users
  const remoteUsers = useRemoteUsers();
  const { videoTracks } = useRemoteVideoTracks(remoteUsers);
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  audioTracks.forEach((t) => t.play());

  const remoteAudioMap = Object.fromEntries(
    audioTracks.map((at) => [String(at.getUserId()), at])
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
        const userId = u._id;
        const userVideoTrack = videoTracks.find(
          (vt) => String(vt.getUserId()) === userId
        );
        const audioTrack = remoteAudioMap[userId];
        return {
          ...u,
          videoTrack: userVideoTrack,
          hasVideo: !!userVideoTrack,
          hasAudio: !!audioTrack,
        };
      }
    );

  // Main display logic
  useEffect(() => {
    if (!mainRef.current) return;
    mainRef.current.innerHTML = "";

    // If selected user exists but lost video -> revert to my own stream/content
    if (selectedUser && !selectedUser.hasVideo) {
      setSelectedUser(null);
    }

    if (selectedUser?.videoTrack && selectedUser.hasVideo) {
      selectedUser.videoTrack.play(mainRef.current);
      requestAnimationFrame(() => {
        const vids = mainRef.current!.getElementsByTagName("video");
        const vid = vids[vids.length - 1] as HTMLVideoElement | null;
        if (!vid) return;
        vid.style.transform = "";
        vid.style.objectFit = "contain";
      });
    } else if (screenShareOn && screenTrack) {
      const videoTrack = Array.isArray(screenTrack)
        ? screenTrack[0]
        : screenTrack;
      videoTrack.play(mainRef.current);
      requestAnimationFrame(() => {
        const vids = mainRef.current!.getElementsByTagName("video");
        const vid = vids[vids.length - 1] as HTMLVideoElement | null;
        if (!vid) return;
        vid.style.transform = "";
        vid.style.objectFit = "contain";
      });
    } else if (cameraOn && localCameraTrack) {
      localCameraTrack.play(mainRef.current);
      requestAnimationFrame(() => {
        const vids = mainRef.current!.getElementsByTagName("video");
        const vid = vids[vids.length - 1] as HTMLVideoElement | null;
        if (!vid) return;
        vid.style.transform = "scaleX(-1)";
        vid.style.objectFit = "contain";
      });
    }
  }, [selectedUser, cameraOn, localCameraTrack, screenShareOn, screenTrack]);

  useEffect(() => {
    if (screenTrack) {
      const videoTrack = Array.isArray(screenTrack)
        ? screenTrack[0]
        : screenTrack;

      const handleTrackEnded = async () => {
        setScreenShareOn(false);
        try {
          await videoTrack.setEnabled(false);
          await videoTrack.close();
        } catch (e) {
          console.error("Failed to disable or close screen track:", e);
        }

        // ✅ Re-enable camera if it was on
        if (cameraOn && localCameraTrack) {
          try {
            await localCameraTrack.setEnabled(true);
          } catch (e) {
            console.error("Failed to re-enable camera after screen share:", e);
          }
        }

        toast.info("Screen sharing stopped");
      };

      videoTrack.on("track-ended", handleTrackEnded);
      return () => {
        videoTrack.off("track-ended", handleTrackEnded);
      };
    }

    if (screenError) {
      setScreenShareOn(false);
      toast.error("Screen sharing failed");
    }
  }, [screenTrack, screenError, cameraOn, localCameraTrack]);

  useEffect(() => {
    if (screenShareOn) {
      setCameraOn(false);
      if (localCameraTrack) {
        localCameraTrack
          .setEnabled(false)
          .catch((e) =>
            console.error("Failed to disable camera during screen share:", e)
          );
      }
    }
  }, [screenShareOn, localCameraTrack]);

  useEffect(() => {
    if (!selectedUser) return;
    const stillInCall = remoteUsers.some(
      (ru) => String(ru.uid) === selectedUser._id && ru.videoTrack
    );
    if (!stillInCall) {
      setSelectedUser(null);
    }
  }, [remoteUsers, selectedUser]);

  const toggleMic = async () => {
    if (!localMicrophoneTrack) {
      setMicOn((v) => !v);
      return;
    }
    try {
      await localMicrophoneTrack.setEnabled(!micOn);
      setMicOn((v) => !v);
    } catch {
      toast.error("Couldn't toggle mic");
    }
  };

  const toggleCamera = async () => {
    if (!localCameraTrack) {
      setCameraOn((v) => !v);
      return;
    }
    try {
      await localCameraTrack.setEnabled(!cameraOn);
      setCameraOn((v) => !v);
    } catch {
      toast.error("Couldn't toggle camera");
    }
  };

  const toggleScreenShare = async () => {
    if (!screenShareOn) {
      setScreenShareOn(true);
      return;
    } else {
      setScreenShareOn(false);
      if (screenTrack) {
        const videoTrack = Array.isArray(screenTrack)
          ? screenTrack[0]
          : screenTrack;
        try {
          await videoTrack.setEnabled(false);
          await videoTrack.close();
        } catch (e) {
          console.error("Error closing screen track on stop:", e);
        }
      }

      // ✅ Re-enable camera if it was supposed to be on
      if (cameraOn && localCameraTrack) {
        try {
          await localCameraTrack.setEnabled(true);
        } catch (e) {
          console.error("Failed to re-enable camera after screen share:", e);
        }
      }
    }
  };

  const leave = () => setConnected(false);

  const showCameraOff =
    (!selectedUser && !cameraOn && !screenShareOn) ||
    (selectedUser && !selectedUser.hasVideo && !cameraOn && !screenShareOn);

  return (
    <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-white dark:bg-[#262728] pt-2 px-4 pb-4 md:pt-4 md:px-6 md:pb-6">
      {data?.channel && (
        <h2 className="text-lg mx-auto my-2 dark:text-white truncate">
          {data.channel}
        </h2>
      )}

      <div className="flex flex-1 flex-col lg:flex-row gap-4 overflow-hidden">
        <div className="flex-1 flex items-center justify-center bg-neutral-900 rounded-sm overflow-hidden relative">
          {showSignal && (
            <div className="absolute top-4 left-4 bg-black/60 p-2 text-xs text-white z-10">
              <SignalDisplay
                up={uplinkNetworkQuality}
                down={downlinkNetworkQuality}
              />
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-black/60 p-2 text-white z-10 text-sm rounded-sm">
            {selectedUser?.name || "You"}
          </div>
          <div ref={mainRef} className="w-full h-full object-contain" />
          {showCameraOff && (
            <div className="absolute inset-0 flex items-center justify-center text-white/50 text-2xl">
              <VideoOff size={40} color="#BBB" />
            </div>
          )}
          {selectedUser &&
            !selectedUser.hasVideo &&
            selectedUser.profilePicture && (
              <img
                src={selectedUser.profilePicture}
                alt={selectedUser.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
        </div>

        <div className="flex lg:flex-col gap-4 overflow-auto no-scrollbar">
          {inCallUsers.map((u) => (
            <div
              key={u._id}
              onClick={() =>
                setSelectedUser((prev) =>
                  prev?._id === u._id
                    ? null
                    : {
                        _id: u._id,
                        name: `${u.firstName} ${u.lastName}`,
                        profilePicture: u.profilePicture,
                        videoTrack: u.videoTrack,
                        hasVideo: u.hasVideo,
                      }
                )
              }
              className="cursor-pointer"
            >
              <UserCard
                name={`${u.firstName} ${u.lastName}`}
                src={u.profilePicture}
                videoTrack={u.videoTrack}
                videoOn={u.hasVideo}
                audioOn={u.hasAudio}
                isSelected={selectedUser?._id === u._id}
              />
            </div>
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
