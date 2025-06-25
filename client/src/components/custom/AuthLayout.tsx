import { Outlet } from "react-router-dom";
import logo from "@/assets/teem.png";
const AuthLayout = () => {
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
