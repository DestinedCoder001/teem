import { useState, useCallback } from "react";
import { toast } from "sonner";
import type {
  ILocalVideoTrack,
  ILocalAudioTrack,
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
} from "agora-rtc-react";

interface UseMeetingControlsProps {
  localMicrophoneTrack: IMicrophoneAudioTrack | null;
  localCameraTrack: ICameraVideoTrack | null;
  client: IAgoraRTCClient | null;
  currentPublishedTracks: (ILocalVideoTrack | ILocalAudioTrack)[];
  setCurrentPublishedTracks: (
    tracks: (ILocalVideoTrack | ILocalAudioTrack)[]
  ) => void;
  setConnected: (connected: boolean) => void;
}

interface UseMeetingControlsReturn {
  micOn: boolean;
  cameraOn: boolean;
  screenShareOn: boolean;
  micLoading: boolean;
  cameraLoading: boolean;
  screenLoading: boolean;
  setMicOn: (value: boolean) => void;
  setCameraOn: (value: boolean) => void;
  setScreenShareOn: (value: boolean) => void;
  toggleMic: () => Promise<void>;
  toggleCamera: () => Promise<void>;
  toggleScreenShare: () => Promise<void>;
  leave: (screenTrack?: ILocalVideoTrack | [ILocalVideoTrack, ILocalAudioTrack] | null) => Promise<void>;
  isAnyLoading: boolean;
}

export const useMeetingControls = ({
  localMicrophoneTrack,
  localCameraTrack,
  client,
  currentPublishedTracks,
  setCurrentPublishedTracks,
  setConnected,
}: UseMeetingControlsProps): UseMeetingControlsReturn => {
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [screenShareOn, setScreenShareOn] = useState(false);

  const [micLoading, setMicLoading] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);

  const toggleMic = useCallback(async () => {
    if (!localMicrophoneTrack || micLoading) return;

    setMicLoading(true);

    try {
      const newState = !micOn;
      await localMicrophoneTrack.setEnabled(newState);
      setMicOn(newState);
    } catch (error) {
      console.error("Error toggling microphone:", error);
      toast.error("Failed to toggle microphone");
    } finally {
      setMicLoading(false);
    }
  }, [localMicrophoneTrack, micOn, micLoading]);

  const toggleCamera = useCallback(async () => {
    if (!localCameraTrack || cameraLoading || screenShareOn) return;

    setCameraLoading(true);

    try {
      const newState = !cameraOn;
      await localCameraTrack.setEnabled(newState);
      setCameraOn(newState);
    } catch (error) {
      console.error("Error toggling camera:", error);
      toast.error("Failed to toggle camera");
    } finally {
      setCameraLoading(false);
    }
  }, [localCameraTrack, cameraOn, cameraLoading, screenShareOn]);

  const toggleScreenShare = useCallback(async () => {
    if (screenLoading) return;

    setScreenLoading(true);

    try {
      const newState = !screenShareOn;
      setScreenShareOn(newState);

      if (newState) {
        if (cameraOn && localCameraTrack) {
          await localCameraTrack.setEnabled(false);
          setCameraOn(false);
        }
        toast.info("Screen sharing started");
      } else {
        toast.info("Screen sharing stopped");
      }
    } catch (error) {
      console.error("Error toggling screen share:", error);
      toast.error("Screen sharing failed");
      setScreenShareOn(false);
    } finally {
      setScreenLoading(false);
    }
  }, [
    screenShareOn,
    screenLoading,
    cameraOn,
    localCameraTrack,
  ]);

  const leave = useCallback(async (screenTrack?: ILocalVideoTrack | [ILocalVideoTrack, ILocalAudioTrack] | null) => {
    setConnected(false);

    try {
      if (client && currentPublishedTracks.length > 0) {
        await client.unpublish(currentPublishedTracks).catch(console.warn);
      }

      const cleanupPromises = [];

      if (localCameraTrack) {
        cleanupPromises.push(
          localCameraTrack
            .setEnabled(false)
            .then(() => localCameraTrack.close())
            .catch(console.warn)
        );
      }

      if (localMicrophoneTrack) {
        cleanupPromises.push(
          localMicrophoneTrack
            .setEnabled(false)
            .then(() => localMicrophoneTrack.close())
            .catch(console.warn)
        );
      }

      if (screenTrack) {
        const tracks = Array.isArray(screenTrack) ? screenTrack : [screenTrack];
        cleanupPromises.push(
          Promise.allSettled(tracks.map((track) => track.close()))
        );
      }

      await Promise.allSettled(cleanupPromises);
      setCurrentPublishedTracks([]);
    } catch (error) {
      console.error("Error during leave:", error);
    }
  }, [
    client,
    localCameraTrack,
    localMicrophoneTrack,
    currentPublishedTracks,
    setConnected,
    setCurrentPublishedTracks,
  ]);

  const isAnyLoading = micLoading || cameraLoading || screenLoading;

  return {
    micOn,
    cameraOn,
    screenShareOn,
    micLoading,
    cameraLoading,
    screenLoading,
    setMicOn,
    setCameraOn,
    setScreenShareOn,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    leave,
    isAnyLoading,
  };
};