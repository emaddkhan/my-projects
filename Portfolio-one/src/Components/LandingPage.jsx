import React from "react";
import fb from "../assets/Social Icons.png";
import twitter from "../assets/Vector (1).png";
import insta from "../assets/Social Icons (1).png";
import linkedin from "../assets/Social Icons (2).png";
import github from "../assets/Social Icons (3).png";
import profile from "../assets/profilePic.png";
import "../css/home.css";

function LandingPage() {
  return (
    <div className="h-[86vh] landingPage mt-20 p-1 flex justify-between items-center  w-full ">
      <div className="left  flex items-center w-[50%] h-full">
        <div className="p-1">
          <div>
            <h1 className="text-5xl homeHeading tracking-tight font-bold text-white uppercase">
              <span className="text-brand-paragrey">Mr.</span> Emad Khan
            </h1>
            <p className="text-white homePara w-[82%] mt-8 font-semibold capitalize">
              I’m Emad Khan, a curious creator who loves solving problems,
              building meaningful digital experiences, exploring new ideas, and
              constantly pushing boundaries to grow personally and
              professionally.
            </p>
          </div>
          <button className="mt-16 relative cursor-none homeBtn font-semibold px-12 py-2 text-white bg-brand-navGrey rounded-md overflow-hidden group">
            <a
              href="https://www.linkedin.com/in/emaddkhan/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="relative z-10">Hire Me</span>
            </a>

            <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-[100%] transition-all duration-700 ease-in-out"></span>
          </button>

          <div className="mt-16 linksTile flex gap-16 items-center">
            {[
              { name: insta, link: "https://www.instagram.com/emiinster/" },
              {
                name: linkedin,
                link: "https://www.linkedin.com/in/emaddkhan/",
              },
              { name: github, link: "https://github.com/emaddkhan" },
            ].map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2"
              >
                <img
                  src={item.name}
                  alt=""
                  className="w-6 h-6 object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="w-[48%]  flex justify-center items-center h-full homeRight right">
        <img
          className="rounded-full homeImg shadow-[0_0_45px_18px_rgba(163,163,163,0.4)]"
          src={profile}
          alt=""
        />
      </div>
    </div>
  );
}

export default LandingPage;
