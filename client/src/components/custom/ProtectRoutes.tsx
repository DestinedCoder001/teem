import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/store/authStore";
import { useRefresh } from "@/lib/hooks/useRefresh";
import Loading from "./Loading";

const ProtectRoutes = () => {
  const { accessToken, setAccessToken } = useAuthStore();
  const [checked, setChecked] = useState(false);
  const { data, isPending, isError } = useRefresh();

  useEffect(() => {
    if (!accessToken && data?.accessToken) {
      setAccessToken(data.accessToken);
      setChecked(true);
    } else if (!accessToken && isError) {
      setChecked(true);
    } else if (accessToken) {
      setChecked(true);
    }
  }, [accessToken, data?.accessToken, isError, setAccessToken]);

  if (!checked || isPending) {
    return (
      <Loading />
    );
  }

  if (!useAuthStore.getState().accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectRoutes;