import React, { act, useState } from "react";
import Logo from "../assets/logo.svg";
import Add from "../assets/add.png";
import User from "../assets/user.png";
import { Link, useNavigate } from "react-router-dom";
import search from "../assets/search.png";
function Navbar() {
  const navigate = useNavigate();
  const [activeNavTab, setActiveNavTab] = useState(null);
  const navItems = {
    movies: ["Popular", "Now Playing", "Up coming", "Top rated"],
    tv: ["Popular", "Airing Today", "On TV", "Top Rated"],
    person: ["Popular"],
    award: ["Popular", "Upcoming"],
  };
  const navLinks = [
    { key: "movies", label: "Movies", path: "/movies" },
    { key: "tv", label: "Tv Shows", path: "/tv" },
    { key: "person", label: "People", path: "/person" },
    { key: "award", label: "Awards", path: "/award" },
  ];
  const handleTabLink=(navKey,item)=>{
    navigate(`/${navKey}`,{
      state:{
        type:item,
      }
    })
  }
  return (
    <div className="w-full h-[3.4vw] bg-[#032541] relative py-3">
      <div className="navContainer w-[65%] h-full flex justify-between mx-auto px-2 ">
        <div className="navLeft w-[50%] px-2 items-center h-full flex justify-between">
          <Link to={"/"}>
            <img className="h-[1vw]" src={Logo} alt="" />
          </Link>
          {navLinks.map((nav) => {
            return (
              <div
                key={nav.key}
                className="relative"
                onMouseEnter={() => setActiveNavTab(nav.key)}
                onMouseLeave={() => setActiveNavTab(null)}
              >
                <Link
                  
                  to={nav.path}
                  className="font-bold text-white"
                >
                  {nav.label}
                </Link>
                {activeNavTab ===nav.key && (
                  <div
                    className="py-1 rounded w-[8vw] bg-white absolute transition-all duration-300 ease-in-out"
                    style={
                      activeNavTab === nav.key
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    <ul>
                      {navItems[nav.key].map((item, index) => (
                        <li
                          key={index}
                          className="py-1 px-2 hover:bg-[#DEE2E6] text-[.7vw] font-thin cursor-pointer"
                          onClick={()=>handleTabLink(nav.key,item)}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}

          {/* <Link
            onMouseEnter={() => setActiveNavTab("tv")}
            onMouseLeave={() => setActiveNavTab(null)}
            to={"/tv"}
            className="font-bold text-white"
          >
            Tv Shows
          </Link>
          <Link
            onMouseEnter={() => setActiveNavTab("person")}
            onMouseLeave={() => setActiveNavTab(null)}
            to={"/person"}
            className="font-bold text-white"
          >
            People
          </Link>
          <Link
            onMouseEnter={() => setActiveNavTab("award")}
            onMouseLeave={() => setActiveNavTab(null)}
            to={"/award"}
            className="font-bold text-white"
          >
            Awards
          </Link> */}
        </div>
        <div className="navRight flex justify-between items-center w-[15%] h-full">
          <img className="h-[20px]" src={Add} alt="Add" />
          <div className="p-[.6vw] rounded-full bg-white">
            <img className="h-[20px]" src={User} alt="User" />
          </div>
          <img className="h-[25px]" src={search} alt="Search" />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
