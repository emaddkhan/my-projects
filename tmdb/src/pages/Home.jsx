import React from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import Banner from "../components/Banner";

function Home() {
  return (
    <div className="h-screen relative w-full">
      <div className="fixed w-full z-10">
        <Navbar />
        <Search />
      </div>
      <div className="pt-[5.8vw]"><Banner /></div>
    </div>
  );
}

export default Home;
