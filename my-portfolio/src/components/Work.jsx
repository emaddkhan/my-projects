import React from "react";
import doodle3 from "../assets/Projects Page.png";

function Work() {
  return (
    <div className="w-full h-screen bg-brand-blue">
      <div
        className="h-full w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${doodle3})` }}
      ></div>
    </div>
  );
}

export default Work;
