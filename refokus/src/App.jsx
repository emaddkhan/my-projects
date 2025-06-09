import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Work from "./components/Work";
import Stripes from "./components/Stripes";
import Products from "./components/Products";
import Marques from "./components/Marques";
import Cards from "./components/Cards";
import Footer from "./components/Footer";
import LocomotiveScroll from "locomotive-scroll";
import IntroScreen from "./components/IntroScreen";
import { useScroll } from "motion/react";

function App() {
  const locomotiveScroll = new LocomotiveScroll();
  const [isLoading,setIsLoading]=useState(true)
  return (
    <div className="h-full  w-full bg-[#1C1C1C] text-white">
      {isLoading?(
      <IntroScreen setIsLoading={setIsLoading}/>

      ):(
        <>
        <Navbar />
      <Work />
      <Stripes />
      <Products />
      <Marques />
      <Cards />
      <Footer />
        </>
      )}
      
    </div>
  );
}

export default App;
