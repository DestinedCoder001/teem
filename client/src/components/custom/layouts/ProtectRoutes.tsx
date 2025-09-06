import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/store/authStore";
import { useRefresh } from "@/lib/hooks/useRefresh";
import type { AxiosError } from "axios";
import AuthLoading from "../AuthLoading";
import AuthError from "../AuthError";
import useSubscribeNotifs from "@/lib/hooks/useSubscribeNotifs";

const ProtectRoutes = () => {
  const { accessToken, setAccessToken } = useAuthStore();
  const [checked, setChecked] = useState(false);

  const shouldRefresh = !accessToken;
  const { data, isPending, isError, error } = useRefresh();

  useEffect(() => {
    if (accessToken) {
      setChecked(true);
      return;
    }

    if (data?.accessToken) {
      setAccessToken(data.accessToken);
      setChecked(true);
      return;
    }

    if (isError) {
      setChecked(true);
      return;
    }
  }, [accessToken, data?.accessToken, isError, setAccessToken]);

  // Subscribe to channel and chat notifications only after auth is resolved
  useSubscribeNotifs();

  if (!checked || (shouldRefresh && isPending)) {
    return <AuthLoading />;
  }

  if (!accessToken && isError && error) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const message = axiosErr?.response?.data?.message || "";

    const isTokenError =
      (axiosErr?.response?.status === 401 &&
        (message.toLowerCase().includes("expired") ||
          message.toLowerCase().includes("invalid"))) ||
      message.toLowerCase().includes("no user found");

    if (isTokenError) {
      return (
        <Navigate to="/login" state={{ from: location.pathname }} replace />
      );
    }

    let errorMessage;
    if (error.message === "Network Error") {
      errorMessage = "Network error";
    } else {
      errorMessage = "Something went wrong while restoring your session.";
    }

    return <AuthError error={errorMessage} />;
  }

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default ProtectRoutes;
