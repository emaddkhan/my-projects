import React from "react";
import man3 from "../assets/Group 2376.png";
import arrow3 from "../assets/Vector 193.png";
import bulb from "../assets/lightbulb.png";
import send from "../assets/send.png"
import keyboard from "../assets/keyboard.png"
import mail from "../assets/mail.png"

function Form() {
  return (
    <div className="h-screen w-full flex justify-center items-center border-b-2 border-brand-grey bg-brand-blue">
      <div className="w-[90%] h-[70%] flex justify-between items-center ">
        <div className="w-[28%] lineer absolute  h-screen border-r-2 border-brand-grey "></div>
        <div className="left px-5 h-full  relative z-1 w-[48%]">
          <h1 className="font-poppins mt-8 ml-4 font-bold text-7xl text-brand-white leading-snug">
            Got a project in <br />
            <span className="text-brand-cyan">mind?</span>
          </h1>

          <img className="ml-[36%]" src={man3} alt="" />
          <img className="absolute top-[46%] left-[10%]" src={arrow3} alt="" />
          <img src={bulb} className="absolute top-[20%] left-[83%]" alt="" />
        </div>
        <div className="right relative h-full w-[47%] mr-3 bg-brand-cya">
          <img src={keyboard} className="absolute -top-[15%] left-[20%]" alt="" />
          <div className="p-3 mt-10 ml-8  w-full flex gap-8 ">
            <div>
              <h3 className="font-poppins font-semibold text-[2vh] text-brand-white">
                Your name
              </h3>
              <input
                className="mt-3 text-brand-white outline-none font-poppins font-semibold bg-brand-grey px-8 py-4 rounded-2xl text-[2vh]"
                type="text"
                placeholder="Name"
              />
            </div>
            <div>
              <h3 className="font-poppins font-semibold text-[2vh] text-brand-white">
                Your email
              </h3>
              <input
                className="mt-3 text-brand-white outline-none font-poppins font-semibold bg-brand-grey px-8 py-4 rounded-2xl text-[2vh]"
                type="email"
                placeholder="Email"
              />
            </div>
          </div>
          <div className="ml-8 h-[46%] p-3 w-full">
              <h3 className="font-poppins font-semibold text-[2vh] text-brand-white">
                Your message
              </h3>
              <textarea
                className="mt-3 resize-none text-brand-white outline-none font-poppins w-[83.5%] h-full font-semibold bg-brand-grey px-8 py-4 rounded-2xl text-[2vh]"
                type="email"
                placeholder="Message"
              />
            </div>
            <div className="p-3 ml-8 mt-10">
              <button className="flex items-center gap-2 tracking-tight text-xl font-poppins px-7 py-3 outline-none bg-brand-cyan rounded-full font-semibold text-brand-white">Send Message <img src={send} alt="" /></button>
            </div>
            <img src={mail} className="absolute right-[18%]"  alt="" />
        </div>
      </div>
    </div>
  );
}

export default Form;
