import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/store/authStore";
import { useRefresh } from "@/lib/hooks/useRefresh";
import type { AxiosError } from "axios";
import AuthLoading from "../AuthLoading";
import AuthError from "../AuthError";

const ProtectRoutes = () => {
  const { accessToken, setAccessToken } = useAuthStore();
  const [checked, setChecked] = useState(false);
  const { data, isPending, isError, error } = useRefresh();

  // useEffect(() => {
  //   if (!accessToken && data?.accessToken) {
  //     setAccessToken(data.accessToken);
  //     setChecked(true);
  //   } else if (!accessToken && isError) {
  //     setChecked(true);
  //   } else if (accessToken) {
  //     setChecked(true);
  //   }
  // }, [accessToken, data?.accessToken, isError, setAccessToken]);

  // if (!checked || isPending) {
  //   return <AuthLoading />;
  // }

  const axiosErr = error as AxiosError<{ message?: string }>;
  const message = axiosErr?.response?.data?.message || "";
  const isTokenError =
    (axiosErr?.response?.status === 401 &&
      (message.toLowerCase().includes("expired") ||
        message.toLowerCase().includes("invalid"))) ||
    message.toLowerCase().includes("no user found");

  // if (isError && error) {
  //   let err;
  //   if (error.message === "Network Error") {
  //     err = "Network error";
  //   } else {
  //     err = "Something went wrong while restoring your session."
  //   }
  //   if (!useAuthStore.getState().accessToken && !isTokenError) {
  //     return <AuthError error={err} />;
  //   }
  // }

  // if (isTokenError) {
  //   return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  // }

  return <Outlet />;
};

export default ProtectRoutes;
