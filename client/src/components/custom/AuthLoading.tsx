import { useEffect, useState } from "react";
import LoadingSvg from "./LoadingSvg";

const AuthLoading = () => {
  /* to show additional text if server is taking time to respond
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
      {responsePending && (
        <div className="mt-6 text-slate-600 dark:text-slate-200 font-medium flex items-center gap-x-2">
          <span className="text-xs">Connecting to server </span>
          <div className="dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthLoading;
