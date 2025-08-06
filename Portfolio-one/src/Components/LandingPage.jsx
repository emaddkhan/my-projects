import React from "react";
import fb from "../assets/Social Icons.png";
import twitter from "../assets/Vector (1).png";
import insta from "../assets/Social Icons (1).png";
import linkedin from "../assets/Social Icons (2).png";
import github from "../assets/Social Icons (3).png";
import profile from "../assets/Ellipse 3.png"

function LandingPage() {
  return (
    <div className="h-[86vh] mt-20 p-1 flex justify-between items-center  w-full ">
      <div className="left  flex items-center w-[50%] h-full">
        <div className="p-1">
          <div>
            <h1 className="text-5xl tracking-tight font-bold text-white uppercase">
              <span className="text-brand-paragrey">Mr.</span> Mokete Tyabekana
            </h1>
            <p className="text-white w-[82%] mt-8 font-semibold capitalize">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              pulvinar eget eros vel ultricies. Curabitur aliquam lacinia enim,
              quis maximus diam malesuada ac. Sed maximus orci malesuada,
            </p>
          </div>
          <button className="mt-16 font-semibold px-12 rounded py-2 text-white bg-brand-navGrey">
            Hire Me
          </button>
          <div className="mt-16 flex gap-16 items-center">
            {[fb, twitter, insta, linkedin, github].map((item, index) => {
              return <img src={item} alt="" />;
            })}
          </div>
        </div>
      </div>
      <div className="w-[48%]  flex justify-center items-center h-full right">
        <img className="rounded-full shadow-[0_0_45px_18px_rgba(163,163,163,0.4)]"  src={profile} alt="" />
      </div>
    </div>
  );
}

export default LandingPage;
