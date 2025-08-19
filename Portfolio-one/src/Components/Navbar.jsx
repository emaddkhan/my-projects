import React, { useState } from "react";
import "../css/home.css";

function Navbar() {
  const [open, setOpen] = useState(false);
  const menuHandler = () => {
    setOpen(!open);
  };
  return (
    <div className="nav w-[85.4%] fixed top-5 z-50 h-[9vh] bg-brand-navGrey flex justify-between items-center rounded-full shadow-lg shadow-gray-600/30">
      <div className="download   w-[19.5%] flex justify-center items-center">
        <a
          href="/Profile.pdf"
          download
          className="group relative overflow-hidden downloadBtn text-white cursor-none font-semibold px-16 py-3 rounded-full bg-brand-black"
        >
          <span className="block transition-transform duration-500 ease-in-out group-hover:-translate-y-10">
            Download Resume
          </span>
          <span className="absolute left-0 top-0 w-full h-full flex items-center justify-center transition-transform duration-500 ease-in-out translate-y-full group-hover:translate-y-0">
            🚀 Download Resume
          </span>
        </a>
      </div>
      <div className="w-[29.5%] links flex gap-16 items-center">
        {[
          { name: "Home", link: "#home" },
          { name: "About", link: "#about" },
          { name: "Projects", link: "#work" },
          { name: "Contacts", link: "#contact" },
        ].map((item, index) => {
          return (
            <a className="text-white font-semibold" href={item.link}>
              {item.name}
            </a>
          );
        })}
      </div>
      <div className="menu hidden w-[13%] h-full">
        <div
          onClick={menuHandler}
          className="flex z-10 flex-col justify-center gap-[15%]"
        >
          <div
            className={`h-[2%] transition-transform rounded duration-300 ${
              open ? "rotate-45 translate-y-1 w-4" : ""
            } w-9  bg-white`}
          ></div>
          <div
            className={`h-[1%] w-9 rounded transition-transform duration-300 bg-white ${
              open ? "-rotate-45 w-4 -translate-y-1" : ""
            }`}
          ></div>
        </div>
      </div>
      <div
        className={`absolute top-[120%]  right-0 w-[100%] bg-brand-navGrey rounded-lg overflow-hidden transition-all duration-700 ease-in-out ${
          open ? "max-h-[25vh] pb-3 pt-3" : "max-h-0"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <a
            href="#home"
            onClick={() => setOpen(false)}
            className="text-white font-semibold"
          >
            Home
          </a>
          <a
            href="#about"
            onClick={() => setOpen(false)}
            className="text-white font-semibold"
          >
            About
          </a>
          <a
            href="#work"
            onClick={() => setOpen(false)}
            className="text-white font-semibold"
          >
            Projects
          </a>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="text-white font-semibold"
          >
            Contacts
          </a>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
