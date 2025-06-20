import { Outlet } from "react-router-dom";
import logo from "@/assets/teem-dark.png";
const AuthLayout = () => {
  return (
    <>
      <nav className="px-4 md:px-8">
        <div className="py-2">
          <img src={logo} className="w-12 h-12" />
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default AuthLayout;
