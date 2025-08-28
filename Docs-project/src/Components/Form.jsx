import React, { useRef } from "react";
import { GrClose } from "react-icons/gr";
import { motion } from "motion/react"


function Form({ formCloseBtnHandeler }) {
      const ref =useRef(null)

  
  return (
    <div className="h-screen w-full fixed top-0 left-0 bg-zinc-900/80 z-[5]">
      <div className="w-full py-7 px-16  flex items-center justify-end">
        <GrClose
          onClick={formCloseBtnHandeler}
          className="cursor-pointer text-3xl text-white"
        />
      </div>
      <div ref={ref} className="h-[90%] w-full flex items-center justify-center ">
        <motion.div   dragElastic={.1} dragTransition={{bounceStiffness:100,bounceDamping:30}} drag dragConstraints={ref} className="h-[90%] shadow-md shadow-white w-[30%] rounded-2xl overflow-hidden bg-zinc-50">
          <div className="py-5 w-full bg-green-300">
            <h1 className="text-center text-white text-xl font-semibold">
              Add User
            </h1>
          </div>
          <div className="w-full py-6 px-10 ">
            <form action="">
              <div>
                <label className="block text-lg font-semibold">Name</label>
                <input
                  type="text"
                  name=""
                  placeholder="User name"
                  className="w-[98%] py-2 outline-none px-4 font-semibold rounded-lg border-2 mt-2"
                />
              </div>
              <div className="flex mt-2 w-full p-1 justify-between items-center">
                <div className="w-48%">
                  <label className="block  font-semibold">Cell number:</label>
                  <input
                    type="text"
                    name=""
                    placeholder="User cell"
                    className="w-[98%] py-2 outline-none px-4 font-semibold rounded-lg border-2 mt-1"
                  />
                </div>
                <div className="w-48%">
                  <label className="block  font-semibold">Phone number:</label>
                  <input
                    type="text"
                    name=""
                    placeholder="User Phone"
                    className="w-[98%] py-2 outline-none px-4 font-semibold rounded-lg border-2 mt-1"
                  />
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-lg font-semibold">Email:</label>
                <input
                  type="email"
                  name=""
                  placeholder="User Email"
                  className="w-[98%] py-2 outline-none px-4 font-semibold rounded-lg border-2 mt-1"
                />
              </div>
              <div className="mt-2">
                <label className="block text-lg font-semibold">Country:</label>
                <input
                  type="text"
                  name=""
                  placeholder="User Country"
                  className="w-[98%] py-2 outline-none px-4 font-semibold rounded-lg border-2 mt-1"
                />
              </div>
              <div className="flex mt-5 justify-between items-center w-full py-3 ">
                <button type="button" className="px-12 py-2 bg-red-600 text-white font-semibold text-md rounded-full">Clear</button>
                <button type="submit" className="px-12 py-2 bg-green-600 text-white font-semibold text-md rounded-full">Submit</button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Form;
