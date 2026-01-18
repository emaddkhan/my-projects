import React, { useRef } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Agency from "./pages/Agency";
import Work from "./pages/Work";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Stairs from "./Components/common/Stairs";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agency" element={<Agency />} />
        <Route path="/projects" element={<Work />} />
      </Routes>
    </div>
  );
}

export default App;
