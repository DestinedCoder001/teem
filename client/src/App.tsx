import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import { Toaster } from "sonner";
import AuthLayout from "./components/custom/layouts/AuthLayout";
import ProtectRoutes from "./components/custom/layouts/ProtectRoutes";
import AppLayout from "./components/custom/layouts/AppLayout";
import Tasks from "./pages/main/Tasks";
import UserProfile from "./pages/main/Profile";
import DefaultHome from "./pages/main/DefaultHome";
import ChannelSkeleton from "./components/custom/ChannelSkeleton";
import Channel from "./pages/main/Channel";
import NotFound from "./components/custom/NotFound";
import Settings from "./pages/main/Settings";
import User from "./pages/main/User";
import Notifications from "./pages/main/Notifications";
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
            <Route index element={<DefaultHome />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="channels" element={<ChannelSkeleton />} />
            <Route path="channels/:channelId" element={<Channel />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="users/:userId" element={<User />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound text="Page not found" />} />
      </Routes>
    </>
  );
}

export default App;
