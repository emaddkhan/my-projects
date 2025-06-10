import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Work from "./components/Work";
import Stripes from "./components/Stripes";
import Products from "./components/Products";
import Marques from "./components/Marques";
import Cards from "./components/Cards";
import Footer from "./components/Footer";
import LocomotiveScroll from "locomotive-scroll";
import IntroScreen from "./components/IntroScreen";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const locomotiveScroll = new LocomotiveScroll();
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isLoading]);
  return (
    <div className="h-full w-full bg-[#161618] text-white relative overflow-hidden">
      {isLoading && <IntroScreen setIsLoading={setIsLoading} />}
      <div
        className={`transition-opacity duration-1000 ease-in-out ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Navbar />
        <Work />
        <Stripes />
        <Products />
        <Marques />
        <Cards />
        <Footer />
      </div>
    </div>
  );
}

export default App;
