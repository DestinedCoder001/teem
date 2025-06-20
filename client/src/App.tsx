import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/auth/SignUp";
import AuthLayout from "./components/layout/AuthLayout";
import Login from "./pages/auth/Login";

function App() {

  return (
    <Routes>
      <Route element={<AuthLayout />}>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
