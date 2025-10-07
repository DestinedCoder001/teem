import { useEffect, useState, useRef, useCallback } from "react";
import {
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  useLocalScreenTrack,
  useRemoteUsers,
  useRemoteAudioTracks,
  useRemoteVideoTracks,
  type IRemoteVideoTrack, useRTCClient,
  type ILocalVideoTrack,
  type ILocalAudioTrack
} from "agora-rtc-react";
import UserCard from "@/components/custom/UserCard";
import useJoinMeeting from "@/lib/hooks/useJoinMeeting";
import { useParams } from "react-router-dom";
import { currentWsDetails } from "@/lib/store/userStore";
import useGetWsDetails from "@/lib/hooks/useGetWsDetails";
import useGetMe from "@/lib/hooks/useGetMe";
import type { ChannelUser } from "@/lib/types";
import { toast } from "sonner";
import MeetControls from "./MeetControls";
import { VideoOff } from "lucide-react";
import LeftMeeting from "./LeftMeeting";
import type { AxiosError } from "axios";
import NotFound from "./NotFound";
import AppError from "./AppError";
import { useMeetingControls } from "@/lib/hooks/useMeetingControls";
import { Skeleton } from "../ui/skeleton";

const APP_ID = import.meta.env.VITE_AGORA_APP_ID!;

