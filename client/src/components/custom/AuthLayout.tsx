import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/lib/store/authStore";
import { useRefresh } from "@/lib/hooks/useRefresh";
import { useEffect, useState } from "react";
import logo from "@/assets/teem.png";
import AuthLoading from "./AuthLoading";

const AuthLayout = () => {
  const { accessToken, setAccessToken } = useAuthStore();
  const [checked, setChecked] = useState(false);
  const { data, isPending, isError } = useRefresh();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || "/";

  useEffect(() => {
    if (!accessToken && data?.accessToken) {
      setAccessToken(data.accessToken);
    }
  }, [accessToken, data?.accessToken, setAccessToken]);

  useEffect(() => {
    if (accessToken || isError) {
      setChecked(true);
    }
  }, [accessToken, isError]);

  if (!checked || isPending) return <AuthLoading />;

  if (accessToken) return <Navigate to={from} replace />;

  return (
    <>
      <nav className="px-4 md:px-8 sticky top-0 bg-white z-50">
        <div className="py-2">
          <img src={logo} className="w-12 h-12" />
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default AuthLayout;
