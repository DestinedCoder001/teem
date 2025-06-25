import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/auth/SignUp";
import AuthLayout from "./components/custom/AuthLayout";
import Login from "./pages/auth/Login";
import { Toaster } from "sonner";
import DefaultHome from "./pages/main/DefaultHome";
import ProtectRoutes from "./components/custom/ProtectRoutes";

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
            <Route path="/" element={<DefaultHome />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
