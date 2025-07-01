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
            <Route path="workspace" element={<Ws />} />
            <Route path="channels" element={<Channel />} />
            <Route path="tasks" element={<h1>Hello tasks</h1>} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
