import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/auth/SignUp";
import AuthLayout from "./components/custom/AuthLayout";
import Login from "./pages/auth/Login";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
