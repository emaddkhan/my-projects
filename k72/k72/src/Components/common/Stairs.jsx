import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef } from "react";
import { useLocation } from "react-router-dom";

function Stairs(props) {
  const currentPath = useLocation().pathname;
  console.log(currentPath);

  const stairParentRef = useRef(null);
  const pageRef= useRef(null);
  useGSAP(
    function () {
      const tl = gsap.timeline();
      tl.to(stairParentRef.current, {
        display: "block",
      });
      tl.from(".stair", {
        height: 0,
        stagger: {
          amount: -0.2,
        },
      });
      tl.to(".stair", {
        y: "100%",
        stagger: {
          amount: -0.2,
        },
      });
      tl.to(stairParentRef.current, {
        display: "none",
        opacity:0,
      });
      tl.to(".stair", {
        y: "0%",
        opacity:1,
      });
      tl.from(pageRef.current,{
        opacity:0,
        scale:1.3,
      })
    },
    [currentPath],
  );
  return (
    <div>
      <div ref={stairParentRef} className="w-full top-0 z-20 fixed h-screen">
        <div className="h-full w-full flex">
          <div className="stair h-full w-1/5 bg-black top-0"></div>
          <div className="stair h-full w-1/5  bg-black  top-0"></div>
          <div className="stair h-full w-1/5 bg-black top-0"></div>
          <div className="stair h-full w-1/5 bg-black  top-0"></div>
          <div className="stair h-full w-1/5 bg-black top-0"></div>
        </div>
      </div>
      <div ref={pageRef}>
        {props.children}
      </div>
    </div>
  );
}

export default Stairs;