const MeetingContent = () => {
  const [connected, setConnected] = useState(true);
  const client = useRTCClient();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(true);
  const { localCameraTrack } = useLocalCameraTrack(true);

  const {
    mutate,
    data,
    error: joinError,
    isPending: joinPending,
  } = useJoinMeeting();
  const { currentWsData } = useGetWsDetails();
  const { meetingId } = useParams();
  const { user } = useGetMe();
  const { _id: wsId } = currentWsDetails((state) => state);

  const mainRef = useRef<HTMLDivElement>(null);

  const [selectedUser, setSelectedUser] = useState<{
    _id: string;
    name: string;
    profilePicture?: string;
    videoTrack?: IRemoteVideoTrack;
    hasVideo?: boolean;
  } | null>(null);

  const [currentPublishedTracks, setCurrentPublishedTracks] = useState<
    (ILocalVideoTrack | ILocalAudioTrack)[]
  >([]);
  const [hasInitiallyPublished, setHasInitiallyPublished] = useState(false);

  // Initialize meeting controls hook
  const {
    micOn,
    cameraOn,
    screenShareOn,
    setScreenShareOn,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    leave,
    isAnyLoading,
  } = useMeetingControls({
    localMicrophoneTrack,
    localCameraTrack,
    client,
    currentPublishedTracks,
    setCurrentPublishedTracks,
    setConnected,
  });

  const {
    screenTrack,
    isLoading: screenTrackLoading,
    error: screenError,
  } = useLocalScreenTrack(screenShareOn, { systemAudio: "include" }, "auto");

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

  const tracksToPublish = useCallback(() => {
    const tracks = [];

    if (micOn && localMicrophoneTrack) {
      tracks.push(localMicrophoneTrack);
    }

    if (screenShareOn && screenTrack) {
      if (Array.isArray(screenTrack)) {
        tracks.push(...screenTrack);
      } else {
        tracks.push(screenTrack);
      }
    } else if (cameraOn && localCameraTrack && !screenShareOn) {
      tracks.push(localCameraTrack);
    }

    return tracks;
  }, [
    micOn,
    localMicrophoneTrack,
    screenShareOn,
    screenTrack,
    cameraOn,
    localCameraTrack,
  ]);

  useEffect(() => {
    if (!canJoin || !connected || !client) return;

    const updateTracks = async () => {
      try {
        const newTracks = tracksToPublish();

        const tracksChanged =
          currentPublishedTracks.length !== newTracks.length ||
          !currentPublishedTracks.every((currentTrack) =>
            newTracks.some((newTrack) => newTrack === currentTrack)
          ) ||
          !newTracks.every((newTrack) =>
            currentPublishedTracks.some(
              (currentTrack) => currentTrack === newTrack
            )
          );

        if (!tracksChanged && hasInitiallyPublished) return;

        const tracksToUnpublish = currentPublishedTracks.filter(
          (currentTrack) => !newTracks.includes(currentTrack)
        );

        const tracksToPublishNew = newTracks.filter(
          (newTrack) => !currentPublishedTracks.includes(newTrack)
        );

        if (tracksToUnpublish.length > 0) {
          await client.unpublish(tracksToUnpublish).catch(console.warn);
        }

        if (tracksToPublishNew.length > 0) {
          await client.publish(tracksToPublishNew);
        }

        setCurrentPublishedTracks(newTracks);
        setHasInitiallyPublished(true);
      } catch (error) {
        console.error("Error updating published tracks:", error);
      }
    };

    updateTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    canJoin,
    connected,
    client,
    localMicrophoneTrack,
    localCameraTrack,
    screenTrack,
    micOn,
    cameraOn,
    screenShareOn,
    hasInitiallyPublished,
  ]);

  const remoteUsers = useRemoteUsers();
  const { videoTracks } = useRemoteVideoTracks(remoteUsers);
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  useEffect(() => {
    audioTracks.forEach((track) => track.play());
  }, [audioTracks]);

  const remoteAudioMap = Object.fromEntries(
    audioTracks.map((at) => [String(at.getUserId()), at])
  );

  const inCallUsers = ((currentWsData?.users as ChannelUser[]) || [])
    .filter((u) => remoteUsers.some((ru) => String(ru.uid) === u._id))
    .map((u) => {
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
    });

  useEffect(() => {
    if (!mainRef.current) return;
    mainRef.current.innerHTML = "";

    if (selectedUser && !selectedUser.hasVideo) {
      setSelectedUser(null);
    }

    const displayVideo = (
      track: IRemoteVideoTrack | ILocalVideoTrack,
      shouldMirror = false
    ) => {
      if (mainRef.current) track.play(mainRef.current);
      requestAnimationFrame(() => {
        const videos = mainRef.current!.getElementsByTagName("video");
        const video = videos[videos.length - 1] as HTMLVideoElement;
        if (video) {
          video.style.transform = shouldMirror ? "scaleX(-1)" : "";
          video.style.objectFit = "contain";
        }
      });
    };

    if (selectedUser?.videoTrack && selectedUser.hasVideo) {
      displayVideo(selectedUser.videoTrack);
    } else if (screenShareOn && screenTrack) {
      const videoTrack = Array.isArray(screenTrack)
        ? screenTrack[0]
        : screenTrack;
      displayVideo(videoTrack);
    } else if (cameraOn && localCameraTrack && !screenShareOn) {
      displayVideo(localCameraTrack, true);
    }
  }, [selectedUser, cameraOn, localCameraTrack, screenShareOn, screenTrack]);

  useEffect(() => {
    if (!screenTrack || !screenShareOn) return;

    const videoTrack = Array.isArray(screenTrack)
      ? screenTrack[0]
      : screenTrack;

    const handleTrackEnded = () => {
      setScreenShareOn(false);
      toast.info("Screen sharing stopped");
    };

    videoTrack.on("track-ended", handleTrackEnded);
    return () => videoTrack.off("track-ended", handleTrackEnded);
  }, [screenTrack, screenShareOn, setScreenShareOn]);

  useEffect(() => {
    if (screenError) {
      setScreenShareOn(false);
      toast.error("Screen sharing failed");
    }
  }, [screenError, setScreenShareOn]);

  useEffect(() => {
    if (!selectedUser) return;

    const stillHasVideo = remoteUsers.some(
      (ru) => String(ru.uid) === selectedUser._id && ru.videoTrack
    );

    if (!stillHasVideo) {
      setSelectedUser(null);
    }
  }, [remoteUsers, selectedUser]);

  const handleLeave = useCallback(async () => {
    await leave(screenTrack);
  }, [leave, screenTrack]);

  const handleUserSelect = useCallback(
    (
      user: ChannelUser & {
        videoTrack?: IRemoteVideoTrack;
        hasVideo?: boolean;
        hasAudio?: boolean;
      }
    ) => {
      setSelectedUser((prev) =>
        prev?._id === user._id
          ? null
          : {
              _id: user._id,
              name: `${user.firstName} ${user.lastName}`,
              profilePicture: user.profilePicture,
              videoTrack: user.videoTrack,
              hasVideo: user.hasVideo,
            }
      );
    },
    []
  );

  const showCameraOff =
    (!selectedUser && !cameraOn && !screenShareOn) ||
    (selectedUser && !selectedUser.hasVideo && !cameraOn && !screenShareOn);

  const finalIsAnyLoading = isAnyLoading || screenTrackLoading;

  if (joinError) {
    const err = joinError as AxiosError;
    if (err.status === 404) {
      return <NotFound text="Meeting not found" />;
    }
    return (
      <div className="h-[100dvh]">
        <AppError />
      </div>
    );
  }

  if (!connected) {
    return <LeftMeeting />;
  }

  return (
    <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-white dark:bg-[#262728] pt-2 px-4 pb-4 md:pt-4 md:px-6 md:pb-6">
      {joinPending ? (
        <Skeleton className="h-8 w-40 rounded-md mx-auto my-2 bg-gray-300 dark:bg-[#363a3d]" />
      ) : data?.channel ? (
        <h2 className="text-lg mx-auto my-2 dark:text-white truncate">
          {data.channel}
        </h2>
      ) : null}

      <div className="flex flex-1 flex-col landscape:flex-row gap-4 overflow-hidden">
        <div className="flex-1 flex items-center justify-center bg-neutral-900 rounded-sm overflow-hidden relative">
          <div className="absolute bottom-4 left-4 bg-black/60 p-2 text-white z-10 text-sm rounded">
            {selectedUser?.name || "You"}
          </div>

          <div ref={mainRef} className="w-full h-full" />

          {showCameraOff && (
            <div className="absolute inset-0 flex items-center justify-center">
              <VideoOff size={48} className="text-gray-400" />
            </div>
          )}

          {selectedUser?.profilePicture && !selectedUser.hasVideo && (
            <img
              src={selectedUser.profilePicture}
              alt={selectedUser.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex lg:flex-col gap-4 overflow-auto">
          {inCallUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserSelect(user)}
              className="cursor-pointer flex-shrink-0"
            >
              <UserCard
                name={`${user.firstName} ${user.lastName}`}
                src={user.profilePicture}
                videoTrack={user.videoTrack}
                videoOn={user.hasVideo}
                audioOn={user.hasAudio}
                isSelected={selectedUser?._id === user._id}
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
        leave={handleLeave}
        toggleScreenShare={toggleScreenShare}
        isSharingScreen={screenShareOn}
        screenLoading={finalIsAnyLoading}
      />
    </div>
  );
};

export default MeetingContent;
