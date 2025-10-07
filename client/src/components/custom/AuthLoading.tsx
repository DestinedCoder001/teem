import { useEffect, useState } from "react";
import LoadingSvg from "./LoadingSvg";

const AuthLoading = () => {
  /* to show loading bar if server is taking time to respond
   (e.g starting application after a long time)
   Render server is usually asleep during this time
  */
  const [responsePending, setResponsePending] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setResponsePending(true);
    }, 10000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      id="auth-loading"
      className="h-[100dvh] flex flex-col items-center justify-center"
    >
      <div className="loading-svg">
        <LoadingSvg />
      </div>

      <div
        style={{ visibility: responsePending ? "visible" : "hidden" }}
        className="h-[2px] w-40 bg-gray-300 dark:bg-neutral-600 translate-y-4 rounded-full overflow-hidden"
      >
        <div className="h-full w-1/2 bg-gradient-to-r from-primary to-secondary loading-bar" />
      </div>
    </div>
  );
};

export default AuthLoading;