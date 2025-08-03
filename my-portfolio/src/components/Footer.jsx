import React from "react";
import home from "../assets/home.png";
import user from "../assets/user.png";
import phone from "../assets/phone.png";
import facebook from "../assets/Vector.png";
import twitter from "../assets/twitter.png";
import instagram from "../assets/instagram.png";
import youtube from "../assets/youtube.png";

function Footer({ sectionRefs }) {
  const handleScroll = (section) => {
    const sectionRef = sectionRefs[section];
    if (sectionRef && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="h-80 flex items-center bg-brand-blue w-full">
      <div className="w-[33%] lineer absolute h-80 border-r-2 border-brand-grey"></div>
      <div className="w-[50%] relative z-1 mx-auto bg-brand-cyn py-2 gap-12 flex flex-col items-center">
        {/* Top Nav Links */}
        <div className="flex justify-center gap-24">
          {[
            { pic: home, name: "Home" },
            { pic: user, name: "AboutMe" },
            { pic: phone, name: "Contact" },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleScroll(item.name)}
              className="flex cursor-pointer items-center gap-2 font-poppins text-xl text-brand-white"
            >
              <img src={item.pic} alt={item.name} />
              {item.name}
            </button>
          ))}
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-8">
          {[facebook, instagram, twitter, youtube].map((icon, i) => (
            <a
              key={i}
              href="#"
              className={`py-5 px-5 bg-[rgba(217,217,217,0.1)] rounded-full`}
            >
              <img src={icon} alt={`social-${i}`} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Footer;
