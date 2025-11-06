import React, { use, useState } from "react";
import Home from "./Components/Home";
import About from "./Components/About";
import Work from "./Components/Work";
import Footer from "./Components/Footer";
import MouseFollower from "./Components/MouseFollower";
import IntroScreen from "./Components/introScreen";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  return (
    <div className=" bg-brand-black relative">
      {setShowIntro ? (
        <IntroScreen />
      ) : (
        <>
          <MouseFollower />
          <Home />
          <About />
          <Work />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
