import React from "react";
import footerLogo from "../assets/footerLogo.svg";

export default function HomeFooter() {
  const data = [
    {
      title: "THE BASICS",
      links: [
        "About TMDB",
        "Contact Us",
        "Api Documentayion",
        "API for Businesses",
        "System Status",
      ],
    },
    {
      title: "GET INVOLVED",
      links: [
        "Contribution Bible",
        "Add New Movie",
        "Add New TV Show",
        "Add New Person",
        "Discussion",
      ],
    },
    {
      title: "COMMUNITY",
      links: [
        "Help Center",
        "Forum",
        "Twitter",
        "Facebook",
        "Instagram",
      ],
    },{
        title: "LEGAL",
        links: [
          "Terms of Use",
            "API Terms of Use",
            "Privacy  Policy",
            "Cookie Policy",
        ]
    }
  ];
  return (
    <div className="h-[35.5vh] w-full bg-[#03243F] py-12">
      <div className="w-[55%] h-full gap-[4%] flex items-center mx-auto">
        <div className="w-[19%] flex flex-col justify-start items-end h-full ">
          <img className="w-[80%] " src={footerLogo} alt="footer logo" />
          <div className="mt-14 py-2 px-8 bg-white rounded text-[#01B4E4] ">
            <h1 className="font-bold text-xl ">Hi Jarvis!</h1>
          </div>
        </div>
        <div className="w-[75%] h-full flex pt-12 pb-2 gap-[2.5%]">
            {data.map((item,index) => (
                <div key={index} className="h-full w-[23%] ">
                    <h2 className="font-bold text-[1.2vw] leading-none text-white ">
                      {item.title}
                    </h2>
                    <ul className="cursor-pointer mt-4 text-sm text-gray-400">
                      {item.links.map((link, linkIndex) => (
                        <li key={linkIndex} className="font-semibold text-white">
                          {link}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
        </div>
      </div>
    </div>
  );
}
