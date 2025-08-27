import React from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { motion } from "motion/react"

function Card({ data,reference }) {
  return (
    <motion.div drag dragConstraints={reference} whileDrag={{scale:1.1}} dragElastic={.1} dragTransition={{bounceStiffness:100,bounceDamping:30}} className="flex-shrink-0 relative w-60 h-72 text-white px-3 py-10 rounded-[45px] bg-zinc-900/90 overflow-hidden">
      {/* <FaRegFileAlt />
      <p className="mt-5 text-sm leading-tight font-semibold">
        {data.description}
      </p>
      <div className="footer absolute bottom-0 left-0  w-full  ">
        <div className="flex items-center justify-between py-3 px-8 mb-3">
          <h5>{data.fileSize}</h5>
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-zinc-600">
            {data.close ? (
              <IoClose color="#fff" size=".9em" />
            ) : (
              <MdOutlineFileDownload color="#fff" size=".9em" />
            )}
          </span>
        </div>
        {
          data.tag.isOpen&&(
            <div className={`tag w-full py-4 flex justify-center items-center ${data.tag.tagColor==="blue"?"bg-blue-600":"bg-green-600"}`}>
          <h3 className="text-sm font-semibold">{data.tag.tagTitle}</h3>
        </div>
          )
        }
      </div> */}
      <div className="w-16 h-16 mx-auto  rounded-full overflow-hidden">
        <img className="h-full w-full" src={data.picture.thumbnail} alt="" />
      </div>
      <h3 className="text-center text-md font-semibold mt-5">{data.name.title} {data.name.first} {data.name.last}</h3>
      <p className="mt-2">Cell: {data.cell}</p>
      <p>Phone: {data.phone}</p>
      <p className="flex items-center gap-1">Email: <span className="text-sm">{data.email}</span></p>
      <p>country: {data.location.country}</p>
    </motion.div>
  );
}

export default Card;
