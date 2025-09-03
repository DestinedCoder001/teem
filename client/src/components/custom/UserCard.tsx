import type { IRemoteVideoTrack } from "agora-rtc-react";
import { MicOff } from "lucide-react";
import { useEffect, useRef } from "react";

type UserCardProps = {
  name: string;
  src: string;
  videoTrack?: IRemoteVideoTrack;
  videoOn?: boolean;
  audioOn?: boolean;
  isSelected?: boolean;
};

const UserCard = ({
  name,
  src,
  videoTrack,
  videoOn = true,
  audioOn = true,
  isSelected = false,
}: UserCardProps) => {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (videoTrack && videoOn && !isSelected) {
        // Only play video if NOT in main screen
        videoTrack.stop();
        videoTrack.play(videoRef.current);
      } else if (videoTrack) {
        videoTrack.stop();
      }
    }

    return () => {
      if (videoTrack) {
        videoTrack.stop();
      }
    };
  }, [videoTrack, videoOn, isSelected]);

  return (
    <div
      className={`rounded-sm overflow-hidden shrink-0 w-48 relative bg-black ${
        isSelected ? "border-2 border-primary" : ""
      }`}
    >
      {!audioOn && (
        <div className="bg-black/60 text-white absolute top-2 right-2 rounded-sm z-10 p-1">
          <MicOff size={16} />
        </div>
      )}
      {videoTrack && videoOn && !isSelected ? (
        <div ref={videoRef} className="w-full h-28" />
      ) : (
        <img src={src} alt={name} className="w-full h-28 object-cover" />
      )}
      <div className="absolute left-1 bottom-1 rounded-xs px-1 bg-black/60 text-sm text-white truncate max-w-5/6">
        {name}
      </div>
    </div>
  );
};

export default UserCard;