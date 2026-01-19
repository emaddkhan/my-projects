import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import React from "react";
import { useRef } from "react";
import img1 from "../../src/assets/imgAgency1.jpg"
import img2 from "../../src/assets/imgAgency2.jpg"
import img3 from "../../src/assets/imgAgency3.jpg"
import img4 from "../../src/assets/imgAgency4.jpg"
import img5 from "../../src/assets/imgAgency5.jpg"
import img6 from "../../src/assets/imgAgency6.jpg"
import img7 from "../../src/assets/imgAgency7.jpg"
import img8 from "../../src/assets/imgAgency8.jpg"

  gsap.registerPlugin(ScrollTrigger);

function Agency() {
  const imageDivRef = useRef(null);
  const imageRef =useRef(null);
  const imagesArray = [img1,img2,img3,img4,img5,img6,img7,img8]
  useGSAP(()=> {
    gsap.to(imageDivRef.current, {

      scrollTrigger: {
        trigger:imageDivRef.current,
        start:"top 23%",
        end:"top -138%",
        scrub:1,
        pin:true,
        pinSpacing:true,
        pinReparent:true,
        anticipatePin:true,
        invalidateOnRefresh:true,
        pinType:'transform',
        markers:true,
        onUpdate:(elem)=>{
          let imageIndex ;
          if(elem.progress<1){
            imageIndex =Math.floor(elem.progress * imagesArray.length)
          }
          else{
            imageIndex =imagesArray.length-1; 
          }
          imageRef.current.src =imagesArray[imageIndex]
        }
      },
    });
  });
  
  return (
    <div>
      <div className="section1 relative py-1">
        <div
          ref={imageDivRef}
          className="h-[20vw]  w-[15vw] -top-[7vw] left-[30.4vw] overflow-hidden rounded-3xl absolute"
        >
          <img
            ref={imageRef}
            className="h-full w-full object-cover"
            src={img1}
            alt=""
          />
        </div>
        <div className="relative font-[font2] ">
          <div className="mt-[55vh]">
            <h1 className="text-[20vw] text-center leading-[18vw] uppercase ">
              SEVEN7Y TWO
            </h1>
          </div>
          <div className="pl-[40%] mt-20">
            <p className=" text-6xl text-start">
              {" "}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We’re
              inquisitive and open-minded, and we make sure creativity crowds
              out ego from every corner. A brand is a living thing, with values,
              a personality and a story. If we ignore that, we can achieve
              short-term success, but not influence that goes the distance. We
              bring that perspective to every brand story we help tell.
            </p>
          </div>
        </div>
      </div>
      <div className="section2 h-screen"></div>
    </div>
  );
}

export default Agency;

