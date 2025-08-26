import MeetingContent from "@/components/custom/OngoingMeetContent";
import AgoraRTC, {
  AgoraRTCProvider,
  AgoraRTCScreenShareProvider,
  useRTCClient,
  type ClientConfig,
} from "agora-rtc-react";

const OngoingMeeting = () => {
  const config: ClientConfig = { mode: "rtc", codec: "vp8" };

  const client = useRTCClient(AgoraRTC.createClient(config));
  const screenShareClient = useRTCClient(AgoraRTC.createClient(config));

  return (
    <AgoraRTCProvider client={client}>
      <AgoraRTCScreenShareProvider client={screenShareClient}>
        <MeetingContent />
      </AgoraRTCScreenShareProvider>
    </AgoraRTCProvider>
  );
};

export default OngoingMeeting;