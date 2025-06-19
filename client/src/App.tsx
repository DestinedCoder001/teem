import { useState } from "react";
import { Button } from "./components/ui/button";
import { Route, Routes } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<h1>Hello /</h1>} />
      <Route path="/channels" element={<h1>Hello channels</h1>} />
    </Routes>
  );
}

export default App;
