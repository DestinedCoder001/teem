import type { IRemoteVideoTrack } from "agora-rtc-react";
import { MicOff } from "lucide-react";
import { useEffect, useRef } from "react";

type UserCardProps = {
  name: string;
  src: string;
  videoTrack?: IRemoteVideoTrack;
  videoOn?: boolean;
  audioOn?: boolean;
};

const UserCard = ({
  name,
  src,
  videoTrack,
  videoOn = true,
  audioOn = true,
}: UserCardProps) => {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (videoTrack && videoOn) {
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
  }, [videoTrack, videoOn]);

  return (
    <div className="rounded-sm overflow-hidden shrink-0 w-48 relative bg-black">
      {!audioOn && (
        <div className="bg-black/60 absolute top-2 right-2 rounded-sm z-10 p-1">
          <MicOff size={16} />
        </div>
      )}
      {videoTrack && videoOn ? (
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
