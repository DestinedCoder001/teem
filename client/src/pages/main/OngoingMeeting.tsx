import MeetingContent from "@/components/custom/OngoingMeetContent";
import AgoraRTC, { AgoraRTCProvider, useRTCClient, type ClientConfig } from "agora-rtc-react";

const OngoingMeeting = () => {
  const config = { mode: "rtc", codec: "vp8" };

  const useClient = useRTCClient(AgoraRTC.createClient(config as ClientConfig));

  return (
    <AgoraRTCProvider client={useClient}>
      <MeetingContent />
    </AgoraRTCProvider>
  );
};

export default OngoingMeeting;
