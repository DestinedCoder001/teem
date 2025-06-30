import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import { Toaster } from "sonner";
import Ws from "./pages/main/Ws";
import Channel from "./pages/main/Channel";
import AuthLayout from "./components/custom/layouts/AuthLayout";
import ProtectRoutes from "./components/custom/layouts/ProtectRoutes";
import AppLayout from "./components/custom/layouts/AppLayout";
import New from "./pages/main/New";
function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectRoutes />}>
          <Route element={<AppLayout />}>
            <Route index element={<New />} />
            <Route path="w" element={<Ws />} />
            <Route path="c" element={<Channel />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
